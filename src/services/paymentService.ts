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

async function findPaymentForProviderPayload(payload: ProviderPaymentCallbackPayload) {
  if (payload.paymentId) {
    return prisma.payment.findUnique({ where: { id: payload.paymentId }, include: { trip: true } });
  }

  if (payload.providerReference) {
    return prisma.payment.findUnique({ where: { providerReference: payload.providerReference }, include: { trip: true } });
  }

  return null;
}

async function finalizePaymentStatus(
  tx: any,
  payment: any,
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
    return tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.FAILED,
        providerCallbackReference: callbackReference ?? payment.providerCallbackReference,
      },
    });
  }

  if (status === PaymentStatus.CONFIRMED) {
    if (payment.trip.status !== TripStatus.PAYMENT_PENDING) {
      throw new AppError("Trip is not awaiting payment confirmation", 400);
    }

    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.CONFIRMED,
        providerCallbackReference: callbackReference ?? payment.providerCallbackReference,
      },
    });

    await tx.trip.update({
      where: { id: payment.tripId },
      data: { status: TripStatus.BOOKED },
    });

    await tx.transportRequest.update({
      where: { id: payment.trip.transportRequestId },
      data: { status: TripStatus.BOOKED },
    });

    await initializeTripWalletTx(tx, updatedPayment.id);
    return updatedPayment;
  }

  throw new AppError("Unsupported payment status", 400);
}

export async function processProviderPaymentCallback(
  payload: ProviderPaymentCallbackPayload,
  rawBody?: string,
) {
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

  const payment = await findPaymentForProviderPayload(payload);
  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (payload.tripId && payload.tripId !== payment.tripId) {
    throw new AppError("Payment trip mismatch", 400);
  }

  if (payload.providerReference && payment.providerReference && payload.providerReference !== payment.providerReference) {
    throw new AppError("Provider reference mismatch", 400);
  }

  if (payload.amount !== payment.amount) {
    throw new AppError("Payment amount mismatch", 400);
  }

  if (payment.status === status) {
    return payment;
  }

  return prisma.$transaction(async (tx) => {
    return finalizePaymentStatus(tx, payment, status, payload.providerCallbackReference, true);
  });
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
    throw new AppError("Payment already exists for this trip", 409);
  }

  const customerId = trip.customerId;
  if (!customerId) {
    throw new AppError("Trip does not have an associated customer", 500);
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
  if (config.environment === "production" && currentUser.role !== UserRole.ADMIN) {
    throw new AppError("Manual payment confirmation is disabled in production", 403);
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
