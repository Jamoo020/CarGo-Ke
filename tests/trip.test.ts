import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { UserRole } from "@prisma/client";
import { hashPassword } from "../src/services/authService";

jest.setTimeout(60000);

const customer = {
  email: "customer-trip-test@example.com",
  password: "CustomerTrip123!",
  fullName: "Customer Trip",
  role: UserRole.CUSTOMER,
};

const driver = {
  email: "driver-trip-test@example.com",
  password: "DriverTrip123!",
  fullName: "Driver Trip",
  role: UserRole.DRIVER,
};

let customerId: string;
let driverId: string;
let vehicleDetailId: string;

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
    await prisma.inspection.deleteMany({ where: { trip: { customerId: { in: existingUserIds } } } });
    await prisma.cancellation.deleteMany({ where: { trip: { customerId: { in: existingUserIds } } } });
    await prisma.trip.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.transportRequest.deleteMany({ where: { OR: [{ customerId: { in: existingUserIds } }, { authorizedRepresentativeId: { in: existingUserIds } }] } });
    await prisma.driver.deleteMany({ where: { userId: { in: existingUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: existingUserIds } } });
  }

  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["TRIP1234"] } } });

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
      licenseNumber: "DRV-TRIP-001",
      verified: true,
    },
  });

  const vehicleDetail = await prisma.vehicleDetail.create({
    data: {
      make: "Hino",
      model: "500",
      year: 2023,
      registrationNumber: "TRIP1234",
      color: "Blue",
    },
  });

  customerId = createdCustomer.id;
  driverId = driverProfile.id;
  vehicleDetailId = vehicleDetail.id;
});

afterAll(async () => {
  await prisma.payment.deleteMany({ where: { customerId } });
  await prisma.walletTransaction.deleteMany({ where: { OR: [{ tripWallet: { trip: { customerId } } }, { driverWallet: { driverId } }] } });
  await prisma.tripWallet.deleteMany({ where: { trip: { customerId } } });
  await prisma.driverWallet.deleteMany({ where: { driverId } });
  await prisma.inspection.deleteMany({ where: { trip: { customerId } } });
  await prisma.cancellation.deleteMany({ where: { trip: { customerId } } });
  await prisma.trip.deleteMany({ where: { customerId } });
  await prisma.driverQuote.deleteMany({ where: { driverId } });
  await prisma.transportRequest.deleteMany({ where: { customerId } });
  await prisma.driver.deleteMany({ where: { id: driverId } });
  await prisma.user.deleteMany({ where: { email: { in: [customer.email, driver.email] } } });
  await prisma.vehicleDetail.deleteMany({ where: { id: vehicleDetailId } });
  await prisma.$disconnect();
});

