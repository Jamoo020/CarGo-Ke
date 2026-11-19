import { PaymentStatus, TripStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { createTripPayment, resolveMockPaymentStatus } from "./paymentService";

jest.mock("../db", () => ({
  prisma: {
    payment: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    trip: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    transportRequest: {
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe("resolveMockPaymentStatus", () => {
  it("marks mock failures as failed", () => {
    expect(resolveMockPaymentStatus("mock_fail_123")).toBe(PaymentStatus.FAILED);
  });

  it("marks standard mock references as confirmed", () => {
    expect(resolveMockPaymentStatus("mock_123")).toBe(PaymentStatus.CONFIRMED);
    expect(resolveMockPaymentStatus("card_123")).toBe(PaymentStatus.CONFIRMED);
  });
});

describe("createTripPayment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the existing pending payment for the same trip instead of throwing a duplicate error", async () => {
    const trip = {
      id: "trip-1",
      customerId: "user-1",
      status: TripStatus.PAYMENT_PENDING,
      bookingAmount: 1000,
      transportRequest: { customerId: "user-1", authorizedRepresentativeId: null },
    };
    const existingPayment = {
      id: "payment-1",
      tripId: "trip-1",
      customerId: "user-1",
      amount: 1000,
      status: PaymentStatus.PENDING,
      providerReference: "provider-ref-1",
      trip,
    };

    (prisma.trip.findUnique as jest.Mock).mockResolvedValue(trip);
    (prisma.payment.findUnique as jest.Mock).mockResolvedValue(existingPayment);

    const result = await createTripPayment("trip-1", { providerReference: "provider-ref-2" }, {
      userId: "user-1",
      role: UserRole.CUSTOMER,
    });

    expect(result).toEqual(existingPayment);
  });
});
