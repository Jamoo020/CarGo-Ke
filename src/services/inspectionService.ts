import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { InspectionType, TripStatus, UserRole } from "@prisma/client";
import { CurrentUser, getDriverForCurrentUser, verifyTripParticipation } from "./authorizationService";

interface CreateInspectionPayload {
  type: InspectionType;
  photoUrls: string[];
  odometer: number;
  fuelLevel?: number;
  vehicleCondition: string;
  damageNotes?: string;
  observations?: string;
  handoverConfirmed: boolean;
}

function validateInspectionPhotoUrl(tripId: string, photoUrl: string): string {
  const normalized = photoUrl.trim();
  const expectedPrefix = `/api/trips/${tripId}/inspections/photos/`;

  if (!normalized.startsWith("/")) {
    throw new AppError("Inspection photo URL must be a local trip-scoped path", 400);
  }

  if (!normalized.startsWith(expectedPrefix)) {
    throw new AppError("Inspection photo URL does not belong to this trip", 400);
  }

  const fileName = normalized.slice(expectedPrefix.length);
  if (!fileName || fileName.includes("/") || fileName.includes("\\") || fileName.includes("..")) {
    throw new AppError("Inspection photo URL contains an invalid file name", 400);
  }

  return normalized;
}

export async function createTripInspection(tripId: string, payload: CreateInspectionPayload, currentUser: CurrentUser) {
  const trip = await verifyTripParticipation(tripId, currentUser);

  if (currentUser.role !== UserRole.DRIVER) {
    throw new AppError("Only drivers may submit inspection records", 403);
  }

  const driver = await getDriverForCurrentUser(currentUser);
  if (trip.driverId !== driver.id) {
    throw new AppError("Forbidden", 403);
  }

  if (trip.status === TripStatus.CANCELLED || trip.status === TripStatus.DISPUTED || trip.status === TripStatus.COMPLETED) {
    throw new AppError("Cannot submit inspection for a trip in its current status", 400);
  }

  const existingInspection = await prisma.inspection.findUnique({
    where: {
      tripId_type: {
        tripId,
        type: payload.type,
      },
    },
  });

  if (existingInspection) {
    throw new AppError("Inspection has already been submitted for this trip", 409);
  }

  if (payload.type === InspectionType.PICKUP && trip.status !== TripStatus.PICKUP_PENDING) {
    throw new AppError("Pickup inspections may only be submitted when the trip is in PICKUP_PENDING status", 400);
  }

  if (payload.type === InspectionType.DELIVERY && trip.status !== TripStatus.DELIVERY_PENDING) {
    throw new AppError("Delivery inspections may only be submitted when the trip is in DELIVERY_PENDING status", 400);
  }

  const cleanedPhotoUrls = payload.photoUrls
    .filter((url) => typeof url === "string" && url.trim().length > 0)
    .map((url) => validateInspectionPhotoUrl(tripId, url));

  if (cleanedPhotoUrls.length === 0) {
    throw new AppError("At least one valid photo URL is required for an inspection", 400);
  }

  return prisma.$transaction(async (tx) => {
    const inspection = await tx.inspection.create({
      data: {
        tripId,
        driverId: driver.id,
        type: payload.type,
        photoUrls: cleanedPhotoUrls,
        odometer: payload.odometer,
        fuelLevel: payload.fuelLevel,
        vehicleCondition: payload.vehicleCondition,
        damageNotes: payload.damageNotes,
        observations: payload.observations,
        handoverConfirmed: payload.handoverConfirmed,
      },
    });

    if (payload.type === InspectionType.PICKUP) {
      const { transitionTripStatus } = await import("./tripService");
      await transitionTripStatus(tripId, "completePickupInspection", currentUser, undefined, tx);
    }

    return inspection;
  });
}

export async function listTripInspections(tripId: string, currentUser: CurrentUser) {
  await verifyTripParticipation(tripId, currentUser);
  return prisma.inspection.findMany({
    where: { tripId },
    orderBy: { createdAt: "asc" },
  });
}
