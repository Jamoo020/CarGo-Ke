import crypto from "crypto";
import { config, getPaymentWebhookSecret } from "../config";
import { AppError } from "../errors/AppError";

export const PAYMENT_WEBHOOK_SIGNATURE_HEADER = "x-payment-signature";

export function verifyPaymentWebhookSignature(signature: string | undefined, rawBody?: string) {
  const secret = getPaymentWebhookSecret();

  if (!secret) {
    throw new AppError("Payment webhook verification is not configured", 503);
  }

  if (!rawBody) {
    throw new AppError("Missing webhook payload", 400);
  }

  if (!signature) {
    throw new AppError("Missing payment webhook signature", 401);
  }

  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const bufferSignature = Buffer.from(signature, "utf8");
  const bufferExpected = Buffer.from(expectedSignature, "utf8");

  if (bufferSignature.length !== bufferExpected.length) {
    throw new AppError("Invalid payment webhook signature", 401);
  }

  const signatureView = new DataView(
    bufferSignature.buffer,
    bufferSignature.byteOffset,
    bufferSignature.byteLength,
  );
  const expectedView = new DataView(
    bufferExpected.buffer,
    bufferExpected.byteOffset,
    bufferExpected.byteLength,
  );
  if (!crypto.timingSafeEqual(signatureView, expectedView)) {
    throw new AppError("Invalid payment webhook signature", 401);
  }
}

export function mapProviderPaymentStatus(status: string) {
  const normalized = status.trim().toLowerCase();

  const confirmedValues = new Set(["confirmed", "paid", "success", "completed", "succeeded"]);
  const failedValues = new Set(["failed", "failure", "rejected", "declined", "cancelled", "canceled", "error"]);

  if (confirmedValues.has(normalized)) {
    return "CONFIRMED";
  }

  if (failedValues.has(normalized)) {
    return "FAILED";
  }

  return null;
}

export function getPaymentWebhookPayloadRaw(body: unknown): string {
  if (typeof body === "string") {
    return body;
  }
  return JSON.stringify(body);
}
