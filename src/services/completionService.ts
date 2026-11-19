import { Prisma, DisputeStatus, PaymentStatus, RefundStatus, TripStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { CurrentUser, verifyTripParticipation } from "./authorizationService";
import { releaseDriverFundsForTripStatus } from "./walletService";

const COMPLETION_TRIP_INCLUDE: Prisma.TripInclude = {
  transportRequest: { include: { vehicleDetail: true } },
  customer: { select: { fullName: true } },
  driver: { include: { user: { select: { fullName: true } } } },
};

function toMinorUnits(value: number) {
  return Math.round((value + Number.EPSILON) * 100);
}

function getTripForCompletionResponse(tx: Prisma.TransactionClient, tripId: string) {
  return tx.trip.findUnique({
    where: { id: tripId },
    include: COMPLETION_TRIP_INCLUDE,
  });
}

function getConfirmationField(role: UserRole) {
  if (role === UserRole.DRIVER) {
    return {
      confirmedAt: "driverCompletionConfirmedAt" as const,
      confirmedById: "driverCompletionConfirmedById" as const,
    };
  }
  return {
    confirmedAt: "customerCompletionConfirmedAt" as const,
    confirmedById: "customerCompletionConfirmedById" as const,
  };
}

export async function confirmTripCompletionTx(
  tx: Prisma.TransactionClient,
  tripId: string,
  currentUser: CurrentUser,
) {
  if (
    currentUser.role !== UserRole.DRIVER &&
    currentUser.role !== UserRole.CUSTOMER &&
    currentUser.role !== UserRole.AUTHORIZED_REPRESENTATIVE
  ) {
    throw new AppError("Only the assigned driver or authorized customer may confirm completion", 403);
  }

  const trip = await verifyTripParticipation(tripId, currentUser, tx);
  const confirmationField = getConfirmationField(currentUser.role);
  const alreadyConfirmedByCurrentUser = trip[confirmationField.confirmedById] === currentUser.userId;

  if (trip.status === TripStatus.COMPLETED) {
    if (alreadyConfirmedByCurrentUser) {
      const completedTrip = await getTripForCompletionResponse(tx, tripId);
      if (!completedTrip) throw new AppError("Trip not found", 404);
      return completedTrip;
    }
    throw new AppError("Trip completion has already been confirmed", 409);
  }

  if (trip.status !== TripStatus.DELIVERED) {
    throw new AppError("Completion can only be confirmed after delivery is confirmed", 400);
  }

  if (currentUser.role === UserRole.DRIVER && trip.customerCompletionConfirmedById === currentUser.userId) {
    throw new AppError("The customer confirmation must be made by a different authorized user", 403);
  }
  if (currentUser.role !== UserRole.DRIVER && trip.driverCompletionConfirmedById === currentUser.userId) {
    throw new AppError("The driver confirmation must be made by the assigned driver", 403);
  }

  const deliveryInspection = await tx.inspection.findUnique({
    where: { tripId_type: { tripId, type: "DELIVERY" } },
  });
  if (!deliveryInspection) {
    throw new AppError("Completion requires a delivery inspection record", 400);
  }

  const dispute = await tx.dispute.findUnique({ where: { tripId } });
  if (
    dispute &&
    (dispute.status === DisputeStatus.OPEN || dispute.status === DisputeStatus.UNDER_REVIEW)
  ) {
    throw new AppError("Completion is held while this trip has an active dispute", 409);
  }

  const pendingRefund = await tx.refund.findFirst({
    where: { tripId, status: { in: [RefundStatus.PENDING, RefundStatus.COMPLETED] } },
  });
  if (pendingRefund) {
    throw new AppError("Completion is held while a refund is pending or completed", 409);
  }

  const payment = await tx.payment.findUnique({ where: { tripId } });
  if (
    !payment ||
    payment.status !== PaymentStatus.CONFIRMED ||
    toMinorUnits(payment.amount) !== toMinorUnits(trip.bookingAmount)
  ) {
    throw new AppError("Completion requires a fully confirmed customer payment", 400);
  }

  const wallet = await tx.tripWallet.findUnique({ where: { tripId } });
  if (!wallet || wallet.releaseAccountingVersion !== 2) {
    throw new AppError("This trip has legacy wallet accounting and requires reconciliation before completion", 409);
  }
  if (wallet.fuelAccountingStatus !== "RESTRICTED") {
    throw new AppError("Fuel allocation accounting requires reconciliation before completion", 409);
  }

  if (!alreadyConfirmedByCurrentUser) {
    const update = await tx.trip.updateMany({
      where: {
        id: tripId,
        status: TripStatus.DELIVERED,
        [confirmationField.confirmedById]: null,
      },
      data: {
        [confirmationField.confirmedAt]: new Date(),
        [confirmationField.confirmedById]: currentUser.userId,
      },
    });
    if (update.count !== 1) {
      const latest = await tx.trip.findUnique({ where: { id: tripId } });
      if (latest?.[confirmationField.confirmedById] !== currentUser.userId) {
        throw new AppError("A completion confirmation was recorded concurrently; refresh and retry", 409);
      }
    }
  }

  const confirmedTrip = await getTripForCompletionResponse(tx, tripId);
  if (!confirmedTrip) {
    throw new AppError("Trip not found", 404);
  }

  if (!confirmedTrip.driverCompletionConfirmedById || !confirmedTrip.customerCompletionConfirmedById) {
    return confirmedTrip;
  }
  if (confirmedTrip.driverCompletionConfirmedById === confirmedTrip.customerCompletionConfirmedById) {
    throw new AppError("Driver and customer confirmations must come from different users", 409);
  }

  const completionUpdate = await tx.trip.updateMany({
    where: {
      id: tripId,
      status: TripStatus.DELIVERED,
      driverCompletionConfirmedById: { not: null },
      customerCompletionConfirmedById: { not: null },
    },
    data: { status: TripStatus.COMPLETED },
  });
  if (completionUpdate.count !== 1) {
    const latest = await tx.trip.findUnique({ where: { id: tripId } });
    if (latest?.status !== TripStatus.COMPLETED) {
      throw new AppError("Trip changed while applying completion confirmations; refresh and retry", 409);
    }
  }

  await tx.transportRequest.update({
    where: { id: confirmedTrip.transportRequestId },
    data: { status: TripStatus.COMPLETED },
  });

  const completedTrip = await getTripForCompletionResponse(tx, tripId);
  if (!completedTrip) {
    throw new AppError("Trip not found", 404);
  }

  await releaseDriverFundsForTripStatus(tx, completedTrip);
  return completedTrip;
}

export async function confirmTripCompletion(tripId: string, currentUser: CurrentUser) {
  try {
    return await prisma.$transaction(
      (tx) => confirmTripCompletionTx(tx, tripId, currentUser),
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error.code === "P2002" || error.code === "P2034")
    ) {
      throw new AppError("Completion confirmation changed concurrently; refresh and retry", 409);
    }
    throw error;
  }
}
