import { UserRole } from "@prisma/client";
import { confirmTripPayment } from "./paymentService";

jest.mock("../db", () => ({ prisma: {} }));
jest.mock("../config", () => ({
  config: {
    environment: "production",
    paymentMode: "live",
    paymentProviderCurrency: "KES",
  },
}));

describe("production payment confirmation", () => {
  it.each([
    ["customers", UserRole.CUSTOMER],
    ["administrators", UserRole.ADMIN],
  ])("does not allow manual confirmation by %s", async (_label, role) => {
    await expect(
      confirmTripPayment("payment-1", {}, { userId: "user-1", role }),
    ).rejects.toMatchObject({
      statusCode: 403,
      message: "Manual payment confirmation is available only in explicitly enabled mock mode outside production",
    });
  });
});
