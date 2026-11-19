import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { TripStatus, UserRole, PaymentStatus } from "@prisma/client";
import { initializeTripWalletTx } from "./walletService";
import { config } from "../config";

export interface CurrentUser {
  userId: string;
  role: UserRole;
}

export interface ProviderPaymentCallbackPayload {
  providerReference: string;
  amount: number;
  currency: string;
  status: string;
  providerCallbackReference?: string;
  paymentId?: string;
  tripId?: string;
}

async function isActiveRepresentativeForCustomer(customerId: string, representativeId: string) {
  const link = await prisma.customerRepresentative.findFirst({
    where: {
      customerId,
      representativeId,
      status: "ACTIVE",
      revokedAt: null,
    },
  });

  return Boolean(link);
}

async function verifyCustomerOrRepresentativeForTrip(tripId: string, currentUser: CurrentUser) {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { transportRequest: true },
  });

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  if (currentUser.role === UserRole.CUSTOMER) {
    if (trip.customerId !== currentUser.userId) {
      throw new AppError("Forbidden", 403);
    }
    return trip;
  }

  if (currentUser.role === UserRole.AUTHORIZED_REPRESENTATIVE) {
    const transportRequest = trip.transportRequest;
    const authorized =
      transportRequest.authorizedRepresentativeId === currentUser.userId ||
      (await isActiveRepresentativeForCustomer(transportRequest.customerId, currentUser.userId));

    if (!authorized) {
      throw new AppError("Forbidden", 403);
    }

    return trip;
  }

  if (currentUser.role === UserRole.ADMIN) {
    return trip;
  }

  throw new AppError("Forbidden", 403);
}

function parseProviderPaymentStatus(status: string) {
  const normalized = status.trim().toLowerCase();
  if (["confirmed", "paid", "success", "completed", "succeeded"].includes(normalized)) {
    return PaymentStatus.CONFIRMED;
  }

  if (["failed", "failure", "rejected", "declined", "cancelled", "canceled", "error"].includes(normalized)) {
    return PaymentStatus.FAILED;
  }

  return null;
}

function isValidPaymentTransition(currentStatus: PaymentStatus, newStatus: PaymentStatus) {
  if (currentStatus === newStatus) {
    return true;
  }
  if (currentStatus === PaymentStatus.PENDING && (newStatus === PaymentStatus.CONFIRMED || newStatus === PaymentStatus.FAILED)) {
    return true;
  }
  return false;
}

export function resolveMockPaymentStatus(providerReference?: string): PaymentStatus {
  const normalized = (providerReference ?? "mock_success").trim().toLowerCase();

  if (normalized.includes("fail") || normalized.includes("error") || normalized.includes("decline")) {
    return PaymentStatus.FAILED;
  }

  return PaymentStatus.CONFIRMED;
}

