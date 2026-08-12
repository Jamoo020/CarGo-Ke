import { Prisma, PaymentStatus, TripStatus, UserRole, WalletTransactionType } from "@prisma/client";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { getDriverForCurrentUser as getDriverForCurrentUserFromAuth, verifyTripParticipation } from "./authorizationService";

export interface CurrentUser {
  userId: string;
  role: UserRole;
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
    tripWallet = await tx.tripWallet.create({
      data: {
        tripId: trip.id,
        customerPaymentAmount: payment.amount,
        refundAmount: 0,
        driverFee: trip.driverFee,
        fuelBudget: trip.fuelBudget ?? 0,
        carGoFee: trip.carGoFee ?? 0,
        driverAmountReleased: trip.driverAmountReleased ?? 0,
        driverAmountRemaining: trip.driverAmountRemaining ?? 0,
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
    include: { transactions: { orderBy: { createdAt: "asc" } } },
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

  const releaseType =
    currentTrip.status === TripStatus.TRIP_ACTIVE
      ? WalletTransactionType.DRIVER_FIRST_RELEASE
      : WalletTransactionType.DRIVER_FINAL_RELEASE;

  if (tripWallet.driverAmountReleased >= tripWallet.driverFee) {
    if (allowPartialRelease) {
      return {
        amount: 0,
        type: releaseType,
        tripId: currentTrip.id,
        driverWalletId: tripWallet.tripId,
        tripWalletId: tripWallet.id,
        driverAmountReleased: tripWallet.driverAmountReleased,
        driverAmountRemaining: tripWallet.driverAmountRemaining,
      };
    }
    throw new AppError("Driver funds already fully released for this trip", 409);
  }

  if (currentTrip.status === TripStatus.TRIP_ACTIVE && tripWallet.driverAmountReleased > 0) {
    if (allowPartialRelease) {
      return {
        amount: 0,
        type: releaseType,
        tripId: currentTrip.id,
        driverWalletId: tripWallet.tripId,
        tripWalletId: tripWallet.id,
        driverAmountReleased: tripWallet.driverAmountReleased,
        driverAmountRemaining: tripWallet.driverAmountRemaining,
      };
    }
    throw new AppError("Driver funds already released for this trip", 409);
  }

  if (currentTrip.status === TripStatus.COMPLETED && tripWallet.driverAmountReleased < tripWallet.driverFee / 2 && !allowPartialRelease) {
    throw new AppError("The first release must be processed before the final release", 400);
  }

  const releaseAmount =
    currentTrip.status === TripStatus.TRIP_ACTIVE
      ? tripWallet.driverFee / 2
      : tripWallet.driverFee - tripWallet.driverAmountReleased;

  if (releaseAmount <= 0) {
    if (allowPartialRelease) {
      return {
        amount: 0,
        type: releaseType,
        tripId: currentTrip.id,
        driverWalletId: tripWallet.tripId,
        tripWalletId: tripWallet.id,
        driverAmountReleased: tripWallet.driverAmountReleased,
        driverAmountRemaining: tripWallet.driverAmountRemaining,
      };
    }
    throw new AppError("No eligible driver funds to release", 400);
  }

  const nextReleased = tripWallet.driverAmountReleased + releaseAmount;
  const nextRemaining = Math.max(0, tripWallet.driverAmountRemaining - releaseAmount);

  tripWallet = await tx.tripWallet.update({
    where: { id: tripWallet.id },
    data: {
      driverAmountReleased: nextReleased,
      driverAmountRemaining: nextRemaining,
    },
  });

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
      availableBalance: { increment: releaseAmount },
      totalEarned: { increment: releaseAmount },
    },
  });

  const transaction = await tx.walletTransaction.create({
    data: {
      tripWalletId: tripWallet.id,
      driverWalletId: driverWallet.id,
      type: releaseType,
      amount: releaseAmount,
      note: currentTrip.status === TripStatus.TRIP_ACTIVE ? "First 50% driver release" : "Final driver release",
    },
  });

  await tx.trip.update({
    where: { id: currentTrip.id },
    data: {
      driverAmountReleased: nextReleased,
      driverAmountRemaining: nextRemaining,
    },
  });

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

  return prisma.$transaction(async (tx) => {
    const currentTrip = await tx.trip.findUnique({ where: { id: tripId } });
    if (!currentTrip) {
      throw new AppError("Trip not found", 404);
    }

    const eligibleStatuses: TripStatus[] = [TripStatus.TRIP_ACTIVE, TripStatus.COMPLETED];
    if (!eligibleStatuses.includes(currentTrip.status)) {
      throw new AppError("Driver funds are not eligible for release in the current trip state", 400);
    }

    let tripWallet = await tx.tripWallet.findUnique({ where: { tripId } });
    if (!tripWallet) {
      throw new AppError("Trip wallet not found for driver release", 404);
    }

    if (tripWallet.driverAmountReleased >= tripWallet.driverFee) {
      throw new AppError("Driver funds already fully released for this trip", 409);
    }

    if (currentTrip.status === TripStatus.TRIP_ACTIVE) {
      if (tripWallet.driverAmountReleased > 0) {
        throw new AppError("Driver funds already released for this trip", 409);
      }
    } else if (currentTrip.status === TripStatus.COMPLETED) {
      if (tripWallet.driverAmountReleased < tripWallet.driverFee / 2) {
        throw new AppError("The first release must be processed before the final release", 400);
      }
    }

    const releaseAmount =
      currentTrip.status === TripStatus.TRIP_ACTIVE
        ? tripWallet.driverFee / 2
        : tripWallet.driverFee - tripWallet.driverAmountReleased;

    if (releaseAmount <= 0) {
      throw new AppError("No eligible driver funds to release", 400);
    }

    const nextReleased = tripWallet.driverAmountReleased + releaseAmount;
    const nextRemaining = Math.max(0, tripWallet.driverAmountRemaining - releaseAmount);

    tripWallet = await tx.tripWallet.update({
      where: { id: tripWallet.id },
      data: {
        driverAmountReleased: nextReleased,
        driverAmountRemaining: nextRemaining,
      },
    });

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
        availableBalance: { increment: releaseAmount },
        totalEarned: { increment: releaseAmount },
      },
    });

    const transaction = await tx.walletTransaction.create({
      data: {
        tripWalletId: tripWallet.id,
        driverWalletId: driverWallet.id,
        type: currentTrip.status === TripStatus.TRIP_ACTIVE ? WalletTransactionType.DRIVER_FIRST_RELEASE : WalletTransactionType.DRIVER_FINAL_RELEASE,
        amount: releaseAmount,
        note: currentTrip.status === TripStatus.TRIP_ACTIVE ? "First 50% driver release" : "Final driver release",
      },
    });

    await tx.trip.update({
      where: { id: tripId },
      data: {
        driverAmountReleased: nextReleased,
        driverAmountRemaining: nextRemaining,
      },
    });

    return {
      amount: transaction.amount,
      type: transaction.type,
      tripId,
      driverWalletId: driverWallet.id,
      tripWalletId: tripWallet.id,
      driverAmountReleased: nextReleased,
      driverAmountRemaining: nextRemaining,
    };
  });
}

export async function releaseDriverFundsForTripStatus(
  tx: Prisma.TransactionClient,
  trip: {
    id: string;
    driverId: string;
    status: TripStatus;
    driverFee: number;
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
