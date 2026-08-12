import { Prisma, UserRole, DisputeStatus, DisputeResolutionType } from "@prisma/client";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { CurrentUser, verifyTripParticipation } from "./authorizationService";
import { transitionTripStatus } from "./tripService";
import { createRefundTx } from "./refundService";
import { createAdminAuditLog } from "./adminAuditService";
import { ADMIN_CAPABILITIES, assertAdminCapability } from "./adminService";

export interface CreateDisputePayload {
  description: string;
  category?: string;
  priority?: string;
}

export interface UpdateDisputePayload {
  status?: DisputeStatus | string;
  resolutionType?: DisputeResolutionType | string;
  resolutionAmount?: number;
  resolutionSummary?: string;
}

function normalizeOptionalString(value: unknown, fieldName: string) {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new AppError(`${fieldName} must be a string`, 400);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new AppError(`${fieldName} must not be empty`, 400);
  }

  return trimmed;
}

export async function createDispute(tripId: string, payload: CreateDisputePayload, currentUser: CurrentUser) {
  return prisma.$transaction(async (tx) => createDisputeTx(tx, tripId, payload, currentUser));
}

export async function createDisputeTx(
  tx: Prisma.TransactionClient,
  tripId: string,
  payload: CreateDisputePayload,
  currentUser: CurrentUser,
) {
  const allowedRoles: UserRole[] = [UserRole.CUSTOMER, UserRole.AUTHORIZED_REPRESENTATIVE, UserRole.ADMIN, UserRole.DRIVER];
  if (!allowedRoles.includes(currentUser.role)) {
    throw new AppError("Only customers, authorized representatives, or admins may open disputes", 403);
  }

  const trip = await verifyTripParticipation(tripId, currentUser, tx);

  const description = normalizeOptionalString(payload.description, "description");
  if (!description) {
    throw new AppError("description is required", 400);
  }

  if (description.length > 1000) {
    throw new AppError("description must not exceed 1000 characters", 400);
  }

  if (payload.category !== undefined) {
    normalizeOptionalString(payload.category, "category");
  }

  if (payload.priority !== undefined) {
    normalizeOptionalString(payload.priority, "priority");
  }

  const existingDispute = await tx.dispute.findUnique({ where: { tripId } });
  if (existingDispute) {
    throw new AppError("A dispute already exists for this trip", 409);
  }

  if (!trip.customerId) {
    throw new AppError("Trip customer not found", 400);
  }

  await transitionTripStatus(tripId, "disputeTrip", currentUser, {}, tx);

  return tx.dispute.create({
    data: {
      tripId,
      customerId: trip.customerId,
      raisedById: currentUser.userId,
      raisedByRole: currentUser.role,
      description,
      category: payload.category as any,
      priority: payload.priority as any,
      status: DisputeStatus.OPEN,
    },
  });
}

export async function getDisputeById(disputeId: string, currentUser: CurrentUser) {
  if (currentUser.role === UserRole.ADMIN) {
    await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.DISPUTE_MANAGEMENT);
  }

  return prisma.$transaction(async (tx) => getDisputeByIdTx(tx, disputeId, currentUser));
}

export async function getDisputeByIdTx(tx: Prisma.TransactionClient, disputeId: string, currentUser: CurrentUser) {
  const dispute = await tx.dispute.findUnique({ where: { id: disputeId } });
  if (!dispute) {
    throw new AppError("Dispute not found", 404);
  }

  await verifyTripParticipation(dispute.tripId, currentUser, tx);
  return dispute;
}

export async function updateDispute(disputeId: string, payload: UpdateDisputePayload, currentUser: CurrentUser) {
  return prisma.$transaction(async (tx) => updateDisputeTx(tx, disputeId, payload, currentUser));
}

