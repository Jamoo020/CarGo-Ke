import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { TripStatus, UserRole } from "@prisma/client";

const ACTIVE_REPRESENTATIVE_STATUS = "ACTIVE";
const REQUEST_CANCELLABLE_STATUSES: TripStatus[] = [TripStatus.REQUESTED, TripStatus.QUOTING];

export interface TransportRequestPayload {
  customerId?: string;
  origin: string;
  destination: string;
  vehicleDetailId: string;
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
  const { customerId: requestedCustomerId, origin, destination, vehicleDetailId } = payload;

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

  const vehicleDetail = await prisma.vehicleDetail.findUnique({ where: { id: vehicleDetailId } });
  if (!vehicleDetail) {
    throw new AppError("Vehicle detail not found", 404);
  }

  return prisma.transportRequest.create({
    data: {
      customerId,
      authorizedRepresentativeId,
      origin,
      destination,
      vehicleDetailId,
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
