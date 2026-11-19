import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { TripStatus, UserRole } from "@prisma/client";
import { getDriverProfileForCurrentUser } from "./authorizationService";

const ACTIVE_REPRESENTATIVE_STATUS = "ACTIVE";
const REQUEST_CANCELLABLE_STATUSES: TripStatus[] = [TripStatus.REQUESTED, TripStatus.QUOTING];

export interface TransportRequestPayload {
  customerId?: string;
  origin: string;
  destination: string;
  pickupAddress: string;
  pickupLatitude: number;
  pickupLongitude: number;
  destinationAddress: string;
  destinationLatitude: number;
  destinationLongitude: number;
  distanceMeters?: number;
  estimatedDurationSeconds?: number;
  routePolyline?: string;
  vehicleDetailId?: string;
  make?: string;
  model?: string;
  year?: number | string;
  registrationNumber?: string;
  color?: string;
  engineCC?: number | string;
  vehicleType?: string;
  capacity?: number | string;
  travelDateTime?: string | Date;
  notes?: string;
}

export interface CurrentUser {
  userId: string;
  role: UserRole;
}

async function isActiveRepresentativeForCustomer(customerId: string, representativeId: string) {
  const link = await prisma.customerRepresentative.findFirst({
    where: {
      customerId,
      representativeId,
      status: ACTIVE_REPRESENTATIVE_STATUS,
      revokedAt: null,
    },
  });

  return Boolean(link);
}

export async function createTransportRequest(payload: TransportRequestPayload, currentUser: CurrentUser) {
  const {
    customerId: requestedCustomerId, origin, destination, pickupAddress, pickupLatitude, pickupLongitude,
    destinationAddress, destinationLatitude, destinationLongitude, distanceMeters, estimatedDurationSeconds,
    routePolyline, vehicleDetailId, make, model, year, registrationNumber, color, travelDateTime, notes,
  } = payload;
  const { engineCC, vehicleType, capacity } = payload as any;

  const role = currentUser.role;
  let customerId: string;
  let authorizedRepresentativeId: string | null = null;

  if (role === UserRole.CUSTOMER) {
    customerId = currentUser.userId;
    if (requestedCustomerId && requestedCustomerId !== customerId) {
      throw new AppError("Customers may only create requests for themselves", 403);
    }
  } else if (role === UserRole.AUTHORIZED_REPRESENTATIVE) {
    if (!requestedCustomerId) {
      throw new AppError("customerId is required for authorized representatives", 400);
    }
    if (!(await isActiveRepresentativeForCustomer(requestedCustomerId, currentUser.userId))) {
      throw new AppError("Representative is not authorized for this customer", 403);
    }
    customerId = requestedCustomerId;
    authorizedRepresentativeId = currentUser.userId;
  } else {
    throw new AppError("Only customers and authorized representatives may create transport requests", 403);
  }

  const customer = await prisma.user.findUnique({ where: { id: customerId } });
  if (!customer) {
    throw new AppError("Customer not found", 404);
  }

  let resolvedVehicleDetailId = vehicleDetailId?.trim();
  if (!resolvedVehicleDetailId) {
    if (!make || !model || !registrationNumber || year === undefined || year === null) {
      throw new AppError("Vehicle details are required: make, model, year, and registrationNumber", 400);
    }

    const normalizedYear = Number(year);
    if (!Number.isFinite(normalizedYear)) {
      throw new AppError("Vehicle year must be a valid number", 400);
    }

    const normalizedRegistrationNumber = registrationNumber.trim();
    const normalizedMake = make.trim();
    const normalizedModel = model.trim();
    const normalizedColor = color?.trim();

    const existingVehicleDetail = await prisma.vehicleDetail.findFirst({
      where: {
        registrationNumber: normalizedRegistrationNumber,
        year: normalizedYear,
      },
    });

    if (existingVehicleDetail) {
      resolvedVehicleDetailId = existingVehicleDetail.id;
    } else {
      const createdVehicleDetail = await prisma.vehicleDetail.create({
        data: {
          make: normalizedMake,
          model: normalizedModel,
          year: normalizedYear,
          registrationNumber: normalizedRegistrationNumber,
          color: normalizedColor || null,
          engineCC: engineCC ? Number(engineCC) : undefined,
          vehicleType: vehicleType ? String(vehicleType).trim() : undefined,
          capacity: capacity ? Number(capacity) : undefined,
        },
      });
      resolvedVehicleDetailId = createdVehicleDetail.id;
    }
  } else {
    const existingVehicleDetail = await prisma.vehicleDetail.findUnique({ where: { id: resolvedVehicleDetailId } });
    if (!existingVehicleDetail) {
      throw new AppError("Vehicle detail not found", 404);
    }
  }

  return prisma.transportRequest.create({
    data: {
      customerId,
      authorizedRepresentativeId,
      origin,
      destination,
      pickupAddress,
      pickupLatitude,
      pickupLongitude,
      destinationAddress,
      destinationLatitude,
      destinationLongitude,
      distanceMeters,
      estimatedDurationSeconds,
      routePolyline,
      travelDateTime: travelDateTime ? new Date(travelDateTime) : undefined,
      notes: notes ? String(notes).trim() : undefined,
      vehicleDetailId: resolvedVehicleDetailId as string,
      status: TripStatus.REQUESTED,
    },
  });
}

