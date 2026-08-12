import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { InspectionType, Prisma, TripStatus, UserRole } from "@prisma/client";
import { CurrentUser, getDriverForCurrentUser, verifyTripParticipation } from "./authorizationService";
import { cancelTrip as cancelTripRequest } from "./cancellationService";
import { releaseDriverFundsForTripStatus } from "./walletService";

type TripTransitionDefinition = {
  from: TripStatus[];
  to: TripStatus;
  allowedRoles: UserRole[];
};

const TRANSITION_ACTIONS: Record<
  "beginPickup" | "completePickupInspection" | "requestTripStart" | "activateTrip" | "beginTransit" | "markDeliveryPending" | "confirmDelivery" | "completeTrip" | "cancelTrip" | "disputeTrip",
  TripTransitionDefinition
> = {
  beginPickup: {
    from: [TripStatus.BOOKED],
    to: TripStatus.PICKUP_PENDING,
    allowedRoles: [UserRole.DRIVER, UserRole.ADMIN],
  },
  completePickupInspection: {
    from: [TripStatus.PICKUP_PENDING],
    to: TripStatus.PICKUP_INSPECTION,
    allowedRoles: [UserRole.DRIVER, UserRole.ADMIN],
  },
  requestTripStart: {
    from: [TripStatus.PICKUP_INSPECTION],
    to: TripStatus.TRIP_START_PENDING,
    allowedRoles: [UserRole.DRIVER, UserRole.ADMIN],
  },
  activateTrip: {
    from: [TripStatus.TRIP_START_PENDING],
    to: TripStatus.TRIP_ACTIVE,
    allowedRoles: [UserRole.CUSTOMER, UserRole.AUTHORIZED_REPRESENTATIVE, UserRole.ADMIN],
  },
  beginTransit: {
    from: [TripStatus.TRIP_ACTIVE],
    to: TripStatus.IN_TRANSIT,
    allowedRoles: [UserRole.DRIVER, UserRole.ADMIN],
  },
  markDeliveryPending: {
    from: [TripStatus.IN_TRANSIT],
    to: TripStatus.DELIVERY_PENDING,
    allowedRoles: [UserRole.DRIVER, UserRole.ADMIN],
  },
  confirmDelivery: {
    from: [TripStatus.DELIVERY_PENDING],
    to: TripStatus.DELIVERED,
    allowedRoles: [UserRole.CUSTOMER, UserRole.AUTHORIZED_REPRESENTATIVE, UserRole.ADMIN],
  },
  completeTrip: {
    from: [TripStatus.DELIVERED],
    to: TripStatus.COMPLETED,
    allowedRoles: [UserRole.CUSTOMER, UserRole.AUTHORIZED_REPRESENTATIVE, UserRole.ADMIN],
  },
  cancelTrip: {
    from: [
      TripStatus.PAYMENT_PENDING,
      TripStatus.BOOKED,
      TripStatus.PICKUP_PENDING,
      TripStatus.PICKUP_INSPECTION,
      TripStatus.TRIP_START_PENDING,
      TripStatus.TRIP_ACTIVE,
      TripStatus.IN_TRANSIT,
      TripStatus.DELIVERY_PENDING,
    ],
    to: TripStatus.CANCELLED,
    allowedRoles: [UserRole.CUSTOMER, UserRole.AUTHORIZED_REPRESENTATIVE, UserRole.DRIVER, UserRole.ADMIN],
  },
  disputeTrip: {
    from: [
      TripStatus.BOOKED,
      TripStatus.PICKUP_PENDING,
      TripStatus.PICKUP_INSPECTION,
      TripStatus.TRIP_START_PENDING,
      TripStatus.TRIP_ACTIVE,
      TripStatus.IN_TRANSIT,
      TripStatus.DELIVERY_PENDING,
      TripStatus.DELIVERED,
      TripStatus.COMPLETED,
    ],
    to: TripStatus.DISPUTED,
    allowedRoles: [UserRole.CUSTOMER, UserRole.AUTHORIZED_REPRESENTATIVE, UserRole.ADMIN],
  },
};

