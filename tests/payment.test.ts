import request from "supertest";
import crypto from "crypto";
import app from "../src/app";
import { prisma } from "../src/db";
import { UserRole } from "@prisma/client";
import { hashPassword } from "../src/services/authService";
import { PAYMENT_WEBHOOK_SIGNATURE_HEADER } from "../src/services/paymentProvider";

jest.setTimeout(60000);

const customer = {
  email: "customer-payment-test@example.com",
  password: "CustomerPayment123!",
  fullName: "Customer Payment",
  role: UserRole.CUSTOMER,
};

const driver = {
  email: "driver-payment-test@example.com",
  password: "DriverPayment123!",
  fullName: "Driver Payment",
  role: UserRole.DRIVER,
};

let customerId: string;
let driverId: string;
let vehicleDetailId: string;
let driverUserId: string;

async function loginToken(email: string, password: string) {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.data.token;
}

beforeAll(async () => {
  const emails = [customer.email, driver.email];
  const existingUsers = await prisma.user.findMany({ where: { email: { in: emails } } });
  const existingUserIds = existingUsers.map((user) => user.id);

  if (existingUserIds.length > 0) {
    await prisma.driverQuote.deleteMany({ where: { driver: { userId: { in: existingUserIds } } } });
    await prisma.payment.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.walletTransaction.deleteMany({ where: { OR: [{ tripWallet: { trip: { customerId: { in: existingUserIds } } } }, { driverWallet: { driver: { userId: { in: existingUserIds } } } }] } });
    await prisma.tripWallet.deleteMany({ where: { trip: { customerId: { in: existingUserIds } } } });
    await prisma.driverWallet.deleteMany({ where: { driver: { userId: { in: existingUserIds } } } });
    await prisma.trip.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.transportRequest.deleteMany({ where: { OR: [{ customerId: { in: existingUserIds } }, { authorizedRepresentativeId: { in: existingUserIds } }] } });
    await prisma.driver.deleteMany({ where: { userId: { in: existingUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: existingUserIds } } });
  }

  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["PAY1234"] } } });

  const createdCustomer = await prisma.user.create({
    data: {
      email: customer.email,
      passwordHash: await hashPassword(customer.password),
      fullName: customer.fullName,
      role: customer.role,
    },
  });

  const createdDriverUser = await prisma.user.create({
    data: {
      email: driver.email,
      passwordHash: await hashPassword(driver.password),
      fullName: driver.fullName,
      role: driver.role,
    },
  });

  const driverProfile = await prisma.driver.create({
    data: {
      userId: createdDriverUser.id,
      licenseNumber: "DRV-PAY-001",
      verified: true,
    },
  });

  const vehicleDetail = await prisma.vehicleDetail.create({
    data: {
      make: "Isuzu",
      model: "D-Max",
      year: 2024,
      registrationNumber: "PAY1234",
      color: "Red",
    },
  });

  customerId = createdCustomer.id;
  driverId = driverProfile.id;
  driverUserId = createdDriverUser.id;
  vehicleDetailId = vehicleDetail.id;
});

afterAll(async () => {
  await prisma.payment.deleteMany({ where: { customerId } });
  await prisma.walletTransaction.deleteMany({ where: { OR: [{ tripWallet: { trip: { customerId } } }, { driverWallet: { driverId } }] } });
  await prisma.tripWallet.deleteMany({ where: { trip: { customerId } } });
  await prisma.driverWallet.deleteMany({ where: { driverId } });
  await prisma.trip.deleteMany({ where: { customerId } });
  await prisma.driverQuote.deleteMany({ where: { driverId } });
  await prisma.transportRequest.deleteMany({ where: { customerId } });
  await prisma.driver.deleteMany({ where: { id: driverId } });
  // Remove driver records linked to the test users before deleting users
  const usersToRemove = await prisma.user.findMany({ where: { email: { in: [customer.email, driver.email] } }, select: { id: true } });
  const userIds = usersToRemove.map((u) => u.id);
  if (userIds.length > 0) {
    await prisma.driver.deleteMany({ where: { userId: { in: userIds } } });
  }
  await prisma.user.deleteMany({ where: { email: { in: [customer.email, driver.email] } } });
  await prisma.vehicleDetail.deleteMany({ where: { id: vehicleDetailId } });
  await prisma.$disconnect();
});

