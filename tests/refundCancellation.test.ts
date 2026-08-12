import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { UserRole } from "@prisma/client";
import { hashPassword } from "../src/services/authService";

jest.setTimeout(60000);

const customer = {
  email: "customer-refund-test@example.com",
  password: "CustomerRefund123!",
  fullName: "Customer Refund",
  role: UserRole.CUSTOMER,
};

const driver = {
  email: "driver-refund-test@example.com",
  password: "DriverRefund123!",
  fullName: "Driver Refund",
  role: UserRole.DRIVER,
};

const otherCustomer = {
  email: "customer-refund-other@example.com",
  password: "CustomerRefundOther123!",
  fullName: "Customer Refund Other",
  role: UserRole.CUSTOMER,
};

let customerId: string;
let driverId: string;
let vehicleDetailId: string;

async function loginToken(email: string, password: string) {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.data.token;
}

beforeAll(async () => {
  const emails = [customer.email, driver.email, otherCustomer.email];
  const existingUsers = await prisma.user.findMany({ where: { email: { in: emails } } });
  const existingUserIds = existingUsers.map((u) => u.id);

  if (existingUserIds.length > 0) {
    await prisma.walletTransaction.deleteMany({ where: { OR: [{ tripWallet: { trip: { customerId: { in: existingUserIds } } } }, { driverWallet: { driver: { userId: { in: existingUserIds } } } }] } });
    await prisma.tripWallet.deleteMany({ where: { trip: { customerId: { in: existingUserIds } } } });
    await prisma.driverWallet.deleteMany({ where: { driver: { userId: { in: existingUserIds } } } });
    await prisma.refund.deleteMany({ where: { payment: { customerId: { in: existingUserIds } } } });
    await prisma.payment.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.cancellation.deleteMany({ where: { initiatedById: { in: existingUserIds } } });
    await prisma.trip.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.driverQuote.deleteMany({ where: { transportRequest: { OR: [{ customerId: { in: existingUserIds } }, { authorizedRepresentativeId: { in: existingUserIds } }] } } });
    await prisma.transportRequest.deleteMany({ where: { OR: [{ customerId: { in: existingUserIds } }, { authorizedRepresentativeId: { in: existingUserIds } }] } });
    await prisma.driver.deleteMany({ where: { userId: { in: existingUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: existingUserIds } } });
  }

  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["REFUND1234"] } } });

  const createdCustomer = await prisma.user.create({
    data: { email: customer.email, passwordHash: await hashPassword(customer.password), fullName: customer.fullName, role: customer.role },
  });

  const createdDriverUser = await prisma.user.create({
    data: { email: driver.email, passwordHash: await hashPassword(driver.password), fullName: driver.fullName, role: driver.role },
  });

  const createdOtherCustomer = await prisma.user.create({
    data: { email: otherCustomer.email, passwordHash: await hashPassword(otherCustomer.password), fullName: otherCustomer.fullName, role: otherCustomer.role },
  });

  const driverProfile = await prisma.driver.create({ data: { userId: createdDriverUser.id, licenseNumber: "DRV-REF-001", verified: true } });

  const vehicleDetail = await prisma.vehicleDetail.create({ data: { make: "Mitsubishi", model: "L300", year: 2022, registrationNumber: "REFUND1234", color: "White" } });

  customerId = createdCustomer.id;
  driverId = driverProfile.id;
  vehicleDetailId = vehicleDetail.id;

  // Keep otherCustomer available for authorization tests
  expect(createdOtherCustomer).not.toBeNull();
});

afterAll(async () => {
  await prisma.walletTransaction.deleteMany({ where: { OR: [{ tripWallet: { trip: { customerId } } }, { driverWallet: { driverId: driverId } }] } });
  await prisma.refund.deleteMany({ where: { customerId } });
  await prisma.payment.deleteMany({ where: { customerId } });
  await prisma.tripWallet.deleteMany({ where: { trip: { customerId } } });
  await prisma.driverWallet.deleteMany({ where: { driverId } });
  await prisma.cancellation.deleteMany({ where: { initiatedById: customerId } });
  await prisma.trip.deleteMany({ where: { customerId } });
  await prisma.driverQuote.deleteMany({ where: { transportRequest: { customerId } } });
  await prisma.transportRequest.deleteMany({ where: { customerId } });
  await prisma.driver.deleteMany({ where: { id: driverId } });
  await prisma.user.deleteMany({ where: { email: { in: [customer.email, driver.email, otherCustomer.email] } } });
  await prisma.vehicleDetail.deleteMany({ where: { id: vehicleDetailId } });
  await prisma.$disconnect();
});

