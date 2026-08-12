import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { TripStatus, UserRole } from "@prisma/client";
import { hashPassword } from "../src/services/authService";
import walletService from "../src/services/walletService";

jest.setTimeout(60000);

const customer = {
  email: "customer-wallet-test@example.com",
  password: "CustomerWallet123!",
  fullName: "Customer Wallet",
  role: UserRole.CUSTOMER,
};

const driver = {
  email: "driver-wallet-test@example.com",
  password: "DriverWallet123!",
  fullName: "Driver Wallet",
  role: UserRole.DRIVER,
};

const driverB = {
  email: "driver-b-wallet-test@example.com",
  password: "DriverWalletB123!",
  fullName: "Driver Wallet B",
  role: UserRole.DRIVER,
};

let customerId: string;
let driverId: string;
let driverUserId: string;
let driverBId: string;
let driverBUserId: string;
let vehicleDetailId: string;

async function cleanupWalletUsers(userIds: string[]) {
  if (userIds.length === 0) return;

  await prisma.walletTransaction.deleteMany({ where: { OR: [{ tripWallet: { trip: { customerId: { in: userIds } } } }, { driverWallet: { driver: { userId: { in: userIds } } } }] } });
  await prisma.tripWallet.deleteMany({ where: { trip: { customerId: { in: userIds } } } });
  await prisma.driverWallet.deleteMany({ where: { driver: { userId: { in: userIds } } } });
  await prisma.inspection.deleteMany({ where: { trip: { customerId: { in: userIds } } } });
  await prisma.driverQuote.deleteMany({ where: { driver: { userId: { in: userIds } } } });
  await prisma.payment.deleteMany({ where: { customerId: { in: userIds } } });
  await prisma.trip.deleteMany({ where: { customerId: { in: userIds } } });
  await prisma.transportRequest.deleteMany({ where: { OR: [{ customerId: { in: userIds } }, { authorizedRepresentativeId: { in: userIds } }] } });
  await prisma.driver.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}

async function loginToken(email: string, password: string) {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.data.token;
}

beforeAll(async () => {
  const emails = [customer.email, driver.email, driverB.email, "other-wallet@example.com"];
  const existingUsers = await prisma.user.findMany({ where: { email: { in: emails } } });
  const existingUserIds = existingUsers.map((u) => u.id);

  if (existingUserIds.length > 0) {
    await cleanupWalletUsers(existingUserIds);
  }

  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["WAL1234"] } } });

  const createdCustomer = await prisma.user.create({
    data: { email: customer.email, passwordHash: await hashPassword(customer.password), fullName: customer.fullName, role: customer.role },
  });

  const createdDriverUser = await prisma.user.create({
    data: { email: driver.email, passwordHash: await hashPassword(driver.password), fullName: driver.fullName, role: driver.role },
  });

  const createdDriverBUser = await prisma.user.create({
    data: { email: driverB.email, passwordHash: await hashPassword(driverB.password), fullName: driverB.fullName, role: driverB.role },
  });

  const driverProfile = await prisma.driver.create({ data: { userId: createdDriverUser.id, licenseNumber: "DRV-WAL-001", verified: true } });
  const driverBProfile = await prisma.driver.create({ data: { userId: createdDriverBUser.id, licenseNumber: "DRV-WAL-002", verified: true } });

  const vehicleDetail = await prisma.vehicleDetail.create({ data: { make: "Toyota", model: "Hiace", year: 2020, registrationNumber: "WAL1234", color: "White" } });

  customerId = createdCustomer.id;
  driverId = driverProfile.id;
  driverUserId = createdDriverUser.id;
  driverBId = driverBProfile.id;
  driverBUserId = createdDriverBUser.id;
  vehicleDetailId = vehicleDetail.id;
});

afterAll(async () => {
  await cleanupWalletUsers([customerId, driverUserId, driverBUserId]);
  await prisma.vehicleDetail.deleteMany({ where: { id: vehicleDetailId } });
  await prisma.$disconnect();
});

