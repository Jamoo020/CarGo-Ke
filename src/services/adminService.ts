import { AccountStatus, DriverVerificationStatus, Prisma, TripStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { createAdminAuditLog } from "./adminAuditService";

export const ADMIN_CAPABILITIES = {
  USER_MANAGEMENT: "USER_MANAGEMENT",
  DRIVER_VERIFICATION: "DRIVER_VERIFICATION",
  TRIP_OVERSIGHT: "TRIP_OVERSIGHT",
  PAYMENT_OVERSIGHT: "PAYMENT_OVERSIGHT",
  WALLET_OVERSIGHT: "WALLET_OVERSIGHT",
  DISPUTE_MANAGEMENT: "DISPUTE_MANAGEMENT",
  CONFIGURATION_MANAGEMENT: "CONFIGURATION_MANAGEMENT",
  AUDIT_LOG_ACCESS: "AUDIT_LOG_ACCESS",
} as const;

export interface AdminActor {
  userId: string;
  role: UserRole;
}

const VALID_ACCOUNT_STATUS = new Set([AccountStatus.ACTIVE, AccountStatus.SUSPENDED, AccountStatus.DEACTIVATED]);

export async function assertAdminCapability(currentUser: AdminActor, capability: string) {
  const actor = await prisma.user.findUnique({ where: { id: currentUser.userId } });
  if (!actor) {
    throw new AppError("User not found", 404);
  }

  if (actor.role !== UserRole.ADMIN) {
    throw new AppError("Forbidden", 403);
  }

  if (actor.accountStatus !== AccountStatus.ACTIVE) {
    throw new AppError("Admin account is not active", 403);
  }

  if (!Object.values(ADMIN_CAPABILITIES).includes(capability as any)) {
    throw new AppError("Unsupported admin capability", 400);
  }

  return actor;
}

export async function listUsersAdmin(
  { search, role, accountStatus }: { search?: string; role?: string; accountStatus?: string } = {},
  currentUser?: AdminActor,
) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.USER_MANAGEMENT);
  const where: Prisma.UserWhereInput = {};
  if (search) {
    const term = search.trim();
    if (term) {
      where.OR = [
        { email: { contains: term, mode: "insensitive" } },
        { fullName: { contains: term, mode: "insensitive" } },
      ];
    }
  }

  if (role && Object.values(UserRole).includes(role as UserRole)) {
    where.role = role as UserRole;
  }

  if (accountStatus && VALID_ACCOUNT_STATUS.has(accountStatus as AccountStatus)) {
    where.accountStatus = accountStatus as AccountStatus;
  }

  return prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      accountStatus: true,
      createdAt: true,
      updatedAt: true,
      driverProfile: { select: { id: true, verified: true, verificationStatus: true, licenseNumber: true } },
    },
  });
}

export async function getUserAdmin(userId: string, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.USER_MANAGEMENT);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      accountStatus: true,
      createdAt: true,
      updatedAt: true,
      driverProfile: { select: { id: true, verified: true, verificationStatus: true, licenseNumber: true } },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
}

