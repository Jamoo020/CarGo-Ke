import { PaymentStatus, RefundStatus, TripStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { verifyTripParticipation } from "./authorizationService";
import { createRefund } from "./refundService";

jest.mock("../db", () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

jest.mock("./authorizationService", () => ({
  verifyTripParticipation: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedVerifyTrip = verifyTripParticipation as jest.Mock;
const customer = { userId: "customer-1", role: UserRole.CUSTOMER };

function createRefundHarness(existingRefund: object | null = null, createError?: Error) {
  const tripWallet = { id: "trip-wallet-1", tripId: "trip-1", refundAmount: 0 };
  let storedRefund = existingRefund;
  const tx = {
    payment: {
      findUnique: jest.fn().mockResolvedValue({
        id: "payment-1",
        tripId: "trip-1",
        customerId: "customer-1",
        amount: 1000,
        status: PaymentStatus.CONFIRMED,
        refunds: [],
      }),
    },
    tripWallet: {
      findUnique: jest.fn().mockResolvedValue(tripWallet),
      updateMany: jest.fn().mockImplementation(async ({ where, data }: { where: { refundAmount: number }; data: { refundAmount: number } }) => {
        if (where.refundAmount !== tripWallet.refundAmount) return { count: 0 };
        tripWallet.refundAmount = data.refundAmount;
        return { count: 1 };
      }),
    },
    refund: {
      findUnique: jest.fn().mockImplementation(async () => storedRefund),
      create: jest.fn().mockImplementation(async ({ data }: { data: Record<string, unknown> }) => {
        if (createError) throw createError;
        storedRefund = { id: "refund-1", ...data };
        return storedRefund;
      }),
      update: jest.fn(),
    },
    walletTransaction: { create: jest.fn() },
    trip: { update: jest.fn() },
  };
  (mockedPrisma.$transaction as jest.Mock).mockImplementation(async (callback: (client: typeof tx) => Promise<unknown>) => {
    const previousRefundAmount = tripWallet.refundAmount;
    try {
      return await callback(tx);
    } catch (error) {
      tripWallet.refundAmount = previousRefundAmount;
      throw error;
    }
  });
  mockedVerifyTrip.mockResolvedValue({
    id: "trip-1",
    customerId: "customer-1",
    status: TripStatus.CANCELLED,
  });
  return { tx, tripWallet };
}

describe("refund request tracking without a provider integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("records approved amounts as pending and does not claim provider completion", async () => {
    const harness = createRefundHarness();

    const result = await createRefund("trip-1", { amount: 250, reason: "Approved dispute refund" }, customer);

    expect(result).toMatchObject({
      status: RefundStatus.PENDING,
      amount: 250,
      requestKey: expect.stringMatching(/^refund-request:payment-1:/),
    });
    expect(harness.tripWallet.refundAmount).toBe(250);
    expect(harness.tx.refund.update).not.toHaveBeenCalled();
    expect(harness.tx.walletTransaction.create).not.toHaveBeenCalled();
    expect(harness.tx.trip.update).not.toHaveBeenCalled();
  });

  it("returns the same refund request for an identical retry", async () => {
    const harness = createRefundHarness();

    const payload = { amount: 250, reason: "Approved dispute refund" };
    const first = await createRefund("trip-1", payload, customer);
    const retry = await createRefund("trip-1", payload, customer);

    expect(retry).toBe(first);
    expect(harness.tx.tripWallet.updateMany).toHaveBeenCalledTimes(1);
    expect(harness.tx.refund.create).toHaveBeenCalledTimes(1);
  });

  it("does not complete or record a refund when refund persistence fails", async () => {
    const harness = createRefundHarness(null, new Error("refund storage unavailable"));

    await expect(
      createRefund("trip-1", { amount: 250, reason: "Approved dispute refund" }, customer),
    ).rejects.toThrow("refund storage unavailable");

    expect(harness.tripWallet.refundAmount).toBe(0);
    expect(harness.tx.refund.update).not.toHaveBeenCalled();
    expect(harness.tx.walletTransaction.create).not.toHaveBeenCalled();
    expect(harness.tx.trip.update).not.toHaveBeenCalled();
  });

  it("rejects an amount above the payment total", async () => {
    const harness = createRefundHarness();

    await expect(
      createRefund("trip-1", { amount: 1001, reason: "Too much" }, customer),
    ).rejects.toMatchObject({ statusCode: 400 });
    expect(harness.tx.tripWallet.updateMany).not.toHaveBeenCalled();
  });
});
