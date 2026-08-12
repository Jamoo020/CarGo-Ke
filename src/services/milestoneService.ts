import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { MilestoneType, TripStatus, UserRole } from "@prisma/client";
import { CurrentUser, getDriverForCurrentUser, verifyTripParticipation } from "./authorizationService";

interface CreateTripMilestonePayload {
  type: MilestoneType;
  eventTime?: string;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  notes?: string;
}

export async function createTripMilestone(
  tripId: string,
  payload: CreateTripMilestonePayload,
  currentUser: CurrentUser,
) {
  const trip = await verifyTripParticipation(tripId, currentUser);

  if (currentUser.role !== UserRole.DRIVER) {
    throw new AppError("Only drivers may record trip milestones", 403);
  }

  const driver = await getDriverForCurrentUser(currentUser);
  if (trip.driverId !== driver.id) {
    throw new AppError("Forbidden", 403);
  }

  const disallowedStatuses: TripStatus[] = [TripStatus.CANCELLED, TripStatus.DISPUTED, TripStatus.COMPLETED];
  if (disallowedStatuses.includes(trip.status)) {
    throw new AppError("Cannot record milestones for a trip in its current status", 400);
  }

  const allowedMilestoneTypes = new Set(Object.values(MilestoneType));
  if (!allowedMilestoneTypes.has(payload.type)) {
    throw new AppError("type is required and must be a supported milestone type", 400);
  }

  if (payload.eventTime !== undefined) {
    const parsedEventTime = new Date(payload.eventTime);
    if (Number.isNaN(parsedEventTime.getTime())) {
      throw new AppError("eventTime must be a valid ISO date string", 400);
    }
  }

  if (payload.latitude !== undefined && (typeof payload.latitude !== "number" || Number.isNaN(payload.latitude) || payload.latitude < -90 || payload.latitude > 90)) {
    throw new AppError("latitude must be a number between -90 and 90", 400);
  }

  if (payload.longitude !== undefined && (typeof payload.longitude !== "number" || Number.isNaN(payload.longitude) || payload.longitude < -180 || payload.longitude > 180)) {
    throw new AppError("longitude must be a number between -180 and 180", 400);
  }

  if (payload.accuracy !== undefined && (typeof payload.accuracy !== "number" || Number.isNaN(payload.accuracy) || payload.accuracy < 0)) {
    throw new AppError("accuracy must be a non-negative number", 400);
  }

  if (payload.notes !== undefined && typeof payload.notes !== "string") {
    throw new AppError("notes must be a string", 400);
  }

  const eventTime = payload.eventTime ? new Date(payload.eventTime) : new Date();

  return prisma.tripMilestone.create({
    data: {
      tripId,
      createdById: currentUser.userId,
      type: payload.type,
      eventTime,
      latitude: payload.latitude,
      longitude: payload.longitude,
      accuracy: payload.accuracy,
      notes: payload.notes,
    },
  });
}

export async function listTripMilestones(tripId: string, currentUser: CurrentUser) {
  await verifyTripParticipation(tripId, currentUser);
  return prisma.tripMilestone.findMany({
    where: { tripId },
    orderBy: { eventTime: "asc" },
  });
}
