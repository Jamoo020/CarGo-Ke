import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { PaymentStatus, RefundStatus, UserRole, WalletTransactionType } from "@prisma/client";
import { CurrentUser, verifyTripParticipation } from "./authorizationService";

export interface RefundPayload {
  amount: number;
  reason: string;
}

export async function createRefund(tripId: string, payload: RefundPayload, currentUser: CurrentUser) {
  return prisma.$transaction(async (tx) => createRefundTx(tx, tripId, payload, currentUser));
}

export async function createRefundTx(
  tx: Prisma.TransactionClient,
  tripId: string,
  payload: RefundPayload,
  currentUser: CurrentUser,
) {
  const trip = await verifyTripParticipation(tripId, currentUser, tx);

  if (currentUser.role === UserRole.DRIVER) {
    throw new AppError("Drivers may not initiate customer refunds", 403);
  }

  const payment = await tx.payment.findUnique({
    where: { tripId },
    include: { refunds: true },
  });

  if (!payment) {
    throw new AppError("Payment not found for this trip", 404);
  }

  if (payment.status !== PaymentStatus.CONFIRMED) {
    throw new AppError("Refunds may only be processed for confirmed payments", 400);
  }

  const amount = payload.amount;
  if (typeof amount !== "number" || Number.isNaN(amount) || amount <= 0) {
    throw new AppError("Refund amount must be a positive number", 400);
  }

  const reason = payload.reason?.trim();
  if (!reason) {
    throw new AppError("Refund reason is required", 400);
  }
  if (reason.length > 500) {
    throw new AppError("Refund reason must not exceed 500 characters", 400);
  }

  const alreadyRefunded = payment.refunds.reduce((sum, refund) => sum + refund.amount, 0);
  const refundableAmount = payment.amount - alreadyRefunded;

  if (refundableAmount <= 0) {
    throw new AppError("Payment has already been fully refunded", 400);
  }

  if (amount > refundableAmount) {
    throw new AppError("Refund amount exceeds refundable balance", 400);
  }

  const tripWallet = await tx.tripWallet.findUnique({
    where: { tripId },
  });

  if (!tripWallet) {
    throw new AppError("Trip wallet not found for refund processing", 400);
  }

  const updatedTripWalletCount = await tx.tripWallet.updateMany({
    where: { id: tripWallet.id, refundAmount: tripWallet.refundAmount },
    data: { refundAmount: tripWallet.refundAmount + amount },
  });

  if (updatedTripWalletCount.count === 0) {
    throw new AppError(
      "Refund could not be completed due to concurrent modification. Please retry.",
      409,
    );
  }

  const updatedTripWallet = await tx.tripWallet.findUnique({ where: { id: tripWallet.id } });
  if (!updatedTripWallet) {
    throw new AppError("Trip wallet not found after update", 500);
  }

  const refund = await tx.refund.create({
    data: {
      tripId,
      paymentId: payment.id,
      customerId: trip.customerId ?? payment.customerId,
      amount,
      status: RefundStatus.PENDING,
      reason,
    },
  });

  await tx.walletTransaction.create({
    data: {
      tripWalletId: updatedTripWallet.id,
      paymentId: payment.id,
      refundId: refund.id,
      type: WalletTransactionType.REFUND,
      amount,
      note: reason,
    },
  });

  const completedRefund = await tx.refund.update({
    where: { id: refund.id },
    data: { status: RefundStatus.COMPLETED },
  });

  await tx.trip.update({
    where: { id: tripId },
    data: { refundAmount: { increment: amount } },
  });

  return completedRefund;
}