export async function updateDisputeTx(
  tx: Prisma.TransactionClient,
  disputeId: string,
  payload: UpdateDisputePayload,
  currentUser: CurrentUser,
) {
  if (currentUser.role !== UserRole.ADMIN) {
    throw new AppError("Only admins can resolve disputes", 403);
  }

  await assertAdminCapability(currentUser, ADMIN_CAPABILITIES.DISPUTE_MANAGEMENT);

  const dispute = await tx.dispute.findUnique({ where: { id: disputeId } });
  if (!dispute) {
    throw new AppError("Dispute not found", 404);
  }

  await verifyTripParticipation(dispute.tripId, currentUser, tx);

  const data: Prisma.DisputeUpdateInput = {};

  if (payload.status !== undefined) {
    const normalizedStatus = normalizeOptionalString(payload.status, "status");
    if (!Object.values(DisputeStatus).includes(normalizedStatus as DisputeStatus)) {
      throw new AppError("status must be a valid dispute status", 400);
    }
    data.status = normalizedStatus as DisputeStatus;
  }

  if (payload.resolutionType !== undefined) {
    const normalizedResolutionType = normalizeOptionalString(payload.resolutionType, "resolutionType");
    if (!Object.values(DisputeResolutionType).includes(normalizedResolutionType as DisputeResolutionType)) {
      throw new AppError("resolutionType must be a valid dispute resolution type", 400);
    }
    data.resolutionType = normalizedResolutionType as DisputeResolutionType;
  }

  if (payload.resolutionAmount !== undefined) {
    const amount = payload.resolutionAmount;
    if (typeof amount !== "number" || Number.isNaN(amount) || amount < 0) {
      throw new AppError("resolutionAmount must be a non-negative number", 400);
    }
    data.resolutionAmount = amount;
  }

  if (payload.resolutionSummary !== undefined) {
    data.resolutionSummary = normalizeOptionalString(payload.resolutionSummary, "resolutionSummary");
  }

  const normalizedStatus = data.status as DisputeStatus | undefined;
  if (normalizedStatus === DisputeStatus.RESOLVED || normalizedStatus === DisputeStatus.CLOSED) {
    // Prevent duplicate resolution
    if (dispute.status === DisputeStatus.RESOLVED || dispute.status === DisputeStatus.CLOSED) {
      throw new AppError("Dispute already resolved", 409);
    }

    // If a financial resolution is requested, perform it within the same transaction
    if (data.resolutionType === DisputeResolutionType.FULL_REFUND || data.resolutionType === DisputeResolutionType.PARTIAL_REFUND) {
      // Determine refund amount
      let refundAmount: number | undefined = data.resolutionAmount as number | undefined;

      // Fetch payment and associated refunds
      const payment = await tx.payment.findUnique({ where: { tripId: dispute.tripId }, include: { refunds: true } });
      if (!payment) {
        throw new AppError("Payment not found for this trip", 404);
      }

      if (data.resolutionType === DisputeResolutionType.FULL_REFUND) {
        const alreadyRefunded = payment.refunds.reduce((sum, r) => sum + r.amount, 0);
        const refundable = payment.amount - alreadyRefunded;
        if (refundable <= 0) {
          throw new AppError("Payment has already been fully refunded", 400);
        }
        refundAmount = refundable;
      } else {
        // PARTIAL_REFUND requires resolutionAmount
        if (refundAmount === undefined) {
          throw new AppError("resolutionAmount is required for PARTIAL_REFUND", 400);
        }
        if (typeof refundAmount !== "number" || Number.isNaN(refundAmount) || refundAmount <= 0) {
          throw new AppError("resolutionAmount must be a positive number", 400);
        }
        const alreadyRefunded = payment.refunds.reduce((sum, r) => sum + r.amount, 0);
        const refundable = payment.amount - alreadyRefunded;
        if (refundAmount > refundable) {
          throw new AppError("Refund amount exceeds refundable balance", 400);
        }
      }

      // Create refund via refundService within current transaction
      await createRefundTx(tx, dispute.tripId, { amount: refundAmount!, reason: payload.resolutionSummary ?? "Dispute resolution refund" }, currentUser);
      data.resolutionAmount = refundAmount;
    }

    data.resolvedAt = new Date();
  } else if (payload.status !== undefined) {
    data.resolvedAt = null;
  }

  const updatedDispute = await tx.dispute.update({ where: { id: disputeId }, data });

  await createAdminAuditLog({
    actorId: currentUser.userId,
    entity: "Dispute",
    entityId: disputeId,
    action: normalizedStatus === DisputeStatus.RESOLVED || normalizedStatus === DisputeStatus.CLOSED ? "DISPUTE_RESOLVED" : "DISPUTE_UPDATED",
    capability: "DISPUTE_MANAGEMENT",
    previousState: dispute.status,
    newState: normalizedStatus ?? dispute.status,
    reason: payload.resolutionSummary ?? null,
    result: "SUCCESS",
    metadata: {
      status: normalizedStatus ?? dispute.status,
      resolutionType: payload.resolutionType ?? null,
      resolutionAmount: payload.resolutionAmount ?? null,
    },
    tx,
  });

  return updatedDispute;
}