describe("Payment Confirmation module", () => {
  it("creates a trip record when a quote is selected", async () => {
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
      .send({ amount: 32000, message: "Secure transport" });

    expect(quoteResponse.status).toBe(201);
    const quoteId = quoteResponse.body.data.id;

    const selectResponse = await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(selectResponse.status).toBe(200);
    expect(selectResponse.body.data.status).toBe("SELECTED");

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();
    expect(trip?.status).toBe("PAYMENT_PENDING");
    expect(trip?.customerId).toBe(customerId);
    expect(trip?.driverId).toBe(driverId);
    expect(trip?.bookingAmount).toBe(32000);
  });

  it("allows creating a payment for a pending trip", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nakuru", destination: "Kisumu", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 28000, message: "Quick quote" });

    const quoteId = quoteResponse.body.data.id;

    const selectResponse = await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();
    expect(trip?.status).toBe("PAYMENT_PENDING");

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TEST_001" });

    expect(paymentResponse.status).toBe(201);
    expect(paymentResponse.body.data).toHaveProperty("status", "PENDING");
    expect(paymentResponse.body.data.amount).toBe(28000);
    expect(paymentResponse.body.data.customerId).toBe(customerId);
  });

  it("rejects an invalid provider webhook signature before confirming payment", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Kiambu", destination: "Thika", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;
    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 31000, message: "Webhook valid test quote" });

    const quoteId = quoteResponse.body.data.id;
    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_WEBHOOK_001" });

    const paymentId = paymentResponse.body.data.id;
    const secret = "webhook-secret-test";
    const badSignature = crypto.createHmac("sha256", secret).update(JSON.stringify({
      providerReference: "MPESA_WEBHOOK_001",
      amount: 31000,
      currency: "KES",
      status: "confirmed",
      paymentId,
      tripId: trip?.id,
    })).digest("hex");

    const previousSecret = process.env.PAYMENT_WEBHOOK_SECRET;
    process.env.PAYMENT_WEBHOOK_SECRET = secret;

    try {
      const webhookResponse = await request(app)
        .post("/api/payments/webhook")
        .set(PAYMENT_WEBHOOK_SIGNATURE_HEADER, `${badSignature}x`)
        .send({
          providerReference: "MPESA_WEBHOOK_001",
          amount: 31000,
          currency: "KES",
          status: "confirmed",
          paymentId,
          tripId: trip?.id,
        });

      expect(webhookResponse.status).toBe(401);
      const paymentAfter = await prisma.payment.findUnique({ where: { id: paymentId } });
      expect(paymentAfter?.status).toBe("PENDING");
    } finally {
      if (previousSecret === undefined) {
        delete process.env.PAYMENT_WEBHOOK_SECRET;
      } else {
        process.env.PAYMENT_WEBHOOK_SECRET = previousSecret;
      }
    }
  });

  it("prevents unauthorized users from creating payments for another customer's trip", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Kitale", destination: "Eldoret", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 29000, message: "Driver quote" });

    const quoteId = quoteResponse.body.data.id;

    const selectResponse = await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const response = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ providerReference: "MPESA_TEST_002" });

    expect(response.status).toBe(403);
  });

  it("ignores a client-supplied amount and uses the trip booking amount", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Kisumu", destination: "Nakuru", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 27000, message: "Fixed amount quote" });

    const quoteId = quoteResponse.body.data.id;

    await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TEST_007", amount: 5000 });

    expect(paymentResponse.status).toBe(201);
    expect(paymentResponse.body.data.amount).toBe(27000);
    expect(paymentResponse.body.data.amount).toBe(trip?.bookingAmount);
  });

  it("prevents a driver from confirming another customer's payment", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nyeri", destination: "Nanyuki", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 30000, message: "Secure load" });

    const quoteId = quoteResponse.body.data.id;

    await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TEST_008" });

    const paymentId = paymentResponse.body.data.id;

    const confirmResponse = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ providerCallbackReference: "MPESA_CALLBACK_008" });

    expect(confirmResponse.status).toBe(403);
  });

  it("prevents confirming a payment when the trip is cancelled", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Embu", destination: "Nairobi", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 33000, message: "Route quote" });

    const quoteId = quoteResponse.body.data.id;

    await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    await prisma.trip.update({ where: { id: trip!.id }, data: { status: "CANCELLED" } });

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TEST_009" });

    expect(paymentResponse.status).toBe(400);
  });

  it("returns 404 when confirming a nonexistent payment", async () => {
    const customerToken = await loginToken(customer.email, customer.password);

    const confirmResponse = await request(app)
      .post(`/api/payments/nonexistent-payment-id/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CALLBACK_NONE" });

    expect(confirmResponse.status).toBe(404);
  });

  it("confirms a pending payment and marks the trip/booked request appropriately", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nairobi", destination: "Naivasha", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 31000, message: "Reliable transport" });

    const quoteId = quoteResponse.body.data.id;

    await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TEST_003" });

    const paymentId = paymentResponse.body.data.id;

    const confirmResponse = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CALLBACK_003" });

    expect(confirmResponse.status).toBe(200);
    expect(confirmResponse.body.data).toHaveProperty("status", "CONFIRMED");

    const updatedTrip = await prisma.trip.findUnique({ where: { id: trip?.id } });
    expect(updatedTrip?.status).toBe("BOOKED");

    const updatedRequest = await prisma.transportRequest.findUnique({ where: { id: transportRequestId } });
    expect(updatedRequest?.status).toBe("BOOKED");
  });

  it("prevents duplicate payment creation for the same trip", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nairobi", destination: "Thika", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 30000, message: "Quick booking" });

    const quoteId = quoteResponse.body.data.id;

    await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const firstResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TEST_004" });

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TEST_005" });

    expect(secondResponse.status).toBe(409);
  });

  it("prevents confirming a non-pending payment", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Mombasa", destination: "Nairobi", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 35000, message: "Premium quote" });

    const quoteId = quoteResponse.body.data.id;

    await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip).not.toBeNull();

    const paymentResponse = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TEST_006" });

    const paymentId = paymentResponse.body.data.id;

    await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CALLBACK_006" });

    const secondConfirmResponse = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CALLBACK_006_AGAIN" });

    expect(secondConfirmResponse.status).toBe(400);
  });
});
