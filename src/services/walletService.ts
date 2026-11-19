import { Prisma, PaymentStatus, TripStatus, UserRole, WalletTransactionType } from "@prisma/client";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { getDriverForCurrentUser as getDriverForCurrentUserFromAuth, verifyTripParticipation } from "./authorizationService";

export interface CurrentUser {
  userId: string;
  role: UserRole;
}

function isConcurrentDatabaseWrite(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error.code === "P2002" || error.code === "P2034")
  );
}

async function isActiveRepresentativeForCustomer(customerId: string, representativeId: string) {
  const link = await prisma.customerRepresentative.findFirst({
    where: { customerId, representativeId, status: "ACTIVE", revokedAt: null },
  });
  return Boolean(link);
}

async function getDriverForCurrentUser(currentUser: CurrentUser) {
  const driver = await prisma.driver.findUnique({ where: { userId: currentUser.userId } });
  if (!driver) {
    throw new AppError("Driver profile not found", 404);
  }
  if (!driver.verified) {
    throw new AppError("Driver is not authorized for wallet access", 403);
  }
  return driver;
}

async function verifyCustomerOrRepresentativeForTrip(tripId: string, currentUser: CurrentUser) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId }, include: { transportRequest: true } });
  if (!trip) throw new AppError("Trip not found", 404);

  if (currentUser.role === UserRole.CUSTOMER) {
    if (trip.customerId !== currentUser.userId) throw new AppError("Forbidden", 403);
    return trip;
  }

  if (currentUser.role === UserRole.AUTHORIZED_REPRESENTATIVE) {
    const transportRequest = trip.transportRequest;
    const authorized =
      transportRequest.authorizedRepresentativeId === currentUser.userId ||
      (await isActiveRepresentativeForCustomer(transportRequest.customerId, currentUser.userId));
    if (!authorized) throw new AppError("Forbidden", 403);
    return trip;
  }

  if (currentUser.role === UserRole.DRIVER) {
    const driver = await getDriverForCurrentUserFromAuth(currentUser);
    if (trip.driverId !== driver.id) throw new AppError("Forbidden", 403);
    return trip;
  }

  if (currentUser.role === UserRole.ADMIN) return trip;

  throw new AppError("Forbidden", 403);
}

// Internal tx-based initializer used within an existing transaction
export async function initializeTripWalletTx(tx: Prisma.TransactionClient, paymentId: string) {
  const payment = await tx.payment.findUnique({ where: { id: paymentId }, include: { trip: true } });
  if (!payment) throw new AppError("Payment not found", 404);

  if (payment.status !== PaymentStatus.CONFIRMED) {
    throw new AppError("Payment must be confirmed to initialize wallet", 400);
  }

  const trip = payment.trip;
  if (!trip) throw new AppError("Trip not found for payment", 404);

  if (trip.status !== TripStatus.BOOKED) {
    throw new AppError("Trip must be BOOKED to initialize wallet", 400);
  }

  // Check existing TripWallet
  let tripWallet = await tx.tripWallet.findUnique({ where: { tripId: trip.id } });

  // If wallet doesn't exist, create it
  if (!tripWallet) {
    if ((trip.driverAmountReleased ?? 0) > 0) {
      throw new AppError("Trip has historical driver credits without a wallet snapshot; reconcile before initializing", 409);
    }

    const tripFinancials = {
      driverFee: trip.driverFee ?? 0,
      fuelBudget: trip.fuelBudget ?? 0,
      carGoFee: trip.carGoFee ?? 0,
      totalDriverEntitlement: trip.driverFee ?? 0,
    };

    tripWallet = await tx.tripWallet.create({
      data: {
        tripId: trip.id,
        customerPaymentAmount: payment.amount,
        refundAmount: 0,
        driverFee: tripFinancials.driverFee,
        fuelBudget: tripFinancials.fuelBudget,
        carGoFee: tripFinancials.carGoFee,
        driverAmountReleased: 0,
        driverAmountRemaining: tripFinancials.totalDriverEntitlement,
        driverCompensationReleased: 0,
        driverCompensationRemaining: tripFinancials.totalDriverEntitlement,
        releaseAccountingVersion: 2,
        fuelAllocated: tripFinancials.fuelBudget,
        fuelSpent: 0,
        fuelPending: 0,
        fuelRemaining: tripFinancials.fuelBudget,
        fuelAccountingStatus: "RESTRICTED",
      },
    });
  }

  // Ensure a PAYMENT_RECEIVED transaction exists for this payment
  const existingTx = await tx.walletTransaction.findFirst({ where: { paymentId: payment.id } });
  if (!existingTx) {
    await tx.walletTransaction.create({
      data: {
        tripWalletId: tripWallet.id,
        paymentId: payment.id,
        type: WalletTransactionType.PAYMENT_RECEIVED,
        amount: payment.amount,
        idempotencyKey: `payment-received:${payment.id}`,
      },
    });
  }

  return tripWallet;
}

