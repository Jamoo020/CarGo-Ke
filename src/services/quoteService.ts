import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { TripStatus, UserRole } from "@prisma/client";

const ACTIVE_REPRESENTATIVE_STATUS = "ACTIVE";
const DRIVER_VERIFIED_STATUS = true;
const QUOTE_STATUS_PENDING = "PENDING";
const QUOTE_STATUS_SELECTED = "SELECTED";
const QUOTE_STATUS_REJECTED = "REJECTED";
const ELIGIBLE_REQUEST_STATUSES: TripStatus[] = [TripStatus.REQUESTED, TripStatus.QUOTING];

export interface QuotePayload {
  amount: number;
  message?: string;
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

async function verifyRequestOwnershipForCustomerOrRepresentative(
  requestId: string,
  currentUser: CurrentUser,
) {
  const request = await prisma.transportRequest.findUnique({
    where: { id: requestId },
  });

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

  if (currentUser.role === UserRole.ADMIN) {
    return request;
  }

  throw new AppError("Unauthorized", 401);
}

async function getDriverForCurrentUser(currentUser: CurrentUser) {
  const driver = await prisma.driver.findUnique({
    where: { userId: currentUser.userId },
    include: { user: true },
  });

  if (!driver) {
    throw new AppError("Driver profile not found", 404);
  }

  if (!driver.verified) {
    throw new AppError("Driver is not eligible to submit quotations", 403);
  }

  return driver;
}

export async function createDriverQuote(
  transportRequestId: string,
  payload: QuotePayload,
  currentUser: CurrentUser,
) {
  if (currentUser.role !== UserRole.DRIVER) {
    throw new AppError("Only drivers may submit quotations", 403);
  }

  const transportRequest = await prisma.transportRequest.findUnique({
    where: { id: transportRequestId },
  });

  if (!transportRequest) {
    throw new AppError("Transport request not found", 404);
  }

  if (!ELIGIBLE_REQUEST_STATUSES.includes(transportRequest.status)) {
    throw new AppError("Cannot submit a quotation for this transport request", 400);
  }

  if (transportRequest.status === TripStatus.CANCELLED) {
    throw new AppError("Cannot submit a quotation for a cancelled transport request", 400);
  }

  const driver = await getDriverForCurrentUser(currentUser);

  const existingQuote = await prisma.driverQuote.findFirst({
    where: {
      transportRequestId,
      driverId: driver.id,
    },
  });

  if (existingQuote) {
    throw new AppError("Driver has already submitted a quotation for this request", 409);
  }

  return prisma.$transaction(async (tx) => {
    const quote = await tx.driverQuote.create({
      data: {
        transportRequestId,
        driverId: driver.id,
        amount: payload.amount,
        message: payload.message,
        status: QUOTE_STATUS_PENDING,
      },
    });

    if (transportRequest.status === TripStatus.REQUESTED) {
      await tx.transportRequest.update({
        where: { id: transportRequestId },
        data: { status: TripStatus.QUOTING },
      });
    }

    return quote;
  });
}

export async function listQuotesForTransportRequest(
  transportRequestId: string,
  currentUser: CurrentUser,
) {
  const transportRequest = await prisma.transportRequest.findUnique({
    where: { id: transportRequestId },
  });

  if (!transportRequest) {
    throw new AppError("Transport request not found", 404);
  }

  if (currentUser.role === UserRole.DRIVER) {
    const driver = await getDriverForCurrentUser(currentUser);
    return prisma.driverQuote.findMany({
      where: {
        transportRequestId,
        driverId: driver.id,
      },
      include: {
        driver: {
          include: {
            user: {
              select: { id: true, fullName: true, role: true },
            },
          },
        },
      },
    });
  }

  await verifyRequestOwnershipForCustomerOrRepresentative(transportRequestId, currentUser);

  return prisma.driverQuote.findMany({
    where: { transportRequestId },
    include: {
      driver: {
        include: {
          user: {
            select: { id: true, fullName: true, role: true },
          },
        },
      },
    },
  });
}

export async function getQuoteById(quoteId: string, currentUser: CurrentUser) {
  const quote = await prisma.driverQuote.findUnique({
    where: { id: quoteId },
    include: {
      transportRequest: true,
      driver: {
        include: {
          user: {
            select: { id: true, fullName: true, role: true },
          },
        },
      },
    },
  });

  if (!quote) {
    throw new AppError("Quote not found", 404);
  }

  if (currentUser.role === UserRole.DRIVER) {
    const driver = await getDriverForCurrentUser(currentUser);
    if (quote.driverId !== driver.id) {
      throw new AppError("Forbidden", 403);
    }
    return quote;
  }

  await verifyRequestOwnershipForCustomerOrRepresentative(quote.transportRequestId, currentUser);

  return quote;
}

export async function selectQuote(quoteId: string, currentUser: CurrentUser) {
  if (
    currentUser.role !== UserRole.CUSTOMER &&
    currentUser.role !== UserRole.AUTHORIZED_REPRESENTATIVE &&
    currentUser.role !== UserRole.ADMIN
  ) {
    throw new AppError("Only customers or authorized representatives may select a quote", 403);
  }

  const quote = await prisma.driverQuote.findUnique({
    where: { id: quoteId },
    include: {
      transportRequest: true,
    },
  });

  if (!quote) {
    throw new AppError("Quote not found", 404);
  }

  const transportRequest = quote.transportRequest;

  if (transportRequest.status === TripStatus.CANCELLED) {
    throw new AppError("Cannot select a quote for a cancelled transport request", 400);
  }

  if (transportRequest.status === TripStatus.DRIVER_SELECTED) {
    throw new AppError("A driver has already been selected for this transport request", 400);
  }

  await verifyRequestOwnershipForCustomerOrRepresentative(transportRequest.id, currentUser);

  const selectedQuote = await prisma.$transaction(async (tx) => {
    await tx.transportRequest.update({
      where: { id: transportRequest.id },
      data: { status: TripStatus.DRIVER_SELECTED },
    });

    await tx.driverQuote.update({
      where: { id: quoteId },
      data: { status: QUOTE_STATUS_SELECTED },
    });

    await tx.driverQuote.updateMany({
      where: {
        transportRequestId: transportRequest.id,
        id: { not: quoteId },
      },
      data: { status: QUOTE_STATUS_REJECTED },
    });

    await tx.trip.create({
      data: {
        transportRequestId: transportRequest.id,
        customerId: transportRequest.customerId,
        authorizedRepresentativeId: transportRequest.authorizedRepresentativeId,
        driverId: quote.driverId,
        vehicleDetailId: transportRequest.vehicleDetailId,
        status: TripStatus.PAYMENT_PENDING,
        bookingAmount: quote.amount,
        driverFee: quote.amount,
        fuelBudget: 0,
        carGoFee: 0,
        driverAmountReleased: 0,
        driverAmountRemaining: quote.amount,
        refundAmount: 0,
      },
    });

    return tx.driverQuote.findUnique({
      where: { id: quoteId },
      include: {
        driver: {
          include: {
            user: {
              select: { id: true, fullName: true, role: true },
            },
          },
        },
      },
    });
  });

  if (!selectedQuote) {
    throw new AppError("Unable to select quote", 500);
  }

  return selectedQuote;
}

export async function listMyQuotes(currentUser: CurrentUser) {
  if (currentUser.role !== UserRole.DRIVER) {
    throw new AppError("Only drivers may view their own quotations", 403);
  }

  const driver = await getDriverForCurrentUser(currentUser);

  return prisma.driverQuote.findMany({
    where: { driverId: driver.id },
    include: {
      transportRequest: true,
    },
  });
}