async function finalizePaymentStatus(
  tx: Prisma.TransactionClient,
  payment: Prisma.PaymentGetPayload<{ include: { trip: true } }>,
  status: PaymentStatus,
  callbackReference?: string,
  allowSameStatus = false,
) {
  if (payment.status === status) {
    if (!allowSameStatus) {
      throw new AppError("Payment is already in the requested status", 400);
    }

    if (status === PaymentStatus.CONFIRMED && payment.trip.status !== TripStatus.BOOKED) {
      throw new AppError("Trip status mismatch for already confirmed payment", 409);
    }
    return payment;
  }

  if (!isValidPaymentTransition(payment.status, status)) {
    throw new AppError("Invalid payment status transition", 400);
  }

  if (status === PaymentStatus.FAILED) {
    const update = await tx.payment.updateMany({
      where: { id: payment.id, status: PaymentStatus.PENDING },
      data: {
        status: PaymentStatus.FAILED,
        providerCallbackReference: callbackReference ?? payment.providerCallbackReference,
      },
    });
    if (update.count !== 1) {
      const current = await tx.payment.findUnique({ where: { id: payment.id }, include: { trip: true } });
      if (allowSameStatus && current?.status === PaymentStatus.FAILED) {
        return current;
      }
      throw new AppError("Payment status changed while processing the callback", 409);
    }
    const updated = await tx.payment.findUnique({ where: { id: payment.id }, include: { trip: true } });
    if (!updated) throw new AppError("Payment not found", 404);
    return updated;
  }

  if (status === PaymentStatus.CONFIRMED) {
    if (payment.trip.status !== TripStatus.PAYMENT_PENDING) {
      throw new AppError("Trip is not awaiting payment confirmation", 400);
    }

    const paymentUpdate = await tx.payment.updateMany({
      where: { id: payment.id, status: PaymentStatus.PENDING },
      data: {
        status: PaymentStatus.CONFIRMED,
        providerCallbackReference: callbackReference ?? payment.providerCallbackReference,
      },
    });
    if (paymentUpdate.count !== 1) {
      const current = await tx.payment.findUnique({ where: { id: payment.id }, include: { trip: true } });
      if (allowSameStatus && current?.status === PaymentStatus.CONFIRMED && current.trip.status === TripStatus.BOOKED) {
        return current;
      }
      throw new AppError("Payment status changed while processing the callback", 409);
    }

    const tripUpdate = await tx.trip.updateMany({
      where: { id: payment.tripId, status: TripStatus.PAYMENT_PENDING },
      data: { status: TripStatus.BOOKED },
    });
    if (tripUpdate.count !== 1) {
      throw new AppError("Trip is no longer awaiting payment confirmation", 409);
    }

    await tx.transportRequest.update({
      where: { id: payment.trip.transportRequestId },
      data: { status: TripStatus.BOOKED },
    });

    await initializeTripWalletTx(tx, payment.id);
    const updatedPayment = await tx.payment.findUnique({ where: { id: payment.id }, include: { trip: true } });
    if (!updatedPayment) throw new AppError("Payment not found", 404);
    return updatedPayment;
  }

  throw new AppError("Unsupported payment status", 400);
}

export async function processProviderPaymentCallback(
  payload: ProviderPaymentCallbackPayload,
) {
  if (
    !payload ||
    typeof payload.providerReference !== "string" ||
    !payload.providerReference.trim() ||
    typeof payload.status !== "string" ||
    typeof payload.currency !== "string"
  ) {
    throw new AppError("Invalid payment callback payload", 400);
  }

  if (payload.currency !== config.paymentProviderCurrency) {
    throw new AppError("Invalid payment currency", 400);
  }

  if (typeof payload.amount !== "number" || Number.isNaN(payload.amount) || payload.amount <= 0) {
    throw new AppError("Invalid payment amount", 400);
  }

  const status = parseProviderPaymentStatus(payload.status);
  if (!status) {
    throw new AppError("Unsupported payment status", 400);
  }

  const payment = await prisma.payment.findUnique({
    where: { providerReference: payload.providerReference },
    include: { trip: true },
  });
  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (payload.paymentId && payload.paymentId !== payment.id) {
    throw new AppError("Payment reference mismatch", 400);
  }

  if (payload.tripId && payload.tripId !== payment.tripId) {
    throw new AppError("Payment trip mismatch", 400);
  }

  if (payload.providerReference !== payment.providerReference) {
    throw new AppError("Provider reference mismatch", 400);
  }

  if (payload.amount !== payment.amount) {
    throw new AppError("Payment amount mismatch", 400);
  }

  if (payment.status === status) {
    if (status === PaymentStatus.CONFIRMED && payment.trip.status !== TripStatus.BOOKED) {
      throw new AppError("Trip status mismatch for already confirmed payment", 409);
    }
    return payment;
  }

  try {
    return await prisma.$transaction(async (tx) =>
      finalizePaymentStatus(tx, payment, status, payload.providerCallbackReference, true),
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2002" || error.code === "P2034")
    ) {
      throw new AppError("Payment callback was already processed or conflicted; retry safely", 409);
    }
    throw error;
  }
}

