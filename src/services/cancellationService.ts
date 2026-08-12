import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { TripStatus, UserRole } from "@prisma/client";
import { CurrentUser, verifyTripParticipation } from "./authorizationService";

export interface CancellationPayload {
  reason: string;
}

const CANCELLABLE_STATUSES: TripStatus[] = [
  TripStatus.PAYMENT_PENDING,
  TripStatus.BOOKED,
  TripStatus.PICKUP_PENDING,
  TripStatus.PICKUP_INSPECTION,
  TripStatus.TRIP_START_PENDING,
  TripStatus.TRIP_ACTIVE,
  TripStatus.IN_TRANSIT,
  TripStatus.DELIVERY_PENDING,
];

export async function cancelTrip(
  tripId: string,
  payload: CancellationPayload,
  currentUser: CurrentUser,
  tx: Prisma.TransactionClient,
) {
  const trip = await verifyTripParticipation(tripId, currentUser, tx);

  if (trip.status === TripStatus.DELIVERED || trip.status === TripStatus.COMPLETED) {
    throw new AppError("Delivered or completed trips cannot be cancelled", 400);
  }

  if (!CANCELLABLE_STATUSES.includes(trip.status)) {
    throw new AppError("Trip cannot be cancelled in its current status", 400);
  }

  const restrictedCancellationStatuses = [TripStatus.TRIP_ACTIVE, TripStatus.IN_TRANSIT, TripStatus.DELIVERY_PENDING] as const;
  const isRestrictedCancellationStatus = restrictedCancellationStatuses.includes(trip.status as typeof restrictedCancellationStatuses[number]);

  if (
    isRestrictedCancellationStatus &&
    (currentUser.role === UserRole.CUSTOMER || currentUser.role === UserRole.AUTHORIZED_REPRESENTATIVE)
  ) {
    throw new AppError(
      "Cancellation at the current trip stage is restricted. Please use the dispute workflow if appropriate.",
      400,
    );
  }

  const payment = await tx.payment.findUnique({ where: { tripId } });
  const confirmedPayment = payment?.status === "CONFIRMED" ? payment : null;

  const reason = payload.reason?.trim();
  if (!reason) {
    throw new AppError("Cancellation reason is required", 400);
  }
  if (reason.length > 500) {
    throw new AppError("Cancellation reason must not exceed 500 characters", 400);
  }

  const existingCancellation = await tx.cancellation.findUnique({ where: { tripId } });
  if (existingCancellation) {
    throw new AppError("Trip cancellation has already been recorded", 409);
  }

  const cancellation = await tx.cancellation.create({
    data: {
      tripId,
      initiatedById: currentUser.userId,
      initiatorRole: currentUser.role,
      reason,
      statusBefore: trip.status,
      statusAfter: TripStatus.CANCELLED,
      refundAmount: 0,
    },
  });

  await tx.trip.update({
    where: { id: tripId },
    data: {
      status: TripStatus.CANCELLED,
      refundAmount: 0,
    },
  });

  await tx.transportRequest.update({
    where: { id: trip.transportRequestId },
    data: { status: TripStatus.CANCELLED },
  });

  return cancellation;
}