export type TripTransitionAction = keyof typeof TRANSITION_ACTIONS;

export async function listTrips(currentUser: CurrentUser) {
  if (currentUser.role === UserRole.ADMIN) {
    return prisma.trip.findMany({ include: { transportRequest: true } });
  }

  if (currentUser.role === UserRole.CUSTOMER) {
    return prisma.trip.findMany({ where: { customerId: currentUser.userId }, include: { transportRequest: true } });
  }

  if (currentUser.role === UserRole.AUTHORIZED_REPRESENTATIVE) {
    const links = await prisma.customerRepresentative.findMany({
      where: { representativeId: currentUser.userId, status: "ACTIVE", revokedAt: null },
      select: { customerId: true },
    });
    const customerIds = links.map((link) => link.customerId);
    if (customerIds.length === 0) {
      return [];
    }
    return prisma.trip.findMany({ where: { customerId: { in: customerIds } }, include: { transportRequest: true } });
  }

  if (currentUser.role === UserRole.DRIVER) {
    const driver = await getDriverForCurrentUser(currentUser);
    return prisma.trip.findMany({ where: { driverId: driver.id }, include: { transportRequest: true } });
  }

  throw new AppError("Unauthorized", 401);
}

export async function getTripById(tripId: string, currentUser: CurrentUser) {
  return verifyTripParticipation(tripId, currentUser);
}

export async function transitionTripStatus(
  tripId: string,
  action: string,
  currentUser: CurrentUser,
  payload?: any,
  tx?: Prisma.TransactionClient,
) {
  if (!Object.prototype.hasOwnProperty.call(TRANSITION_ACTIONS, action)) {
    throw new AppError("Invalid trip transition action", 400);
  }

  const transition = TRANSITION_ACTIONS[action as TripTransitionAction];
  const trip = await verifyTripParticipation(tripId, currentUser, tx);

  if (!transition.allowedRoles.includes(currentUser.role as UserRole)) {
    throw new AppError("Forbidden", 403);
  }

  if (!transition.from.includes(trip.status as TripStatus)) {
    throw new AppError(
      `Trip must be in one of the following statuses to perform this action: ${transition.from.join(", ")}`,
      400,
    );
  }

  if (action === "cancelTrip") {
    if (tx) {
      await cancelTripRequest(tripId, payload ?? {}, currentUser, tx);
      return tx.trip.findUnique({ where: { id: tripId } });
    }

    return prisma.$transaction(async (transaction) => {
      await cancelTripRequest(tripId, payload ?? {}, currentUser, transaction);
      return transaction.trip.findUnique({ where: { id: tripId } });
    });
  }

  const executeTransition = async (executor: Prisma.TransactionClient) => {
    if (action === "confirmDelivery") {
      const existingDeliveryInspection = await executor.inspection.findUnique({
        where: {
          tripId_type: {
            tripId,
            type: InspectionType.DELIVERY,
          },
        },
      });

      if (!existingDeliveryInspection) {
        throw new AppError("Delivery confirmation requires a delivery inspection record", 400);
      }
    }

    const updated = await executor.trip.update({
      where: { id: tripId },
      data: { status: transition.to },
    });

    await executor.transportRequest.update({
      where: { id: trip.transportRequestId },
      data: { status: transition.to },
    });

    if (transition.to === TripStatus.TRIP_ACTIVE || transition.to === TripStatus.COMPLETED) {
      await releaseDriverFundsForTripStatus(executor, {
        id: updated.id,
        driverId: updated.driverId,
        status: updated.status,
        driverFee: updated.driverFee,
        driverAmountReleased: updated.driverAmountReleased,
        driverAmountRemaining: updated.driverAmountRemaining,
      });
    }

    return updated;
  };

  if (tx) {
    return executeTransition(tx);
  }

  return prisma.$transaction(async (transaction) => executeTransition(transaction));
}

export function getAllowedTripTransitionActions() {
  return Object.keys(TRANSITION_ACTIONS) as TripTransitionAction[];
}
