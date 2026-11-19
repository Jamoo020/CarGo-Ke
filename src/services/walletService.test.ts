import { TripStatus, UserRole, WalletTransactionType } from "@prisma/client";
import { prisma } from "../db";
import { getDriverForCurrentUser, verifyTripParticipation } from "./authorizationService";
import { initializeTripWallet, releaseDriverFunds } from "./walletService";

jest.mock("../db", () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

jest.mock("./authorizationService", () => ({
  getDriverForCurrentUser: jest.fn(),
  verifyTripParticipation: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedGetDriver = getDriverForCurrentUser as jest.Mock;
const mockedVerifyTrip = verifyTripParticipation as jest.Mock;
const driverUser = { userId: "driver-user", role: UserRole.DRIVER };

function setupReleaseHarness(options: {
  tripStatuses?: Record<string, TripStatus>;
  tripWallets?: Record<string, {
    id: string;
    tripId: string;
    driverFee: number;
    fuelBudget: number;
    carGoFee?: number;
    driverAmountReleased: number;
    driverAmountRemaining: number;
    driverCompensationReleased?: number;
    driverCompensationRemaining?: number;
    releaseAccountingVersion?: number;
    customerPaymentAmount?: number;
  }>;
  releaseConflict?: boolean;
  ledgerFailure?: boolean;
} = {}) {
  const statuses = options.tripStatuses ?? { "trip-1": TripStatus.TRIP_ACTIVE };
  const wallets = options.tripWallets ?? {
    "trip-1": {
      id: "trip-wallet-1",
      tripId: "trip-1",
      driverFee: 100,
      fuelBudget: 10,
      carGoFee: 7.7,
      driverAmountReleased: 0,
      driverAmountRemaining: 110,
      driverCompensationReleased: 0,
      driverCompensationRemaining: 100,
      releaseAccountingVersion: 2,
      customerPaymentAmount: 117.7,
    },
  };
  const driverBalances = { availableBalance: 20, totalEarned: 20 };
  const tripCounters: Record<string, { driverAmountReleased: number; driverAmountRemaining: number }> =
    Object.fromEntries(
      Object.entries(wallets).map(([tripId, wallet]) => [
        tripId,
        { driverAmountReleased: wallet.driverAmountReleased, driverAmountRemaining: wallet.driverAmountRemaining },
      ]),
    );
  let ledgerCreates = 0;

  const tx = {
    trip: {
      findUnique: jest.fn(async ({ where, select }: { where: { id: string }; select?: Record<string, boolean> }) => {
        if (select) {
          return {
            status: statuses[where.id],
            driverCompletionConfirmedById: "driver-user",
            customerCompletionConfirmedById: "customer-user",
          };
        }
        return {
          id: where.id,
          driverId: "driver-profile",
          status: statuses[where.id],
          driverFee: wallets[where.id]?.driverFee ?? 100,
          bookingAmount: wallets[where.id]?.customerPaymentAmount ?? 117.7,
          driverAmountReleased: tripCounters[where.id]?.driverAmountReleased ?? 0,
          driverAmountRemaining: tripCounters[where.id]?.driverAmountRemaining ?? 100,
        };
      }),
      updateMany: jest.fn(async ({ where, data }: { where: { id: string; status: TripStatus; driverAmountReleased: number }; data: { driverAmountReleased: number; driverAmountRemaining: number } }) => {
        if (options.releaseConflict || statuses[where.id] !== where.status ||
            (tripCounters[where.id]?.driverAmountReleased ?? 0) !== where.driverAmountReleased) {
          return { count: 0 };
        }
        tripCounters[where.id] = data;
        return { count: 1 };
      }),
    },
    tripWallet: {
      findUnique: jest.fn(async ({ where }: { where: { tripId?: string; id?: string } }) => {
        const stored = where.tripId ? wallets[where.tripId] : Object.values(wallets).find((item) => item.id === where.id);
        if (!stored) return null;
        return { ...stored, ...(tripCounters[stored.tripId] ?? {}) };
      }),
      updateMany: jest.fn(async ({ where, data }: {
        where: { id: string; driverCompensationReleased: number };
        data: Record<string, number>;
      }) => {
        const stored = Object.values(wallets).find((item) => item.id === where.id);
        if (options.releaseConflict || !stored ||
            (stored.driverCompensationReleased ?? stored.driverAmountReleased) !== where.driverCompensationReleased) return { count: 0 };
        Object.assign(stored, data);
        return { count: 1 };
      }),
    },
    driverWallet: {
      findUnique: jest.fn(async () => ({ id: "driver-wallet-1", driverId: "driver-profile", ...driverBalances })),
      create: jest.fn(),
      update: jest.fn(async ({ data }: { data: { availableBalance: { increment: number }; totalEarned: { increment: number } } }) => {
        driverBalances.availableBalance += data.availableBalance.increment;
        driverBalances.totalEarned += data.totalEarned.increment;
        return { id: "driver-wallet-1", driverId: "driver-profile", ...driverBalances };
      }),
    },
    walletTransaction: {
      create: jest.fn(async ({ data }: { data: { amount: number; type: WalletTransactionType } }) => {
        ledgerCreates += 1;
        if (options.ledgerFailure) throw new Error("ledger write failed");
        return { ...data };
      }),
    },
    payment: {
      findUnique: jest.fn(async ({ where }: { where: { tripId: string } }) => ({
        status: "CONFIRMED",
        amount: wallets[where.tripId]?.customerPaymentAmount ?? 117.7,
      })),
    },
    driver: {
      findUnique: jest.fn(async () => ({ verified: true, verificationStatus: "APPROVED" })),
    },
    dispute: {
      findUnique: jest.fn(async () => null),
    },
    refund: {
      findFirst: jest.fn(async () => null),
    },
  };

  (mockedPrisma.$transaction as jest.Mock).mockImplementation(async (callback: (client: typeof tx) => Promise<unknown>) => {
    const walletSnapshot = structuredClone(wallets);
    const balanceSnapshot = { ...driverBalances };
    const countersSnapshot = structuredClone(tripCounters);
    try {
      return await callback(tx);
    } catch (error) {
      if (options.ledgerFailure) {
        Object.assign(wallets, walletSnapshot);
        Object.assign(driverBalances, balanceSnapshot);
        Object.assign(tripCounters, countersSnapshot);
      }
      throw error;
    }
  });
  mockedGetDriver.mockResolvedValue({ id: "driver-profile", userId: "driver-user", verified: true, verificationStatus: "APPROVED" });
  mockedVerifyTrip.mockImplementation(async (tripId: string) => ({
    id: tripId,
    driverId: "driver-profile",
    status: statuses[tripId],
  }));

  return { tx, wallets, driverBalances, tripCounters, getLedgerCount: () => ledgerCreates };
}

describe("transaction-safe driver fund releases", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("preserves the initial and final payout amounts and records unique release keys", async () => {
    const initial = setupReleaseHarness();
    const initialResult = await releaseDriverFunds("trip-1", driverUser);
    expect(initialResult.amount).toBe(30);
    expect(initialResult.type).toBe(WalletTransactionType.DRIVER_FIRST_RELEASE);
    expect(initial.tx.walletTransaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        amount: 30,
        idempotencyKey: "driver-release:trip-1:DRIVER_FIRST_RELEASE",
        note: "First driver-fee installment: 30% of driver fee",
      }),
    });
    expect(initial.tx.driverWallet.update).toHaveBeenCalledWith({
      where: { id: "driver-wallet-1" },
      data: {
        availableBalance: { increment: 30 },
        totalEarned: { increment: 30 },
      },
    });

    const final = setupReleaseHarness({
      tripStatuses: { "trip-1": TripStatus.COMPLETED },
      tripWallets: {
        "trip-1": {
          id: "trip-wallet-1",
          tripId: "trip-1",
          driverFee: 100,
          fuelBudget: 10,
          carGoFee: 7.7,
          driverAmountReleased: 30,
          driverAmountRemaining: 70,
          driverCompensationReleased: 30,
          driverCompensationRemaining: 70,
          releaseAccountingVersion: 2,
          customerPaymentAmount: 117.7,
        },
      },
    });
    const finalResult = await releaseDriverFunds("trip-1", driverUser);
    expect(finalResult.amount).toBe(70);
    expect(finalResult.type).toBe(WalletTransactionType.DRIVER_FINAL_RELEASE);
    expect(final.tx.walletTransaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        amount: 70,
        idempotencyKey: "driver-release:trip-1:DRIVER_FINAL_RELEASE",
      }),
    });
  });

  it("uses a unique ledger key for the confirmed payment receipt", async () => {
    const payment = {
      id: "payment-1",
      amount: 500,
      status: "CONFIRMED",
      trip: {
        id: "trip-1",
        status: TripStatus.BOOKED,
        driverFee: 100,
        fuelBudget: 10,
        carGoFee: 20,
        driverAmountReleased: 0,
        driverAmountRemaining: 110,
      },
    };
    const tx = {
      payment: { findUnique: jest.fn().mockResolvedValue(payment) },
      tripWallet: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: "trip-wallet-1", tripId: "trip-1" }),
      },
      walletTransaction: {
        findFirst: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: "transaction-1" }),
      },
    };
    (mockedPrisma.$transaction as jest.Mock).mockImplementation(
      async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
    );

    await initializeTripWallet("payment-1");

    expect(tx.walletTransaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        paymentId: "payment-1",
        type: WalletTransactionType.PAYMENT_RECEIVED,
        idempotencyKey: "payment-received:payment-1",
      }),
    });
  });

  it("requires a confirmed payment before releasing funds", async () => {
    const harness = setupReleaseHarness();
    (harness.tx.payment.findUnique as jest.Mock).mockResolvedValue({
      status: "PENDING",
      amount: 117.7,
    });

    await expect(releaseDriverFunds("trip-1", driverUser)).rejects.toMatchObject({ statusCode: 400 });
    expect(harness.tx.driverWallet.update).not.toHaveBeenCalled();
    expect(harness.tx.walletTransaction.create).not.toHaveBeenCalled();
  });

  it("blocks releases from legacy mixed-accounting wallets", async () => {
    const harness = setupReleaseHarness({
      tripWallets: {
        "trip-1": {
          id: "trip-wallet-1",
          tripId: "trip-1",
          driverFee: 100,
          fuelBudget: 10,
          driverAmountReleased: 40,
          driverAmountRemaining: 70,
          driverCompensationReleased: 0,
          driverCompensationRemaining: 0,
          releaseAccountingVersion: 1,
          customerPaymentAmount: 117.7,
        },
      },
    });

    await expect(releaseDriverFunds("trip-1", driverUser)).rejects.toMatchObject({ statusCode: 409 });
    expect(harness.tx.driverWallet.update).not.toHaveBeenCalled();
    expect(harness.tx.walletTransaction.create).not.toHaveBeenCalled();
  });

  it.each([
    [TripStatus.TRIP_ACTIVE, 30],
    [TripStatus.COMPLETED, 100],
  ])("rejects a repeated %s release before crediting the wallet or ledger", async (status, released) => {
    const harness = setupReleaseHarness({
      tripStatuses: { "trip-1": status },
      tripWallets: {
        "trip-1": {
          id: "trip-wallet-1",
          tripId: "trip-1",
          driverFee: 100,
          fuelBudget: 10,
          driverAmountReleased: released,
          driverAmountRemaining: 100 - released,
          driverCompensationReleased: released,
          driverCompensationRemaining: 100 - released,
          releaseAccountingVersion: 2,
          customerPaymentAmount: 117.7,
        },
      },
      releaseConflict: true,
    });

    await expect(releaseDriverFunds("trip-1", driverUser)).rejects.toMatchObject({ statusCode: 409 });

    expect(harness.tx.driverWallet.update).not.toHaveBeenCalled();
    expect(harness.tx.walletTransaction.create).not.toHaveBeenCalled();
  });

  it("rejects stale concurrent release attempts with a conditional wallet update", async () => {
    const harness = setupReleaseHarness();
    const releases = await Promise.allSettled([
      releaseDriverFunds("trip-1", driverUser),
      releaseDriverFunds("trip-1", driverUser),
    ]);

    expect(releases.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(releases.filter((result) => result.status === "rejected")).toHaveLength(1);
    expect(harness.getLedgerCount()).toBe(1);
    expect(harness.driverBalances.availableBalance).toBe(50);
  });

  it("uses atomic increments so concurrent releases for different trips do not overwrite a shared driver balance", async () => {
    const harness = setupReleaseHarness({
      tripStatuses: {
        "trip-1": TripStatus.TRIP_ACTIVE,
        "trip-2": TripStatus.TRIP_ACTIVE,
      },
      tripWallets: {
        "trip-1": { id: "tw-1", tripId: "trip-1", driverFee: 100, fuelBudget: 10, carGoFee: 7.7, driverAmountReleased: 0, driverAmountRemaining: 100, driverCompensationReleased: 0, driverCompensationRemaining: 100, releaseAccountingVersion: 2, customerPaymentAmount: 117.7 },
        "trip-2": { id: "tw-2", tripId: "trip-2", driverFee: 200, fuelBudget: 20, carGoFee: 15.4, driverAmountReleased: 0, driverAmountRemaining: 200, driverCompensationReleased: 0, driverCompensationRemaining: 200, releaseAccountingVersion: 2, customerPaymentAmount: 235.4 },
      },
    });

    const results = await Promise.all([
      releaseDriverFunds("trip-1", driverUser),
      releaseDriverFunds("trip-2", driverUser),
    ]);

    expect(results.map((result) => result.amount).sort((a, b) => a - b)).toEqual([30, 60]);
    expect(harness.driverBalances.availableBalance).toBe(110);
    expect(harness.driverBalances.totalEarned).toBe(110);
  });

  it("propagates a ledger failure and rolls back wallet state in the transaction harness", async () => {
    const harness = setupReleaseHarness({ ledgerFailure: true });

    await expect(releaseDriverFunds("trip-1", driverUser)).rejects.toThrow("ledger write failed");

    expect(harness.wallets["trip-1"].driverAmountReleased).toBe(0);
    expect(harness.driverBalances.availableBalance).toBe(20);
    expect(harness.tripCounters["trip-1"]).toEqual({
      driverAmountReleased: 0,
      driverAmountRemaining: 110,
    });
  });
});
