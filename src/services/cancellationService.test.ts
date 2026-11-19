import { TripStatus, UserRole } from "@prisma/client";
import { cancelTrip } from "./cancellationService";
import { verifyTripParticipation } from "./authorizationService";

jest.mock("./authorizationService", () => ({
  verifyTripParticipation: jest.fn(),
}));

const mockedVerifyTrip = verifyTripParticipation as jest.Mock;

function createTransaction(updateCount: number, payment: object | null = null) {
  return {
    payment: { findUnique: jest.fn().mockResolvedValue(payment) },
    cancellation: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({ id: "cancel-1" }),
    },
    trip: { updateMany: jest.fn().mockResolvedValue({ count: updateCount }) },
    transportRequest: { update: jest.fn().mockResolvedValue({}) },
  };
}

describe("concurrent cancellation status guard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedVerifyTrip.mockResolvedValue({
      id: "trip-1",
      transportRequestId: "request-1",
      status: TripStatus.BOOKED,
      customerId: "customer-1",
    });
  });

  it("rejects a stale cancellation without recording cancellation or updating its request", async () => {
    const tx = createTransaction(0);

    await expect(
      cancelTrip("trip-1", { reason: "Changed plans" }, { userId: "customer-1", role: UserRole.CUSTOMER }, tx as never),
    ).rejects.toMatchObject({ statusCode: 409 });

    expect(tx.trip.updateMany).toHaveBeenCalledWith({
      where: { id: "trip-1", status: TripStatus.BOOKED },
      data: { status: TripStatus.CANCELLED, refundAmount: 0 },
    });
    expect(tx.cancellation.create).not.toHaveBeenCalled();
    expect(tx.transportRequest.update).not.toHaveBeenCalled();
  });

  it("records cancellation and updates the request after its status compare-and-set succeeds", async () => {
    const tx = createTransaction(1);

    await cancelTrip(
      "trip-1",
      { reason: "Changed plans" },
      { userId: "customer-1", role: UserRole.CUSTOMER },
      tx as never,
    );

    expect(tx.cancellation.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tripId: "trip-1",
        statusBefore: TripStatus.BOOKED,
        statusAfter: TripStatus.CANCELLED,
      }),
    });
    expect(tx.transportRequest.update).toHaveBeenCalledWith({
      where: { id: "request-1" },
      data: { status: TripStatus.CANCELLED },
    });

  });

  it("does not imply a refund when cancelling a trip with a confirmed payment", async () => {
    const confirmedPayment = {
      id: "payment-1",
      status: "CONFIRMED",
      amount: 1000,
    };
    const tx = createTransaction(1, confirmedPayment);

    await cancelTrip(
      "trip-1",
      { reason: "Customer cancellation" },
      { userId: "customer-1", role: UserRole.CUSTOMER },
      tx as never,
    );

    expect(tx.payment.findUnique).toHaveBeenCalledWith({ where: { tripId: "trip-1" } });
    expect(tx.cancellation.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ refundAmount: 0 }),
    });
    expect(tx.trip.updateMany).toHaveBeenCalledWith({
      where: { id: "trip-1", status: TripStatus.BOOKED },
      data: { status: TripStatus.CANCELLED, refundAmount: 0 },
    });
  });
});
