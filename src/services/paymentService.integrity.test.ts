import { PaymentStatus, TripStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { createTripPayment, processProviderPaymentCallback } from "./paymentService";

jest.mock("../db", () => ({
  prisma: {
    trip: { findUnique: jest.fn(), updateMany: jest.fn() },
    payment: { findUnique: jest.fn(), create: jest.fn(), updateMany: jest.fn() },
    transportRequest: { update: jest.fn() },
    $transaction: jest.fn(),
  },
}));

jest.mock("../config", () => ({
  config: {
    environment: "test",
    paymentMode: "live",
    paymentProviderCurrency: "KES",
  },
}));

jest.mock("./walletService", () => ({
  initializeTripWalletTx: jest.fn().mockResolvedValue({ id: "wallet-1" }),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const customer = { userId: "customer-1", role: UserRole.CUSTOMER };

type CallbackTestPayment = {
  id: string;
  tripId: string;
  customerId: string;
  amount: number;
  status: PaymentStatus;
  providerReference: string;
  providerCallbackReference: string | null;
  trip: {
    id: string;
    transportRequestId: string;
    status: TripStatus;
    bookingAmount: number;
  };
};

function createPendingPayment(
  overrides: Partial<Omit<CallbackTestPayment, "trip">> & { trip?: Partial<CallbackTestPayment["trip"]> } = {},
): CallbackTestPayment {
  const { trip: tripOverrides, ...paymentOverrides } = overrides;
  return {
    id: "payment-1",
    tripId: "trip-1",
    customerId: "customer-1",
    amount: 1250,
    status: PaymentStatus.PENDING,
    providerReference: "provider-ref-1",
    providerCallbackReference: null,
    ...paymentOverrides,
    trip: {
      id: "trip-1",
      transportRequestId: "request-1",
      status: TripStatus.PAYMENT_PENDING,
      bookingAmount: 1250,
      ...tripOverrides,
    },
  };
}

function setupCallbackTransaction(payment = createPendingPayment()) {
  let currentPayment: CallbackTestPayment = payment;
  let currentTripStatus = payment.trip.status;
  const tx = {
    payment: {
      updateMany: jest.fn(async ({ where, data }: { where: { id: string; status: PaymentStatus }; data: { status: PaymentStatus } }) => {
        if (where.id !== currentPayment.id || where.status !== currentPayment.status) return { count: 0 };
        currentPayment = { ...currentPayment, ...data };
        return { count: 1 };
      }),
      findUnique: jest.fn(async () => ({ ...currentPayment, trip: { ...currentPayment.trip, status: currentTripStatus } })),
    },
    trip: {
      updateMany: jest.fn(async ({ where, data }: { where: { id: string; status: TripStatus }; data: { status: TripStatus } }) => {
        if (where.id !== currentPayment.tripId || where.status !== currentTripStatus) return { count: 0 };
        currentTripStatus = data.status;
        return { count: 1 };
      }),
    },
    transportRequest: { update: jest.fn().mockResolvedValue({}) },
  };
  (mockedPrisma.$transaction as jest.Mock).mockImplementation(
    async (callback: (client: typeof tx) => Promise<unknown>) => callback(tx),
  );
  return { tx, getPayment: () => currentPayment, getTripStatus: () => currentTripStatus };
}

describe("provider payment callbacks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("keeps live-mode payment creation pending until provider confirmation", async () => {
    (mockedPrisma.trip.findUnique as jest.Mock).mockResolvedValue({
      id: "trip-1",
      customerId: "customer-1",
      status: TripStatus.PAYMENT_PENDING,
      bookingAmount: 1250,
      transportRequest: { customerId: "customer-1", authorizedRepresentativeId: null },
    });
    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(null);
    (mockedPrisma.payment.create as jest.Mock).mockResolvedValue({
      id: "payment-1",
      tripId: "trip-1",
      amount: 1250,
      status: PaymentStatus.PENDING,
      providerReference: "merchant-reference",
    });

    const result = await createTripPayment(
      "trip-1",
      { providerReference: "merchant-reference" },
      customer,
    );

    expect(result.status).toBe(PaymentStatus.PENDING);
    expect(mockedPrisma.payment.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        status: PaymentStatus.PENDING,
        providerReference: "merchant-reference",
      }),
    });
    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it("confirms a payment once and initializes the wallet in the same transaction", async () => {
    const initialPayment = createPendingPayment();
    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(initialPayment);
    const harness = setupCallbackTransaction(initialPayment);

    const result = await processProviderPaymentCallback({
      providerReference: "provider-ref-1",
      amount: 1250,
      currency: "KES",
      status: "paid",
      providerCallbackReference: "callback-1",
      paymentId: "payment-1",
      tripId: "trip-1",
    });

    expect(result.status).toBe(PaymentStatus.CONFIRMED);
    expect(harness.getTripStatus()).toBe(TripStatus.BOOKED);
    expect(harness.tx.trip.updateMany).toHaveBeenCalledWith({
      where: { id: "trip-1", status: TripStatus.PAYMENT_PENDING },
      data: { status: TripStatus.BOOKED },
    });
    expect(harness.tx.transportRequest.update).toHaveBeenCalledWith({
      where: { id: "request-1" },
      data: { status: TripStatus.BOOKED },
    });
  });

  it("records a valid provider failure without creating wallet side effects", async () => {
    const initialPayment = createPendingPayment();
    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(initialPayment);
    const harness = setupCallbackTransaction(initialPayment);

    const result = await processProviderPaymentCallback({
      providerReference: "provider-ref-1",
      amount: 1250,
      currency: "KES",
      status: "declined",
      providerCallbackReference: "callback-failed-1",
    });

    expect(result.status).toBe(PaymentStatus.FAILED);
    expect(harness.tx.trip.updateMany).not.toHaveBeenCalled();
    expect(harness.tx.transportRequest.update).not.toHaveBeenCalled();
  });

  it("treats an identical confirmed callback as idempotent", async () => {
    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(
      createPendingPayment({
        status: PaymentStatus.CONFIRMED,
        trip: { status: TripStatus.BOOKED },
      }),
    );

    const result = await processProviderPaymentCallback({
      providerReference: "provider-ref-1",
      amount: 1250,
      currency: "KES",
      status: "success",
    });

    expect(result.status).toBe(PaymentStatus.CONFIRMED);
    expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
  });

  it("serializes concurrent duplicate confirmation callbacks without repeating state changes", async () => {
    const initialPayment = createPendingPayment();
    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(initialPayment);
    const harness = setupCallbackTransaction(initialPayment);
    const callback = {
      providerReference: "provider-ref-1",
      amount: 1250,
      currency: "KES",
      status: "paid",
      providerCallbackReference: "callback-1",
    };

    const [first, second] = await Promise.all([
      processProviderPaymentCallback(callback),
      processProviderPaymentCallback(callback),
    ]);

    expect(first.status).toBe(PaymentStatus.CONFIRMED);
    expect(second.status).toBe(PaymentStatus.CONFIRMED);
    expect(harness.tx.payment.updateMany).toHaveBeenCalledTimes(2);
    expect(harness.tx.trip.updateMany).toHaveBeenCalledTimes(1);
  });

  it("rejects a duplicate confirmed payment whose trip state is inconsistent", async () => {
    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(
      createPendingPayment({
        status: PaymentStatus.CONFIRMED,
        trip: { status: TripStatus.PAYMENT_PENDING },
      }),
    );

    await expect(processProviderPaymentCallback({
      providerReference: "provider-ref-1",
      amount: 1250,
      currency: "KES",
      status: "paid",
    })).rejects.toMatchObject({ statusCode: 409 });
  });

  it.each([
    ["currency", { currency: "USD" }],
    ["amount", { amount: 1 }],
    ["reference", { providerReference: "another-reference" }],
  ])("rejects a callback with an incorrect %s", async (_kind, override) => {
    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(createPendingPayment());

    await expect(processProviderPaymentCallback({
      providerReference: "provider-ref-1",
      amount: 1250,
      currency: "KES",
      status: "paid",
      ...override,
    })).rejects.toMatchObject({ statusCode: 400 });
  });

  it("rejects incorrect currency and amount before changing payment or trip records", async () => {
    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(createPendingPayment());
    const harness = setupCallbackTransaction();

    await expect(processProviderPaymentCallback({
      providerReference: "provider-ref-1",
      amount: 1250,
      currency: "USD",
      status: "paid",
    })).rejects.toMatchObject({ statusCode: 400 });
    await expect(processProviderPaymentCallback({
      providerReference: "provider-ref-1",
      amount: 1200,
      currency: "KES",
      status: "paid",
    })).rejects.toMatchObject({ statusCode: 400 });

    expect(harness.tx.payment.updateMany).not.toHaveBeenCalled();
    expect(harness.tx.trip.updateMany).not.toHaveBeenCalled();
  });

  it("requires an exact known provider reference and rejects mismatched identity claims", async () => {
    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(createPendingPayment());

    await expect(processProviderPaymentCallback({
      providerReference: "provider-ref-1",
      amount: 1250,
      currency: "KES",
      status: "paid",
      paymentId: "other-payment",
    })).rejects.toMatchObject({ statusCode: 400 });
    expect(mockedPrisma.payment.findUnique).toHaveBeenCalledWith({
      where: { providerReference: "provider-ref-1" },
      include: { trip: true },
    });
  });

  it("rejects malformed callbacks and out-of-order status changes", async () => {
    await expect(processProviderPaymentCallback({} as never)).rejects.toMatchObject({ statusCode: 400 });

    (mockedPrisma.payment.findUnique as jest.Mock).mockResolvedValue(
      createPendingPayment({
        status: PaymentStatus.CONFIRMED,
        trip: { status: TripStatus.BOOKED },
      }),
    );
    await expect(processProviderPaymentCallback({
      providerReference: "provider-ref-1",
      amount: 1250,
      currency: "KES",
      status: "failed",
    })).rejects.toMatchObject({ statusCode: 400 });
  });
});
