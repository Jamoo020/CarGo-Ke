import crypto from "crypto";
import { verifyPaymentWebhookSignature } from "./paymentProvider";

jest.mock("../config", () => ({
  config: { environment: "production" },
  getPaymentWebhookSecret: jest.fn(() => "test-webhook-secret-with-at-least-32-chars"),
}));

const secret = "test-webhook-secret-with-at-least-32-chars";

describe("payment webhook signature verification", () => {
  it("accepts a valid HMAC signature over the exact raw body", () => {
    const body = '{"providerReference":"ref-1","amount":100}';
    const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");

    expect(() => verifyPaymentWebhookSignature(signature, body)).not.toThrow();
  });

  it("rejects missing signatures, invalid signatures, and missing raw request bodies", () => {
    expect(() => verifyPaymentWebhookSignature(undefined, "raw-body")).toThrow(
      "Missing payment webhook signature",
    );
    expect(() => verifyPaymentWebhookSignature("invalid", "raw-body")).toThrow(
      "Invalid payment webhook signature",
    );
    expect(() => verifyPaymentWebhookSignature(undefined, "")).toThrow(
      "Missing webhook payload",
    );
  });
});