export async function createTripPayment(tripId: string, payload: { providerReference?: string }, currentUser: CurrentUser) {
  const trip = await verifyCustomerOrRepresentativeForTrip(tripId, currentUser);

  if (trip.status !== TripStatus.PAYMENT_PENDING) {
    throw new AppError("Payment may only be created for trips awaiting payment", 400);
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { tripId },
  });

  if (existingPayment) {
    // Same trip already has a payment row. Treat this as an idempotent retry instead of a hard conflict
    // when the user is simply revisiting the payment step or a stale payment record still exists.
    if (payload.providerReference && existingPayment.providerReference === payload.providerReference) {
      return existingPayment;
    }

    // If the payment is still pending or failed, allow the same customer to safely re-use the existing record
    // instead of incorrectly surfacing a false duplicate-payment error.
    if (
      existingPayment.status === PaymentStatus.PENDING ||
      existingPayment.status === PaymentStatus.FAILED
    ) {
      return existingPayment;
    }

    throw new AppError("Payment already exists for this trip", 409);
  }

  const customerId = trip.customerId;
  if (!customerId) {
    throw new AppError("Trip does not have an associated customer", 500);
  }

  const mockModeEnabled = config.paymentMode === "mock" && config.environment !== "production";

  if (mockModeEnabled) {
    const mockStatus = resolveMockPaymentStatus(payload.providerReference);

    // Generate a unique provider reference for mock mode
    const providerReference = payload.providerReference ? `${payload.providerReference}_${Date.now()}` : `mock_${Date.now()}`;

    return prisma.$transaction(async (tx) => {
      const createdPayment = await tx.payment.create({
        data: {
          tripId,
          customerId,
          amount: trip.bookingAmount,
          status: PaymentStatus.PENDING,
          providerReference,
        },
      });

      const paymentWithTrip = await tx.payment.findUnique({
        where: { id: createdPayment.id },
        include: { trip: true },
      });

      if (!paymentWithTrip) {
        throw new AppError("Payment was not created successfully", 500);
      }

      return finalizePaymentStatus(
        tx,
        paymentWithTrip,
        mockStatus,
        `mock_${createdPayment.id}_${mockStatus.toLowerCase()}`,
      );
    });
  }

  // Live mode: handle idempotent payment creation with providerReference uniqueness
  if (payload.providerReference) {
    // Check if a payment with this providerReference already exists
    const existingPaymentByRef = await prisma.payment.findUnique({
      where: { providerReference: payload.providerReference },
    });

    if (existingPaymentByRef) {
      // If it belongs to the same trip, return it (idempotent)
      if (existingPaymentByRef.tripId === tripId) {
        return existingPaymentByRef;
      }

      // If it belongs to a different trip/customer, reject as conflict
      throw new AppError(
        "Payment reference already exists for a different transaction",
        409,
      );
    }
  }

  return prisma.payment.create({
    data: {
      tripId,
      customerId,
      amount: trip.bookingAmount,
      status: PaymentStatus.PENDING,
      providerReference: payload.providerReference,
    },
  });
}

export async function confirmTripPayment(paymentId: string, payload: { providerCallbackReference?: string }, currentUser: CurrentUser) {
  if (config.environment === "production" || config.paymentMode !== "mock") {
    throw new AppError(
      "Manual payment confirmation is available only in explicitly enabled mock mode outside production",
      403,
    );
  }

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { trip: true },
  });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  await verifyCustomerOrRepresentativeForTrip(payment.tripId, currentUser);

  return prisma.$transaction(async (tx) => {
    return finalizePaymentStatus(tx, payment, PaymentStatus.CONFIRMED, payload.providerCallbackReference);
  });
}

export async function getPayment(paymentId: string, currentUser: CurrentUser) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      trip: { include: { transportRequest: true } },
    },
  });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (currentUser.role === UserRole.CUSTOMER) {
    if (payment.customerId !== currentUser.userId) {
      throw new AppError("Forbidden", 403);
    }
    return payment;
  }

  if (currentUser.role === UserRole.AUTHORIZED_REPRESENTATIVE) {
    const customerId = payment.trip.customerId;
    const authorized =
      payment.trip.transportRequest.authorizedRepresentativeId === currentUser.userId ||
      (customerId !== null &&
        (await isActiveRepresentativeForCustomer(customerId, currentUser.userId)));
    if (!authorized) {
      throw new AppError("Forbidden", 403);
    }
    return payment;
  }

  if (currentUser.role === UserRole.ADMIN) {
    return payment;
  }

  throw new AppError("Unauthorized", 401);
}

export async function getTripPayment(tripId: string, currentUser: CurrentUser) {
  const trip = await verifyCustomerOrRepresentativeForTrip(tripId, currentUser);

  const payment = await prisma.payment.findUnique({
    where: { tripId },
  });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  return payment;
}
