import { TripStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { releaseDriverFundsForTripStatus } from "./walletService";
import { verifyTripParticipation } from "./authorizationService";
import { transitionTripStatus } from "./tripService";

jest.mock("../db", () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

jest.mock("./authorizationService", () => ({
  verifyTripParticipation: jest.fn(),
  getDriverForCurrentUser: jest.fn(),
}));

jest.mock("./walletService", () => ({
  releaseDriverFundsForTripStatus: jest.fn(),
}));

jest.mock("./cancellationService", () => ({
  cancelTrip: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedVerifyTrip = verifyTripParticipation as jest.Mock;
const mockedRelease = releaseDriverFundsForTripStatus as jest.Mock;
const admin = { userId: "admin-user", role: UserRole.ADMIN };

function transactionHarness(initialStatus: TripStatus, conflict = false) {
  let currentStatus = initialStatus;
  let currentReleased = 0;
  const tx = {
    trip: {
      updateMany: jest.fn(async ({ where, data }: { where: { id: string; status: TripStatus }; data: { status: TripStatus } }) => {
        if (conflict || where.status !== currentStatus) return { count: 0 };
        currentStatus = data.status;
        return { count: 1 };
      }),
      findUnique: jest.fn(async () => ({
        id: "trip-1",
        transportRequestId: "request-1",
        driverId: "driver-profile",
        status: currentStatus,
        driverFee: 100,
        driverAmountReleased: currentReleased,
        driverAmountRemaining: 100,
      })),
    },
    transportRequest: { update: jest.fn().mockResolvedValue({}) },
    inspection: { findUnique: jest.fn().mockResolvedValue({ id: "inspection-1" }) },
  };
  (mockedPrisma.$transaction as jest.Mock).mockImplementation(
    async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
  );
  mockedVerifyTrip.mockResolvedValue({
    id: "trip-1",
    transportRequestId: "request-1",
    status: initialStatus,
    driverId: "driver-profile",
    customerId: "customer-1",
  });
  return { tx, getCurrentStatus: () => currentStatus };
}

describe("concurrent trip transitions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("applies only one of two incompatible transitions from the same prior state", async () => {
    const harness = transactionHarness(TripStatus.BOOKED);

    const results = await Promise.allSettled([
      transitionTripStatus("trip-1", "beginPickup", admin),
      transitionTripStatus("trip-1", "disputeTrip", admin),
    ]);

    expect(results.filter((result) => result.status === "fulfilled")).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected")).toHaveLength(1);
    expect(harness.getCurrentStatus()).not.toBe(TripStatus.BOOKED);
    expect(harness.tx.trip.updateMany).toHaveBeenCalledWith({
      where: { id: "trip-1", status: TripStatus.BOOKED },
      data: { status: expect.any(String) },
    });
    expect(harness.tx.transportRequest.update).toHaveBeenCalledTimes(1);
    expect(mockedRelease).not.toHaveBeenCalled();
  });

  it("does not release funds when an activation transition loses its status compare-and-set", async () => {
    const harness = transactionHarness(TripStatus.TRIP_START_PENDING, true);

    await expect(
      transitionTripStatus("trip-1", "activateTrip", admin),
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(harness.tx.transportRequest.update).not.toHaveBeenCalled();
    expect(mockedRelease).not.toHaveBeenCalled();
  });

  it("preserves a valid activation transition and triggers the existing first-release path", async () => {
    const harness = transactionHarness(TripStatus.TRIP_START_PENDING);

    const trip = await transitionTripStatus("trip-1", "activateTrip", admin);

    expect(trip).toMatchObject({ status: TripStatus.TRIP_ACTIVE });
    expect(harness.tx.trip.updateMany).toHaveBeenCalledWith({
      where: { id: "trip-1", status: TripStatus.TRIP_START_PENDING },
      data: { status: TripStatus.TRIP_ACTIVE },
    });
    expect(mockedRelease).toHaveBeenCalledWith(
      harness.tx,
      expect.objectContaining({ id: "trip-1", status: TripStatus.TRIP_ACTIVE }),
    );
  });
});
