import { PaymentStatus, TripStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { confirmTripPayment } from "./paymentService";

jest.mock("../db", () => ({
  prisma: {
    payment: { findUnique: jest.fn() },
    trip: { findUnique: jest.fn() },
    $transaction: jest.fn(),
  },
}));

jest.mock("../config", () => ({
  config: {
    environment: "development",
    paymentMode: "mock",
    paymentProviderCurrency: "KES",
  },
}));
jest.mock("./walletService", () => ({
  initializeTripWalletTx: jest.fn(),
}));

describe("explicit non-production payment simulation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows an authorized customer to use manual confirmation only in mock mode", async () => {
    const trip = {
      id: "trip-1",
      customerId: "customer-1",
      status: TripStatus.PAYMENT_PENDING,
      transportRequestId: "request-1",
      transportRequest: {
        customerId: "customer-1",
        authorizedRepresentativeId: null,
      },
    };
    const confirmedPayment = {
      id: "payment-1",
      tripId: "trip-1",
      status: PaymentStatus.CONFIRMED,
      trip: { ...trip, status: TripStatus.BOOKED },
    };
    const tx = {
      payment: {
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        findUnique: jest.fn().mockResolvedValue(confirmedPayment),
      },
      trip: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
      transportRequest: { update: jest.fn().mockResolvedValue({}) },
    };
    (prisma.payment.findUnique as jest.Mock).mockResolvedValue({
      id: "payment-1",
      tripId: "trip-1",
      status: PaymentStatus.PENDING,
      trip,
    });
    (prisma.trip.findUnique as jest.Mock).mockResolvedValue(trip);
    (prisma.$transaction as jest.Mock).mockImplementation((callback) => callback(tx));

    await expect(
      confirmTripPayment("payment-1", {}, {
        userId: "customer-1",
        role: UserRole.CUSTOMER,
      }),
    ).resolves.toMatchObject({ status: PaymentStatus.CONFIRMED });

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.payment.updateMany).toHaveBeenCalledTimes(1);
  });
});