export async function updateUserAccountStatusAdmin(
  userId: string,
  payload: { accountStatus?: string; reason?: string },
  currentUser: AdminActor,
) {
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.USER_MANAGEMENT);

  if (!payload.accountStatus || !VALID_ACCOUNT_STATUS.has(payload.accountStatus as AccountStatus)) {
    throw new AppError("accountStatus is required and must be ACTIVE, SUSPENDED, or DEACTIVATED", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.id === currentUser.userId && payload.accountStatus !== AccountStatus.ACTIVE) {
    throw new AppError("Administrators cannot disable their own account using this flow", 400);
  }

  const previousState = user.accountStatus;
  const newState = payload.accountStatus as AccountStatus;

  const updated = await prisma.$transaction(async (tx) => {
    const updatedUser = await tx.user.update({
      where: { id: userId },
      data: { accountStatus: newState },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        accountStatus: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await createAdminAuditLog({
      actorId: currentUser.userId,
      entity: "User",
      entityId: userId,
      action: "USER_ACCOUNT_STATUS_UPDATED",
      capability: ADMIN_CAPABILITIES.USER_MANAGEMENT,
      previousState: previousState,
      newState: newState,
      reason: payload.reason ?? null,
      result: "SUCCESS",
      metadata: { accountStatus: newState },
      tx,
    });

    return updatedUser;
  });

  return updated;
}

const DRIVER_VERIFICATION_TRANSITIONS: Record<DriverVerificationStatus, DriverVerificationStatus[]> = {
  [DriverVerificationStatus.PENDING]: [DriverVerificationStatus.APPROVED, DriverVerificationStatus.REJECTED],
  [DriverVerificationStatus.APPROVED]: [DriverVerificationStatus.SUSPENDED],
  [DriverVerificationStatus.REJECTED]: [],
  [DriverVerificationStatus.SUSPENDED]: [DriverVerificationStatus.APPROVED],
};

async function applyDriverVerificationDecision(
  driverId: string,
  nextStatus: DriverVerificationStatus,
  currentUser: AdminActor,
  reason?: string,
) {
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.DRIVER_VERIFICATION);

  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    include: { user: true },
  });

  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  const previousStatus = driver.verificationStatus ?? DriverVerificationStatus.PENDING;
  if (!DRIVER_VERIFICATION_TRANSITIONS[previousStatus].includes(nextStatus)) {
    throw new AppError(`Invalid driver verification transition from ${previousStatus} to ${nextStatus}`, 400);
  }

  return prisma.$transaction(async (tx) => {
    const updatedDriver = await tx.driver.update({
      where: { id: driverId },
      data: {
        verificationStatus: nextStatus,
        verificationReason: reason ?? null,
        verificationNotes: reason ?? null,
        lastReviewedByUserId: currentUser.userId,
        verified: nextStatus === DriverVerificationStatus.APPROVED,
      },
      include: { user: true },
    });

    await createAdminAuditLog({
      actorId: currentUser.userId,
      entity: "Driver",
      entityId: driverId,
      action: `DRIVER_${nextStatus}`,
      capability: ADMIN_CAPABILITIES.DRIVER_VERIFICATION,
      previousState: previousStatus,
      newState: nextStatus,
      reason: reason ?? null,
      result: "SUCCESS",
      metadata: { userId: driver.user.id },
      tx,
    });

    return updatedDriver;
  });
}

export async function listDriversAdmin({ status }: { status?: string } = {}, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.DRIVER_VERIFICATION);

  const where: Prisma.DriverWhereInput = {};
  if (status && Object.values(DriverVerificationStatus).includes(status as DriverVerificationStatus)) {
    where.verificationStatus = status as DriverVerificationStatus;
  }

  return prisma.driver.findMany({
    where,
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getDriverAdmin(driverId: string, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.DRIVER_VERIFICATION);

  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    include: { user: true },
  });

  if (!driver) {
    throw new AppError("Driver not found", 404);
  }

  return driver;
}

export async function approveDriverAdmin(driverId: string, payload: { reason?: string }, currentUser: AdminActor) {
  return applyDriverVerificationDecision(driverId, DriverVerificationStatus.APPROVED, currentUser, payload.reason);
}

export async function rejectDriverAdmin(driverId: string, payload: { reason?: string }, currentUser: AdminActor) {
  if (!payload.reason || payload.reason.trim().length === 0) {
    throw new AppError("reason is required for driver rejection", 400);
  }
  return applyDriverVerificationDecision(driverId, DriverVerificationStatus.REJECTED, currentUser, payload.reason);
}

export async function suspendDriverAdmin(driverId: string, payload: { reason?: string }, currentUser: AdminActor) {
  if (!payload.reason || payload.reason.trim().length === 0) {
    throw new AppError("reason is required for driver suspension", 400);
  }
  return applyDriverVerificationDecision(driverId, DriverVerificationStatus.SUSPENDED, currentUser, payload.reason);
}

export async function reactivateDriverAdmin(driverId: string, payload: { reason?: string }, currentUser: AdminActor) {
  if (!payload.reason || payload.reason.trim().length === 0) {
    throw new AppError("reason is required for driver reactivation", 400);
  }
  return applyDriverVerificationDecision(driverId, DriverVerificationStatus.APPROVED, currentUser, payload.reason);
}

