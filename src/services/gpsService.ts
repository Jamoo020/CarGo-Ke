import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { Prisma, TripStatus, UserRole } from "@prisma/client";
import { CurrentUser, getDriverForCurrentUser, verifyTripParticipation } from "./authorizationService";

interface CreateGpsLocationPayload {
  latitude: number;
  longitude: number;
  timestamp?: string;
  accuracy?: number;
}

export async function createTripGpsLocation(
  tripId: string,
  payload: CreateGpsLocationPayload,
  currentUser: CurrentUser,
) {
  const trip = await verifyTripParticipation(tripId, currentUser);

  if (currentUser.role !== UserRole.DRIVER) {
    throw new AppError("Only drivers may submit GPS location records", 403);
  }

  const driver = await getDriverForCurrentUser(currentUser);
  if (trip.driverId !== driver.id) {
    throw new AppError("Forbidden", 403);
  }

  const allowedStatuses: TripStatus[] = [TripStatus.TRIP_ACTIVE, TripStatus.IN_TRANSIT];
  if (!allowedStatuses.includes(trip.status)) {
    throw new AppError("GPS updates may only be submitted while a trip is active or in transit", 400);
  }

  if (typeof payload.latitude !== "number" || Number.isNaN(payload.latitude) || payload.latitude < -90 || payload.latitude > 90) {
    throw new AppError("latitude is required and must be a number between -90 and 90", 400);
  }

  if (typeof payload.longitude !== "number" || Number.isNaN(payload.longitude) || payload.longitude < -180 || payload.longitude > 180) {
    throw new AppError("longitude is required and must be a number between -180 and 180", 400);
  }

  if (payload.accuracy !== undefined && (typeof payload.accuracy !== "number" || Number.isNaN(payload.accuracy) || payload.accuracy < 0)) {
    throw new AppError("accuracy must be a non-negative number", 400);
  }

  const timestamp = payload.timestamp !== undefined ? new Date(payload.timestamp) : new Date();
  if (payload.timestamp !== undefined && Number.isNaN(timestamp.getTime())) {
    throw new AppError("timestamp must be a valid ISO date string", 400);
  }

  return prisma.gpsLocation.create({
    data: {
      tripId,
      driverId: driver.id,
      latitude: payload.latitude,
      longitude: payload.longitude,
      timestamp,
      accuracy: payload.accuracy,
    },
  });
}

export async function listTripGpsLocations(tripId: string, currentUser: CurrentUser) {
  await verifyTripParticipation(tripId, currentUser);
  return prisma.gpsLocation.findMany({
    where: { tripId },
    orderBy: { timestamp: "asc" },
  });
}

export async function getLastTripGpsLocation(tripId: string, currentUser: CurrentUser) {
  await verifyTripParticipation(tripId, currentUser);
  return prisma.gpsLocation.findFirst({
    where: { tripId },
    orderBy: { timestamp: "desc" },
  });
}
