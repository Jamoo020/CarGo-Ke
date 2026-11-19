import { verifyPaymentWebhookSignature } from "./paymentProvider";

jest.mock("../config", () => ({
  config: { environment: "production" },
  getPaymentWebhookSecret: jest.fn(() => {
    throw new Error("PAYMENT_WEBHOOK_SECRET must be configured");
  }),
}));

describe("production webhook configuration", () => {
  it("fails closed when the webhook secret is unavailable", () => {
    expect(() => verifyPaymentWebhookSignature("signature", '{"event":"payment"}')).toThrow(
      "PAYMENT_WEBHOOK_SECRET must be configured",
    );
  });
});
