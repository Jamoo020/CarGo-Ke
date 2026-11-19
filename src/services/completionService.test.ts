import { DisputeStatus, PaymentStatus, TripStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { verifyTripParticipation } from "./authorizationService";
import { releaseDriverFundsForTripStatus } from "./walletService";
import { confirmTripCompletion, confirmTripCompletionTx } from "./completionService";

jest.mock("../db", () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

jest.mock("./authorizationService", () => ({
  verifyTripParticipation: jest.fn(),
}));

jest.mock("./walletService", () => ({
  releaseDriverFundsForTripStatus: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedVerifyTrip = verifyTripParticipation as jest.Mock;
const mockedRelease = releaseDriverFundsForTripStatus as jest.Mock;
const driver = { userId: "driver-user", role: UserRole.DRIVER };
const customer = { userId: "customer-user", role: UserRole.CUSTOMER };

function setupCompletionHarness(options: {
  status?: TripStatus;
  paymentStatus?: PaymentStatus;
  disputeStatus?: DisputeStatus | null;
  hasDeliveryInspection?: boolean;
  failRelease?: boolean;
  driverConfirmationId?: string | null;
  customerConfirmationId?: string | null;
} = {}) {
  const state = {
    id: "trip-1",
    transportRequestId: "request-1",
    status: options.status ?? TripStatus.DELIVERED,
    bookingAmount: 23_540,
    driverCompletionConfirmedAt: options.driverConfirmationId ? new Date() : null as Date | null,
    driverCompletionConfirmedById: options.driverConfirmationId ?? null as string | null,
    customerCompletionConfirmedAt: options.customerConfirmationId ? new Date() : null as Date | null,
    customerCompletionConfirmedById: options.customerConfirmationId ?? null as string | null,
  };

  const tx = {
    trip: {
      findUnique: jest.fn(async ({ include }: { include?: unknown } = {}) => ({
        ...state,
        ...(include
          ? {
              transportRequest: { vehicleDetail: { make: "Toyota", model: "Corolla" } },
              customer: { fullName: "Customer" },
              driver: { user: { fullName: "Driver" } },
            }
          : {}),
      })),
      updateMany: jest.fn(async ({ where, data }: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
        for (const [field, condition] of Object.entries(where)) {
          const value = state[field as keyof typeof state];
          if (condition && typeof condition === "object" && "not" in condition) {
            if (value === condition.not) return { count: 0 };
          } else if (condition !== value) {
            return { count: 0 };
          }
        }
        Object.assign(state, data);
        return { count: 1 };
      }),
    },
    inspection: {
      findUnique: jest.fn(async () => (options.hasDeliveryInspection === false ? null : { id: "delivery-inspection" })),
    },
    dispute: {
      findUnique: jest.fn(async () => options.disputeStatus ? { status: options.disputeStatus } : null),
    },
    refund: {
      findFirst: jest.fn(async () => null),
    },
    payment: {
      findUnique: jest.fn(async () => ({ status: options.paymentStatus ?? PaymentStatus.CONFIRMED, amount: 23_540 })),
    },
    tripWallet: {
      findUnique: jest.fn(async () => ({ releaseAccountingVersion: 2, fuelAccountingStatus: "RESTRICTED" })),
    },
    transportRequest: {
      update: jest.fn(async () => ({})),
    },
  };

  mockedVerifyTrip.mockImplementation(async () => ({ ...state }));
  mockedRelease.mockImplementation(async () => {
    if (options.failRelease) throw new Error("release failed");
  });

  return { state, tx };
}

describe("independent trip completion confirmations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("records the first confirmation without completing the trip or releasing the final installment", async () => {
    const harness = setupCompletionHarness();

    const result = await confirmTripCompletionTx(harness.tx as never, "trip-1", driver);

    expect(result.status).toBe(TripStatus.DELIVERED);
    expect(result.transportRequest).toEqual({
      vehicleDetail: { make: "Toyota", model: "Corolla" },
    });
    expect(harness.state.driverCompletionConfirmedById).toBe(driver.userId);
    expect(harness.state.customerCompletionConfirmedById).toBeNull();
    expect(mockedRelease).not.toHaveBeenCalled();
  });

  it("completes and releases once both different parties confirm", async () => {
    const harness = setupCompletionHarness();

    await confirmTripCompletionTx(harness.tx as never, "trip-1", driver);
    const result = await confirmTripCompletionTx(harness.tx as never, "trip-1", customer);

    expect(result.status).toBe(TripStatus.COMPLETED);
    expect(harness.state.driverCompletionConfirmedById).toBe(driver.userId);
    expect(harness.state.customerCompletionConfirmedById).toBe(customer.userId);
    expect(harness.tx.transportRequest.update).toHaveBeenCalledWith({
      where: { id: "request-1" },
      data: { status: TripStatus.COMPLETED },
    });
    expect(mockedRelease).toHaveBeenCalledTimes(1);
    expect(mockedRelease.mock.calls[0][1]).toMatchObject({ status: TripStatus.COMPLETED });
  });

  it("does not let one user satisfy both party confirmations", async () => {
    const harness = setupCompletionHarness();
    await confirmTripCompletionTx(harness.tx as never, "trip-1", driver);

    await expect(
      confirmTripCompletionTx(harness.tx as never, "trip-1", { ...customer, userId: driver.userId }),
    ).rejects.toMatchObject({ statusCode: 403 });
    expect(mockedRelease).not.toHaveBeenCalled();
  });

  it.each([
    ["cancelled", { status: TripStatus.CANCELLED }],
    ["unpaid", { paymentStatus: PaymentStatus.PENDING }],
    ["active dispute", { disputeStatus: DisputeStatus.OPEN }],
    ["under-review dispute", { disputeStatus: DisputeStatus.UNDER_REVIEW }],
    ["missing delivery inspection", { hasDeliveryInspection: false }],
  ])("blocks completion when the trip is %s", async (_label, options) => {
    const harness = setupCompletionHarness(options);

    await expect(
      confirmTripCompletionTx(harness.tx as never, "trip-1", driver),
    ).rejects.toBeTruthy();
    expect(mockedRelease).not.toHaveBeenCalled();
  });

  it("rolls back a confirmation if the final release transaction fails", async () => {
    const harness = setupCompletionHarness({
      failRelease: true,
      driverConfirmationId: driver.userId,
    });
    (mockedPrisma.$transaction as jest.Mock).mockImplementation(async (callback: (tx: typeof harness.tx) => Promise<unknown>) => {
      const originalState = { ...harness.state };
      try {
        return await callback(harness.tx);
      } catch (error) {
        Object.assign(harness.state, originalState);
        throw error;
      }
    });

    await expect(confirmTripCompletion("trip-1", customer)).rejects.toThrow("release failed");
    expect(harness.state.status).toBe(TripStatus.DELIVERED);
    expect(harness.state.customerCompletionConfirmedById).toBeNull();
  });
});