describe("Refunds and Cancellations", () => {
  it("allows cancellation before payment and records the cancellation without a refund", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nairobi", destination: "Mombasa", vehicleDetailId });
    expect(requestResp.status).toBe(201);

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${requestResp.body.data.id}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 18000, message: "Cancel before payment quote" });
    expect(quoteResp.status).toBe(201);

    const selectResp = await request(app)
      .post(`/api/quotes/${quoteResp.body.data.id}/select`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(selectResp.status).toBe(200);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId: requestResp.body.data.id } });
    expect(trip).not.toBeNull();
    expect(trip?.status).toBe("PAYMENT_PENDING");

    const cancelResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "cancelTrip", reason: "Plan changed" });

    expect(cancelResp.status).toBe(200);
    expect(cancelResp.body.data.status).toBe("CANCELLED");

    const cancellation = await prisma.cancellation.findUnique({ where: { tripId: trip?.id } });
    expect(cancellation).not.toBeNull();
    expect(cancellation?.reason).toBe("Plan changed");
    expect(cancellation?.initiatorRole).toBe("CUSTOMER");
    expect(cancellation?.statusBefore).toBe("PAYMENT_PENDING");
    expect(cancellation?.refundAmount).toBe(0);

    const payment = await prisma.payment.findUnique({ where: { tripId: trip?.id } });
    expect(payment).toBeNull();

    const wallet = await prisma.tripWallet.findUnique({ where: { tripId: trip?.id } });
    expect(wallet).toBeNull();
  });

  it("processes a partial refund and preserves the original payment", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nakuru", destination: "Kisumu", vehicleDetailId });
    expect(requestResp.status).toBe(201);

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${requestResp.body.data.id}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 26000, message: "Refund quote" });
    expect(quoteResp.status).toBe(201);

    const selectResp = await request(app)
      .post(`/api/quotes/${quoteResp.body.data.id}/select`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(selectResp.status).toBe(200);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId: requestResp.body.data.id } });
    expect(trip).not.toBeNull();

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_REFUND_001" });
    expect(paymentResp.status).toBe(201);
    const paymentId = paymentResp.body.data.id;

    const confirmResp = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_REFUND_001" });
    expect(confirmResp.status).toBe(200);

    const refundResp = await request(app)
      .post(`/api/trips/${trip?.id}/refunds`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 5000, reason: "Partial refund" });
    expect(refundResp.status).toBe(201);
    expect(refundResp.body.data.amount).toBe(5000);
    expect(refundResp.body.data.status).toBe("COMPLETED");

    const payment = await prisma.payment.findUnique({ where: { id: paymentId }, include: { refunds: true } });
    expect(payment).not.toBeNull();
    expect(payment?.amount).toBe(26000);
    expect(payment?.refunds.length).toBe(1);
    expect(payment?.refunds[0].amount).toBe(5000);

    const walletTx = await prisma.walletTransaction.findFirst({ where: { refundId: refundResp.body.data.id } });
    expect(walletTx).not.toBeNull();
    expect(walletTx?.type).toBe("REFUND");
    expect(walletTx?.amount).toBe(5000);

    const tripWallet = await prisma.tripWallet.findUnique({ where: { tripId: trip?.id } });
    expect(tripWallet?.refundAmount).toBe(5000);
  });

  it("rejects over-refunds and prevents duplicate refunds", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Kitale", destination: "Eldoret", vehicleDetailId });
    expect(requestResp.status).toBe(201);

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${requestResp.body.data.id}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 30000, message: "Full refund quote" });
    expect(quoteResp.status).toBe(201);

    const selectResp = await request(app)
      .post(`/api/quotes/${quoteResp.body.data.id}/select`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(selectResp.status).toBe(200);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId: requestResp.body.data.id } });
    expect(trip).not.toBeNull();

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_REFUND_002" });
    expect(paymentResp.status).toBe(201);
    const paymentId = paymentResp.body.data.id;

    const confirmResp = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_REFUND_002" });
    expect(confirmResp.status).toBe(200);

    const overRefundResp = await request(app)
      .post(`/api/trips/${trip?.id}/refunds`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 35000, reason: "Too much refund" });
    expect(overRefundResp.status).toBe(400);

    const firstRefundResp = await request(app)
      .post(`/api/trips/${trip?.id}/refunds`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 20000, reason: "First refund" });
    expect(firstRefundResp.status).toBe(201);

    const secondRefundResp = await request(app)
      .post(`/api/trips/${trip?.id}/refunds`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ amount: 12000, reason: "Second refund" });
    expect(secondRefundResp.status).toBe(400);
  });

  it("prevents unauthenticated and unauthorized refund actions", async () => {
    const driverToken = await loginToken(driver.email, driver.password);
    const customerToken = await loginToken(customer.email, customer.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nanyuki", destination: "Nakuru", vehicleDetailId });
    expect(requestResp.status).toBe(201);

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${requestResp.body.data.id}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 20000, message: "Unauthorized refund quote" });
    expect(quoteResp.status).toBe(201);

    const selectResp = await request(app)
      .post(`/api/quotes/${quoteResp.body.data.id}/select`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(selectResp.status).toBe(200);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId: requestResp.body.data.id } });
    expect(trip).not.toBeNull();

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_REFUND_003" });
    expect(paymentResp.status).toBe(201);
    const paymentId = paymentResp.body.data.id;

    await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_REFUND_003" });

    const refundWithNoAuth = await request(app).post(`/api/trips/${trip?.id}/refunds`).send({ amount: 1000, reason: "No auth" });
    expect(refundWithNoAuth.status).toBe(401);

    const refundByDriver = await request(app)
      .post(`/api/trips/${trip?.id}/refunds`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 1000, reason: "Driver attempted refund" });
    expect(refundByDriver.status).toBe(403);

    const otherTokenResp = await request(app).post("/api/auth/login").send({ email: otherCustomer.email, password: otherCustomer.password });
    const otherToken = otherTokenResp.body.data.token;

    const refundByOtherCustomer = await request(app)
      .post(`/api/trips/${trip?.id}/refunds`)
      .set("Authorization", `Bearer ${otherToken}`)
      .send({ amount: 1000, reason: "Wrong customer" });
    expect(refundByOtherCustomer.status).toBe(403);
  });

  it("protects against concurrent refund attempts exceeding the refundable amount", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nakuru", destination: "Mombasa", vehicleDetailId });
    expect(requestResp.status).toBe(201);

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${requestResp.body.data.id}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 24000, message: "Concurrent refund quote" });
    expect(quoteResp.status).toBe(201);

    const selectResp = await request(app)
      .post(`/api/quotes/${quoteResp.body.data.id}/select`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(selectResp.status).toBe(200);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId: requestResp.body.data.id } });
    expect(trip).not.toBeNull();

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_REFUND_004" });
    expect(paymentResp.status).toBe(201);
    const paymentId = paymentResp.body.data.id;

    const confirmResp = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_REFUND_004" });
    expect(confirmResp.status).toBe(200);

    const [first, second] = await Promise.allSettled([
      request(app)
        .post(`/api/trips/${trip?.id}/refunds`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ amount: 15000, reason: "Concurrent refund A" }),
      request(app)
        .post(`/api/trips/${trip?.id}/refunds`)
        .set("Authorization", `Bearer ${customerToken}`)
        .send({ amount: 15000, reason: "Concurrent refund B" }),
    ]);

    const fulfilled = [first, second].filter((result) => result.status === "fulfilled") as PromiseFulfilledResult<any>[];
    expect(fulfilled.length).toBe(2);

    const statuses = fulfilled.map((result) => result.value.status);
    expect(statuses).toContain(201);
    expect(statuses).toEqual(expect.arrayContaining([expect.any(Number)]));
    expect(statuses.some((status) => status === 409 || status === 400)).toBe(true);

    const refunds = await prisma.refund.findMany({ where: { paymentId } });
    const totalRefunded = refunds.reduce((sum, refund) => sum + refund.amount, 0);
    expect(totalRefunded).toBeLessThanOrEqual(24000);
  });
});