export async function listTripsAdmin({ status, search }: { status?: string; search?: string } = {}, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.TRIP_OVERSIGHT);

  const where: Prisma.TripWhereInput = {};
  if (status && Object.values(TripStatus).includes(status as TripStatus)) {
    where.status = status as TripStatus;
  }

  if (search) {
    const term = search.trim();
    if (term) {
      where.OR = [
        { id: { contains: term, mode: "insensitive" } },
        { customerId: { contains: term, mode: "insensitive" } },
        { driverId: { contains: term, mode: "insensitive" } },
      ];
    }
  }

  return prisma.trip.findMany({
    where,
    include: { transportRequest: true, customer: true, driver: { include: { user: true } }, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTripAdmin(tripId: string, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.TRIP_OVERSIGHT);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { transportRequest: true, customer: true, driver: { include: { user: true } }, payment: true, dispute: true },
  });

  if (!trip) {
    throw new AppError("Trip not found", 404);
  }

  return trip;
}

export async function listPaymentsAdmin({ status, search }: { status?: string; search?: string } = {}, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.PAYMENT_OVERSIGHT);

  const where: Prisma.PaymentWhereInput = {};
  if (status && ["PENDING", "CONFIRMED", "FAILED"].includes(status)) {
    where.status = status as any;
  }

  if (search) {
    const term = search.trim();
    if (term) {
      where.OR = [
        { id: { contains: term, mode: "insensitive" } },
        { tripId: { contains: term, mode: "insensitive" } },
        { providerReference: { contains: term, mode: "insensitive" } },
      ];
    }
  }

  return prisma.payment.findMany({
    where,
    include: { trip: true, customer: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPaymentAdmin(paymentId: string, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.PAYMENT_OVERSIGHT);

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { trip: true, customer: true, refunds: true, transactions: true },
  });

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  return payment;
}

export async function listWalletTransactionsAdmin({ type, search }: { type?: string; search?: string } = {}, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.WALLET_OVERSIGHT);

  const where: Prisma.WalletTransactionWhereInput = {};
  if (type) {
    where.type = type as any;
  }

  if (search) {
    const term = search.trim();
    if (term) {
      where.OR = [
        { id: { contains: term, mode: "insensitive" } },
        { note: { contains: term, mode: "insensitive" } },
      ];
    }
  }

  return prisma.walletTransaction.findMany({
    where,
    include: { tripWallet: true, driverWallet: true, payment: true, refund: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function listPlatformSettingsAdmin(currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.CONFIGURATION_MANAGEMENT);
  return prisma.platformSetting.findMany({ orderBy: { key: "asc" } });
}

export async function getPlatformSettingAdmin(key: string, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.CONFIGURATION_MANAGEMENT);

  const setting = await prisma.platformSetting.findUnique({ where: { key } });
  if (!setting) {
    throw new AppError("Setting not found", 404);
  }
  return setting;
}

export async function updatePlatformSettingAdmin(
  key: string,
  payload: { value?: string; description?: string },
  currentUser: AdminActor,
) {
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.CONFIGURATION_MANAGEMENT);

  if (!payload.value || typeof payload.value !== "string") {
    throw new AppError("value is required and must be a string", 400);
  }

  const existing = await prisma.platformSetting.findUnique({ where: { key } });
  const previousValue = existing?.value ?? null;

  const updated = await prisma.$transaction(async (tx) => {
    const setting = await tx.platformSetting.upsert({
      where: { key },
      create: { key, value: payload.value!, description: payload.description ?? null, updatedById: currentUser.userId },
      update: { value: payload.value!, description: payload.description ?? existing?.description ?? null, updatedById: currentUser.userId },
    });

    await createAdminAuditLog({
      actorId: currentUser.userId,
      entity: "PlatformSetting",
      entityId: key,
      action: "CONFIGURATION_UPDATED",
      capability: ADMIN_CAPABILITIES.CONFIGURATION_MANAGEMENT,
      previousState: previousValue,
      newState: payload.value,
      reason: payload.description ?? null,
      result: "SUCCESS",
      metadata: { key, value: payload.value },
      tx,
    });

    return setting;
  });

  return updated;
}

export async function listAuditLogsAdmin(currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.AUDIT_LOG_ACCESS);
  return prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
}

export async function getAdminDispute(disputeId: string, currentUser?: AdminActor) {
  if (!currentUser) {
    throw new AppError("Unauthorized", 401);
  }
  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.DISPUTE_MANAGEMENT);

  const dispute = await prisma.dispute.findUnique({ where: { id: disputeId } });
  if (!dispute) {
    throw new AppError("Dispute not found", 404);
  }
  return dispute;
}