describe("Trip State Machine", () => {
  it("advances a booked trip through the lifecycle with authorized user actions", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const createRequestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nairobi", destination: "Kisumu", vehicleDetailId });

    expect(createRequestResp.status).toBe(201);
    const transportRequestId = createRequestResp.body.data.id;

    const createQuoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 28000, message: "Trip lifecycle quote" });

    expect(createQuoteResp.status).toBe(201);
    const quoteId = createQuoteResp.body.data.id;

    const selectQuoteResp = await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(selectQuoteResp.status).toBe(200);

    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip?.status).toBe("PAYMENT_PENDING");
    expect(trip).not.toBeNull();

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TRIP_001" });

    expect(paymentResp.status).toBe(201);
    const paymentId = paymentResp.body.data.id;

    const confirmResp = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_TRIP_001" });

    expect(confirmResp.status).toBe(200);

    const bookedTrip = await prisma.trip.findUnique({ where: { id: trip?.id } });
    expect(bookedTrip?.status).toBe("BOOKED");

    const beginPickupResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });
    expect(beginPickupResp.status).toBe(200);
    expect(beginPickupResp.body.data.status).toBe("PICKUP_PENDING");

    const completePickupResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "completePickupInspection" });
    expect(completePickupResp.status).toBe(200);
    expect(completePickupResp.body.data.status).toBe("PICKUP_INSPECTION");

    const requestStartResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "requestTripStart" });
    expect(requestStartResp.status).toBe(200);
    expect(requestStartResp.body.data.status).toBe("TRIP_START_PENDING");

    const activateTripResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "activateTrip" });
    expect(activateTripResp.status).toBe(200);
    expect(activateTripResp.body.data.status).toBe("TRIP_ACTIVE");

    const beginTransitResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginTransit" });
    expect(beginTransitResp.status).toBe(200);
    expect(beginTransitResp.body.data.status).toBe("IN_TRANSIT");

    const deliveryPendingResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "markDeliveryPending" });
    expect(deliveryPendingResp.status).toBe(200);
    expect(deliveryPendingResp.body.data.status).toBe("DELIVERY_PENDING");

    const deliveryInspectionResp = await request(app)
      .post(`/api/trips/${trip?.id}/inspections`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        type: "DELIVERY",
        photoUrls: ["https://example.com/delivery1.jpg"],
        odometer: 18000,
        fuelLevel: 35,
        vehicleCondition: "Good",
        damageNotes: "No new damage",
        observations: "Delivered in good condition",
        handoverConfirmed: true,
      });
    expect(deliveryInspectionResp.status).toBe(201);
    expect(deliveryInspectionResp.body.data.type).toBe("DELIVERY");

    const confirmDeliveryResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "confirmDelivery" });
    expect(confirmDeliveryResp.status).toBe(200);
    expect(confirmDeliveryResp.body.data.status).toBe("DELIVERED");

    const completeTripResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "completeTrip" });
    expect(completeTripResp.status).toBe(200);
    expect(completeTripResp.body.data.status).toBe("COMPLETED");
  });

  it("rejects invalid trip transition actions for the current status", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const createRequestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nairobi", destination: "Eldoret", vehicleDetailId });

    const transportRequestId = createRequestResp.body.data.id;

    const createQuoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 26000, message: "Invalid transition quote" });

    const quoteId = createQuoteResp.body.data.id;
    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });

    expect(trip?.status).toBe("PAYMENT_PENDING");

    const invalidTransitionResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginTransit" });

    expect(invalidTransitionResp.status).toBe(400);
  });

  it("supports cancelling a booked trip and prevents further transitions", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const createRequestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nakuru", destination: "Mombasa", vehicleDetailId });

    const transportRequestId = createRequestResp.body.data.id;

    const createQuoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 24000, message: "Cancel trip quote" });

    const quoteId = createQuoteResp.body.data.id;
    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });

    expect(trip?.status).toBe("PAYMENT_PENDING");

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TRIP_CANCEL_001" });

    const paymentId = paymentResp.body.data.id;
    await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_TRIP_CANCEL_001" });

    const cancelResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "cancelTrip", reason: "Change of plans" });

    expect(cancelResp.status).toBe(200);
    expect(cancelResp.body.data.status).toBe("CANCELLED");

    const transportRequest = await prisma.transportRequest.findUnique({ where: { id: transportRequestId } });
    expect(transportRequest?.status).toBe("CANCELLED");

    const rejectedTransitionResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });

    expect(rejectedTransitionResp.status).toBe(400);
  });

  it("supports disputing a completed trip and prevents driver-only activation", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const createRequestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Kampala", destination: "Nairobi", vehicleDetailId });

    const transportRequestId = createRequestResp.body.data.id;

    const createQuoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 25000, message: "Dispute trip quote" });

    const quoteId = createQuoteResp.body.data.id;
    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TRIP_DISPUTE_001" });

    const paymentId = paymentResp.body.data.id;
    await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_CB_TRIP_DISPUTE_001" });

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
    const activateResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "activateTrip" });

    expect(activateResp.status).toBe(403);

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "activateTrip" });
    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginTransit" });
    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "markDeliveryPending" });
    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "confirmDelivery" });
    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "completeTrip" });

    const disputeResp = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "disputeTrip" });

    expect(disputeResp.status).toBe(200);
    expect(disputeResp.body.data.status).toBe("DISPUTED");
  });
});
