import crypto from "crypto";
import { NextFunction, Response } from "express";
import { paymentWebhook } from "./paymentController";
import { processProviderPaymentCallback } from "../services/paymentService";
import { PAYMENT_WEBHOOK_SIGNATURE_HEADER } from "../services/paymentProvider";

jest.mock("../config", () => ({
  config: { environment: "production" },
  getPaymentWebhookSecret: () => "test-webhook-secret-with-at-least-32-chars",
}));

jest.mock("../db", () => ({ prisma: {} }));
jest.mock("../services/paymentService", () => ({
  createTripPayment: jest.fn(),
  confirmTripPayment: jest.fn(),
  getPayment: jest.fn(),
  getTripPayment: jest.fn(),
  processProviderPaymentCallback: jest.fn(),
}));

const secret = "test-webhook-secret-with-at-least-32-chars";
const rawBody = '{"providerReference":"provider-1","amount":100}';

function request(signature?: string) {
  return {
    header: jest.fn().mockReturnValue(signature),
    rawBody,
    body: JSON.parse(rawBody),
  };
}

function response() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
}

describe("payment webhook controller verification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(["missing", "invalid"])("does not process a payment when the signature is %s", async (kind) => {
    const signature = kind === "missing"
      ? undefined
      : "invalid-signature";
    const req = request(signature);
    const res = response();
    const next = jest.fn();

    await paymentWebhook(
      req as unknown as Parameters<typeof paymentWebhook>[0],
      res as unknown as Response,
      next as NextFunction,
    );

    expect(processProviderPaymentCallback).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });

  it("processes a payment only after verifying the signature over the raw body", async () => {
    const signature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const req = request(signature);
    const res = response();

    await paymentWebhook(
      req as unknown as Parameters<typeof paymentWebhook>[0],
      res as unknown as Response,
      jest.fn() as NextFunction,
    );

    expect(req.header).toHaveBeenCalledWith(PAYMENT_WEBHOOK_SIGNATURE_HEADER);
    expect(processProviderPaymentCallback).toHaveBeenCalledWith(JSON.parse(rawBody));
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