export async function listTransportRequests(currentUser: CurrentUser) {
  if (currentUser.role === UserRole.CUSTOMER) {
    return prisma.transportRequest.findMany({ where: { customerId: currentUser.userId } });
  }

  if (currentUser.role === UserRole.AUTHORIZED_REPRESENTATIVE) {
    const links = await prisma.customerRepresentative.findMany({
      where: {
        representativeId: currentUser.userId,
        status: ACTIVE_REPRESENTATIVE_STATUS,
        revokedAt: null,
      },
      select: { customerId: true },
    });
    const customerIds = links.map((link) => link.customerId);

    if (customerIds.length === 0) {
      return [];
    }

    return prisma.transportRequest.findMany({ where: { customerId: { in: customerIds } } });
  }

  if (currentUser.role === UserRole.DRIVER) {
    await getDriverProfileForCurrentUser(currentUser);
    return prisma.transportRequest.findMany({
      where: { status: { in: [TripStatus.REQUESTED, TripStatus.QUOTING] } },
      orderBy: { createdAt: "desc" },
      include: {
        vehicleDetail: {
          select: {
            make: true,
            model: true,
            year: true,
            color: true,
            engineCC: true,
            vehicleType: true,
            capacity: true,
          },
        },
      },
    });
  }

  throw new AppError("Unauthorized", 401);
}

export async function getTransportRequestById(id: string, currentUser: CurrentUser) {
  const request = await prisma.transportRequest.findUnique({ where: { id } });
  if (!request) {
    throw new AppError("Transport request not found", 404);
  }

  if (currentUser.role === UserRole.CUSTOMER) {
    if (request.customerId !== currentUser.userId) {
      throw new AppError("Forbidden", 403);
    }
    return request;
  }

  if (currentUser.role === UserRole.AUTHORIZED_REPRESENTATIVE) {
    const authorized =
      request.authorizedRepresentativeId === currentUser.userId ||
      (await isActiveRepresentativeForCustomer(request.customerId, currentUser.userId));
    if (!authorized) {
      throw new AppError("Forbidden", 403);
    }
    return request;
  }

  if (currentUser.role === UserRole.DRIVER) {
    await getDriverProfileForCurrentUser(currentUser);
    return request;
  }

  throw new AppError("Unauthorized", 401);
}

export async function cancelTransportRequest(id: string, currentUser: CurrentUser) {
  const request = await getTransportRequestById(id, currentUser);
  if (!REQUEST_CANCELLABLE_STATUSES.includes(request.status)) {
    throw new AppError("Transport request cannot be cancelled in its current status", 400);
  }

  return prisma.transportRequest.update({
    where: { id },
    data: { status: TripStatus.CANCELLED },
  });
}