// Public initializer (safe to call independently) — uses its own transaction
export async function initializeTripWallet(paymentId: string) {
  return prisma.$transaction(async (tx) => initializeTripWalletTx(tx, paymentId));
}

export async function getTripWallet(tripId: string, currentUser: CurrentUser) {
  const trip = await verifyCustomerOrRepresentativeForTrip(tripId, currentUser);

  const wallet = await prisma.tripWallet.findUnique({
    where: { tripId },
    include: {
      transactions: { orderBy: { createdAt: "asc" } },
      trip: {
        include: {
          payment: { select: { status: true, amount: true } },
          dispute: { select: { status: true } },
          refunds: { where: { status: "PENDING" }, select: { id: true } },
        },
      },
    },
  });

  if (!wallet) {
    throw new AppError("Trip wallet not found", 404);
  }

  return wallet;
}

async function releaseDriverFundsTx(
  tx: Prisma.TransactionClient,
  currentTrip: {
    id: string;
    driverId: string;
    status: TripStatus;
    driverFee: number;
    bookingAmount: number;
    driverAmountReleased: number;
    driverAmountRemaining: number;
  },
  allowPartialRelease = true,
) {
  const eligibleStatuses: TripStatus[] = [TripStatus.TRIP_ACTIVE, TripStatus.COMPLETED];
  if (!eligibleStatuses.includes(currentTrip.status)) {
    throw new AppError("Driver funds are not eligible for release in the current trip state", 400);
  }

  let tripWallet = await tx.tripWallet.findUnique({ where: { tripId: currentTrip.id } });
  if (!tripWallet) {
    throw new AppError("Trip wallet not found for driver release", 404);
  }

  if (tripWallet.releaseAccountingVersion !== 2) {
    throw new AppError(
      "This trip has legacy wallet releases that require reconciliation before further automatic releases",
      409,
    );
  }

  const toMinorUnits = (value: number) => Math.round((value + Number.EPSILON) * 100);
  const fromMinorUnits = (value: number) => value / 100;
  const driverFeeMinorUnits = toMinorUnits(tripWallet.driverFee);
  const firstReleaseMinorUnits = Math.round(driverFeeMinorUnits * 0.3);
  const firstReleaseAlreadyApplied = toMinorUnits(tripWallet.driverCompensationReleased);
  const releaseType =
    currentTrip.status === TripStatus.TRIP_ACTIVE
      ? WalletTransactionType.DRIVER_FIRST_RELEASE
      : WalletTransactionType.DRIVER_FINAL_RELEASE;

  if (firstReleaseAlreadyApplied >= driverFeeMinorUnits) {
    if (allowPartialRelease) {
      return {
        amount: 0,
        type: releaseType,
        tripId: currentTrip.id,
        driverWalletId: tripWallet.tripId,
        tripWalletId: tripWallet.id,
        driverAmountReleased: tripWallet.driverCompensationReleased,
        driverAmountRemaining: tripWallet.driverCompensationRemaining,
      };
    }
    throw new AppError("Driver funds already fully released for this trip", 409);
  }

  if (currentTrip.status === TripStatus.TRIP_ACTIVE && firstReleaseAlreadyApplied > 0) {
    if (allowPartialRelease) {
      return {
        amount: 0,
        type: releaseType,
        tripId: currentTrip.id,
        driverWalletId: tripWallet.tripId,
        tripWalletId: tripWallet.id,
        driverAmountReleased: tripWallet.driverCompensationReleased,
        driverAmountRemaining: tripWallet.driverCompensationRemaining,
      };
    }
    throw new AppError("Driver funds already released for this trip", 409);
  }

  if (currentTrip.status === TripStatus.COMPLETED && firstReleaseAlreadyApplied !== firstReleaseMinorUnits) {
    throw new AppError("The first release must be processed before the final release", 400);
  }

  const releaseMinorUnits = currentTrip.status === TripStatus.TRIP_ACTIVE
    ? firstReleaseMinorUnits
    : driverFeeMinorUnits - firstReleaseMinorUnits;
  const cappedRelease = fromMinorUnits(releaseMinorUnits);

  if (cappedRelease <= 0) {
    throw new AppError("No eligible driver funds to release", 400);
  }

  if (toMinorUnits(tripWallet.driverCompensationRemaining) !== driverFeeMinorUnits - firstReleaseAlreadyApplied) {
    throw new AppError("Trip wallet compensation balance is inconsistent; reconcile before releasing funds", 409);
  }

  const payment = await tx.payment.findUnique({ where: { tripId: currentTrip.id } });
  const reconciledBookingAmount = toMinorUnits(tripWallet.driverFee)
    + toMinorUnits(tripWallet.fuelBudget)
    + toMinorUnits(tripWallet.carGoFee);
  if (
    !payment ||
    payment.status !== PaymentStatus.CONFIRMED ||
    toMinorUnits(tripWallet.driverFee) !== toMinorUnits(currentTrip.driverFee) ||
    toMinorUnits(payment.amount) !== toMinorUnits(tripWallet.customerPaymentAmount) ||
    toMinorUnits(payment.amount) !== toMinorUnits(currentTrip.bookingAmount) ||
    toMinorUnits(payment.amount) !== reconciledBookingAmount
  ) {
    throw new AppError("Customer payment is not fully confirmed for this trip", 400);
  }

  const driver = await tx.driver.findUnique({ where: { id: currentTrip.driverId } });
  if (!driver?.verified || driver.verificationStatus !== "APPROVED") {
    throw new AppError("Assigned driver is not approved for fund release", 403);
  }

  const dispute = await tx.dispute.findUnique({ where: { tripId: currentTrip.id } });
  if (dispute?.status === "OPEN" || dispute?.status === "UNDER_REVIEW" || currentTrip.status === TripStatus.DISPUTED) {
    throw new AppError("Driver funds are held while this trip has an active dispute", 409);
  }

  const pendingRefund = await tx.refund.findFirst({
    where: { tripId: currentTrip.id, status: { in: ["PENDING", "COMPLETED"] } },
  });
  if (pendingRefund) {
    throw new AppError("Driver funds are held while a refund is pending or completed", 409);
  }

  if (currentTrip.status === TripStatus.COMPLETED) {
    const confirmations = await tx.trip.findUnique({
      where: { id: currentTrip.id },
      select: {
        status: true,
        driverCompletionConfirmedById: true,
        customerCompletionConfirmedById: true,
      },
    });
    if (
      !confirmations ||
      confirmations.status !== TripStatus.COMPLETED ||
      !confirmations.driverCompletionConfirmedById ||
      !confirmations.customerCompletionConfirmedById ||
      confirmations.driverCompletionConfirmedById === confirmations.customerCompletionConfirmedById
    ) {
      throw new AppError("Both independent completion confirmations are required for final release", 400);
    }
  }

  const previousReleased = tripWallet.driverCompensationReleased;
  const nextReleased = fromMinorUnits(firstReleaseAlreadyApplied + releaseMinorUnits);
  const nextRemaining = fromMinorUnits(driverFeeMinorUnits - firstReleaseAlreadyApplied - releaseMinorUnits);

  const walletUpdate = await tx.tripWallet.updateMany({
    where: { id: tripWallet.id, driverCompensationReleased: previousReleased },
    data: {
      driverCompensationReleased: nextReleased,
      driverCompensationRemaining: nextRemaining,
      driverAmountReleased: nextReleased,
      driverAmountRemaining: nextRemaining,
    },
  });
  if (walletUpdate.count !== 1) {
    throw new AppError("Driver funds were concurrently updated; retry the request", 409);
  }

  const updatedTripWallet = await tx.tripWallet.findUnique({ where: { id: tripWallet.id } });
  if (!updatedTripWallet) {
    throw new AppError("Trip wallet not found for driver release", 404);
  }
  tripWallet = updatedTripWallet;

  let driverWallet = await tx.driverWallet.findUnique({ where: { driverId: currentTrip.driverId } });
  if (!driverWallet) {
    driverWallet = await tx.driverWallet.create({
      data: {
        driverId: currentTrip.driverId,
        availableBalance: 0,
        pendingBalance: 0,
        totalEarned: 0,
      },
    });
  }

  driverWallet = await tx.driverWallet.update({
    where: { id: driverWallet.id },
    data: {
      availableBalance: { increment: cappedRelease },
      totalEarned: { increment: cappedRelease },
    },
  });

  const transaction = await tx.walletTransaction.create({
    data: {
      tripWalletId: tripWallet.id,
      driverWalletId: driverWallet.id,
      type: releaseType,
      amount: cappedRelease,
      idempotencyKey: `driver-release:${tripWallet.tripId}:${releaseType}`,
      note: currentTrip.status === TripStatus.TRIP_ACTIVE
        ? "First driver-fee installment: 30% of driver fee"
        : "Final driver-fee installment: remaining 70% of driver fee",
    },
  });

  const tripUpdate = await tx.trip.updateMany({
    where: {
      id: currentTrip.id,
      status: currentTrip.status,
      driverAmountReleased: currentTrip.driverAmountReleased,
    },
    data: {
      driverAmountReleased: nextReleased,
      driverAmountRemaining: nextRemaining,
    },
  });
  if (tripUpdate.count !== 1) {
    throw new AppError("Trip changed while releasing driver funds; retry the request", 409);
  }

  return {
    amount: transaction.amount,
    type: transaction.type,
    tripId: currentTrip.id,
    driverWalletId: driverWallet.id,
    tripWalletId: tripWallet.id,
    driverAmountReleased: nextReleased,
    driverAmountRemaining: nextRemaining,
  };
}

