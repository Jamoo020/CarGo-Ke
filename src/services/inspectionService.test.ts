import { InspectionType, TripStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { getDriverForCurrentUser, verifyTripParticipation } from "./authorizationService";
import { createTripInspection } from "./inspectionService";
import { transitionTripStatus } from "./tripService";

jest.mock("../db", () => ({
  prisma: {
    $transaction: jest.fn(),
    inspection: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("./authorizationService", () => ({
  getDriverForCurrentUser: jest.fn(),
  verifyTripParticipation: jest.fn(),
}));

jest.mock("./tripService", () => ({
  transitionTripStatus: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedGetDriver = getDriverForCurrentUser as jest.Mock;
const mockedVerifyTrip = verifyTripParticipation as jest.Mock;
const mockedTransitionTrip = transitionTripStatus as jest.Mock;

describe("createTripInspection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.inspection.findUnique as jest.Mock).mockResolvedValue(null);
  });

  it("runs the pickup transition in the transaction that created the inspection", async () => {
    const tripId = "trip-1";
    const driver = { userId: "driver-user", role: UserRole.DRIVER };
    const transaction = {
      inspection: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ id: "inspection-1" }),
      },
    };

    mockedVerifyTrip.mockResolvedValue({
      id: tripId,
      driverId: "driver-profile",
      status: TripStatus.PICKUP_PENDING,
    });
    mockedGetDriver.mockResolvedValue({ id: "driver-profile" });
    (mockedPrisma.$transaction as jest.Mock).mockImplementation(
      async (callback: (tx: typeof transaction) => Promise<unknown>) => callback(transaction),
    );

    await createTripInspection(
      tripId,
      {
        type: InspectionType.PICKUP,
        photoUrls: [`/api/trips/${tripId}/inspections/photos/photo.jpg`],
        odometer: 100,
        vehicleCondition: "Good",
        handoverConfirmed: true,
      },
      driver,
    );

    expect(mockedTransitionTrip).toHaveBeenCalledWith(
      tripId,
      "completePickupInspection",
      driver,
      undefined,
      transaction,
    );
  });
});
