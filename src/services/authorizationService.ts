import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { Prisma, TripStatus, UserRole } from "@prisma/client";

export interface CurrentUser {
  userId: string;
  role: UserRole;
}

export async function isActiveRepresentativeForCustomer(
  customerId: string,
  representativeId: string,
  tx?: Prisma.TransactionClient,
) {
  const client = tx ?? prisma;
  const link = await client.customerRepresentative.findFirst({
    where: {
      customerId,
      representativeId,
      status: "ACTIVE",
      revokedAt: null,
    },
  });

  return Boolean(link);
}

export async function getDriverForCurrentUser(currentUser: CurrentUser, tx?: Prisma.TransactionClient) {
  const client = tx ?? prisma;
  const driver = await client.driver.findUnique({ where: { userId: currentUser.userId } });
  if (!driver) {
    throw new AppError("Driver profile not found", 404);
  }
  if (!driver.verified) {
    throw new AppError("Driver is not authorized for trip actions", 403);
  }
  return driver;
}

export async function verifyTripParticipation(
  tripId: string,
  currentUser: CurrentUser,
  tx?: Prisma.TransactionClient,
) {
  const client = tx ?? prisma;
  const trip = await client.trip.findUnique({
    where: { id: tripId },
    include: { transportRequest: true },
  });

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  if (currentUser.role === UserRole.ADMIN) {
    return trip;
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
      (await isActiveRepresentativeForCustomer(transportRequest.customerId, currentUser.userId, tx));

    if (!authorized) {
      throw new AppError("Forbidden", 403);
    }
    return trip;
  }

  if (currentUser.role === UserRole.DRIVER) {
    const driver = await getDriverForCurrentUser(currentUser, tx);
    if (trip.driverId !== driver.id) {
      throw new AppError("Forbidden", 403);
    }
    return trip;
  }

  throw new AppError("Unauthorized", 401);
}