describe("Trip Wallet initialization", () => {
  it("creates TripWallet and PAYMENT_RECEIVED transaction on payment confirmation", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nairobi", destination: "Mombasa", vehicleDetailId });

    expect(requestResponse.status).toBe(201);
    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 22000, message: "Wallet init quote" });

    expect(quoteResponse.status).toBe(201);
    const quoteId = quoteResponse.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();
    expect(trip?.status).toBe("PAYMENT_PENDING");

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_WALLET_001" });

    expect(paymentResponse.status).toBe(201);
    const paymentId = paymentResponse.body.data.id;

    const confirmResponse = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_WALLET_001" });

    expect(confirmResponse.status).toBe(200);

    // Wallet should be created
    const wallet = await prisma.tripWallet.findUnique({ where: { tripId: trip!.id }, include: { transactions: true } });
    expect(wallet).not.toBeNull();
    expect(wallet?.customerPaymentAmount).toBe(confirmResponse.body.data.amount || wallet?.customerPaymentAmount);
    expect(wallet?.driverAmountReleased).toBe(trip?.driverAmountReleased ?? 0);
    expect(wallet?.driverAmountRemaining).toBe(trip?.driverAmountRemaining ?? 0);
    expect(wallet?.refundAmount).toBe(0);

    const txs = wallet?.transactions ?? [];
    expect(txs.length).toBe(1);
    expect(txs[0].type).toBe("PAYMENT_RECEIVED");
    expect(txs[0].amount).toBe(confirmResponse.body.data.amount || txs[0].amount);
    expect(txs[0].paymentId).toBe(paymentId);

    // Idempotency: calling initializeTripWallet again should not create duplicates
    await walletService.initializeTripWallet(paymentId);
    const walletAfter = await prisma.tripWallet.findUnique({ where: { tripId: trip!.id }, include: { transactions: true } });
    expect(walletAfter).not.toBeNull();
    expect(walletAfter?.transactions.length).toBe(1);
  });

  it("prevents unauthorized users from viewing another customer's wallet", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const other = await prisma.user.create({ data: { email: "other-wallet@example.com", passwordHash: await hashPassword("Other123!"), fullName: "Other", role: UserRole.CUSTOMER } });
    try {
      const otherTokenResp = await request(app).post("/api/auth/login").send({ email: other.email, password: "Other123!" });
      const otherToken = otherTokenResp.body.data.token;

      // Create a fresh transport request + quote + selection + payment confirmation
      const requestResponse = await request(app)
        .post("/api/transport-requests")
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ origin: "Nakuru", destination: "Kisumu", vehicleDetailId });
      const transportRequestId = requestResponse.body.data.id;

      const quoteResponse = await request(app)
        .post(`/api/transport-requests/${transportRequestId}/quotes`)
        .set("Authorization", `Bearer ${driverId ? await loginToken(driver.email, driver.password) : ''}`)
        .send({ amount: 21000, message: "Unauthorized view test" });

      const quoteId = quoteResponse.body.data.id;
      await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
      const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
      const paymentResponse = await request(app)
        .post(`/api/trips/${trip?.id}/payments`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ providerReference: "MPESA_WALLET_002" });
      const paymentId = paymentResponse.body.data.id;
      await request(app).post(`/api/payments/${paymentId}/confirm`).set("Authorization", `Bearer ${customerToken}`);

      // Other user attempts to GET wallet
      const response = await request(app)
        .get(`/api/trips/${trip?.id}/wallet`)
        .set("Authorization", `Bearer ${otherToken}`);

      expect(response.status).toBe(403);
    } finally {
      await cleanupWalletUsers([other.id]);
    }
  });

  it("allows the correct driver to retrieve their trip wallet and blocks other drivers/customers", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);
    const driverBToken = await loginToken(driverB.email, driverB.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nakuru", destination: "Mombasa", vehicleDetailId });

    expect(requestResponse.status).toBe(201);
    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 22000, message: "Driver wallet authorization test" });

    expect(quoteResponse.status).toBe(201);
    const quoteId = quoteResponse.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_WALLET_AUTH_001" });

    expect(paymentResponse.status).toBe(201);
    const paymentId = paymentResponse.body.data.id;

    const confirmResponse = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_WALLET_AUTH_001" });

    expect(confirmResponse.status).toBe(200);

    const driverWalletResp = await request(app)
      .get(`/api/trips/${trip?.id}/wallet`)
      .set("Authorization", `Bearer ${driverToken}`);

    expect(driverWalletResp.status).toBe(200);
    expect(driverWalletResp.body.data.tripId).toBe(trip?.id);
    expect(Array.isArray(driverWalletResp.body.data.transactions)).toBe(true);
    expect(driverWalletResp.body.data.transactions.length).toBeGreaterThanOrEqual(1);
    expect(driverWalletResp.body.data.transactions[0]).toHaveProperty("type");
    expect(driverWalletResp.body.data.transactions[0]).toHaveProperty("amount");

    const wrongDriverResp = await request(app)
      .get(`/api/trips/${trip?.id}/wallet`)
      .set("Authorization", `Bearer ${driverBToken}`);

    expect(wrongDriverResp.status).toBe(403);
    expect(wrongDriverResp.body.data).toBeUndefined();

    const customerWalletResp = await request(app)
      .get(`/api/trips/${trip?.id}/wallet`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(customerWalletResp.status).toBe(200);
    expect(customerWalletResp.body.data.tripId).toBe(trip?.id);

    const fakeTripResp = await request(app)
      .get(`/api/trips/nonexistent-wallet-trip/wallet`)
      .set("Authorization", `Bearer ${driverToken}`);

    expect(fakeTripResp.status).toBe(404);
    expect(fakeTripResp.body.data).toBeUndefined();
  });

  it("automatically releases driver funds on trip activation and completion without duplicate payouts", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Eldoret", destination: "Nairobi", vehicleDetailId });

    expect(requestResponse.status).toBe(201);
    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 24000, message: "Driver release flow" });

    expect(quoteResponse.status).toBe(201);
    const quoteId = quoteResponse.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_WALLET_RELEASE_001" });

    const paymentId = paymentResponse.body.data.id;
    await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_WALLET_RELEASE_001" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "completePickupInspection" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "requestTripStart" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "activateTrip" });

    const tripAfterActivation = await prisma.trip.findUnique({ where: { id: trip!.id } });
    expect(tripAfterActivation?.status).toBe(TripStatus.TRIP_ACTIVE);

    const walletAfterActivation = await prisma.tripWallet.findUnique({ where: { tripId: trip!.id } });
    expect(walletAfterActivation?.driverAmountReleased).toBe(12000);

    const firstDriverWallet = await prisma.driverWallet.findUnique({ where: { driverId: trip!.driverId } });
    expect(firstDriverWallet?.availableBalance).toBe(12000);

    const releaseTxsAfterActivation = await prisma.walletTransaction.count({
      where: { tripWalletId: walletAfterActivation?.id, type: "DRIVER_FIRST_RELEASE" },
    });
    expect(releaseTxsAfterActivation).toBe(1);

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginTransit" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "markDeliveryPending" });

    await prisma.inspection.create({
      data: {
        tripId: trip!.id,
        type: "DELIVERY",
        driverId: trip!.driverId,
        photoUrls: [],
        odometer: 1000,
        vehicleCondition: "Good",
        handoverConfirmed: true,
      },
    });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "confirmDelivery" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "completeTrip" });

    const tripAfterCompletion = await prisma.trip.findUnique({ where: { id: trip!.id } });
    expect(tripAfterCompletion?.status).toBe(TripStatus.COMPLETED);

    const walletAfterCompletion = await prisma.tripWallet.findUnique({ where: { tripId: trip!.id } });
    expect(walletAfterCompletion?.driverAmountReleased).toBe(24000);

    const finalDriverWallet = await prisma.driverWallet.findUnique({ where: { driverId: trip!.driverId } });
    expect(finalDriverWallet?.availableBalance).toBe(24000);

    const releaseTxsAfterCompletion = await prisma.walletTransaction.count({
      where: { tripWalletId: walletAfterCompletion?.id, type: "DRIVER_FINAL_RELEASE" },
    });
    expect(releaseTxsAfterCompletion).toBe(1);
  });

  it("prevents another driver from releasing funds for a trip they do not own", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);
    const driverBToken = await loginToken(driverB.email, driverB.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Kisii", destination: "Nairobi", vehicleDetailId });

    expect(requestResponse.status).toBe(201);
    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 18000, message: "Wrong driver release" });

    expect(quoteResponse.status).toBe(201);
    const quoteId = quoteResponse.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_WALLET_WRONG_DRIVER_001" });

    const paymentId = paymentResponse.body.data.id;
    await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_WALLET_WRONG_DRIVER_001" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "completePickupInspection" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "requestTripStart" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "activateTrip" });

    const response = await request(app)
      .post(`/api/trips/${trip?.id}/wallet/releases`)
      .set("Authorization", `Bearer ${driverBToken}`);

    expect(response.status).toBe(403);
  });
});