export async function releaseDriverFunds(tripId: string, currentUser: CurrentUser) {
  if (currentUser.role !== UserRole.DRIVER) {
    throw new AppError("Forbidden", 403);
  }

  const driver = await getDriverForCurrentUserFromAuth(currentUser);
  const trip = await verifyTripParticipation(tripId, currentUser);

  if (trip.driverId !== driver.id) {
    throw new AppError("Forbidden", 403);
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const currentTrip = await tx.trip.findUnique({ where: { id: tripId } });
      if (!currentTrip) {
        throw new AppError("Trip not found", 404);
      }

      return releaseDriverFundsTx(tx, currentTrip, false);
    });
  } catch (error) {
    if (isConcurrentDatabaseWrite(error)) {
      throw new AppError("Driver funds were concurrently updated; retry the request", 409);
    }
    throw error;
  }
}

export async function releaseDriverFundsForTripStatus(
  tx: Prisma.TransactionClient,
  trip: {
    id: string;
    driverId: string;
    status: TripStatus;
    driverFee: number;
    bookingAmount: number;
    driverAmountReleased: number;
    driverAmountRemaining: number;
  },
) {
  return releaseDriverFundsTx(tx, trip, true);
}

export default {
  initializeTripWallet,
  initializeTripWalletTx,
  getTripWallet,
  releaseDriverFunds,
  releaseDriverFundsForTripStatus,
};
