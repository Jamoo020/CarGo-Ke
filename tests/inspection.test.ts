import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { UserRole } from "@prisma/client";
import { hashPassword } from "../src/services/authService";

jest.setTimeout(60000);

const customer = {
  email: "customer-inspection-test@example.com",
  password: "CustomerInspection123!",
  fullName: "Customer Inspection",
  role: UserRole.CUSTOMER,
};

const driver = {
  email: "driver-inspection-test@example.com",
  password: "DriverInspection123!",
  fullName: "Driver Inspection",
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
  const existingUsers = await prisma.user.findMany({ where: { email: { in: [customer.email, driver.email] } } });
  const existingUserIds = existingUsers.map((u) => u.id);

  if (existingUserIds.length > 0) {
    await prisma.driverQuote.deleteMany({ where: { driver: { userId: { in: existingUserIds } } } });
    await prisma.payment.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.walletTransaction.deleteMany({ where: { tripWallet: { trip: { customerId: { in: existingUserIds } } } } });
    await prisma.tripWallet.deleteMany({ where: { trip: { customerId: { in: existingUserIds } } } });
    await prisma.inspection.deleteMany({ where: { trip: { customerId: { in: existingUserIds } } } });
    // Remove cancellations referencing these trips before deleting trips (FK constraint)
    await prisma.cancellation.deleteMany({ where: { trip: { customerId: { in: existingUserIds } } } });
    await prisma.trip.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.transportRequest.deleteMany({ where: { OR: [{ customerId: { in: existingUserIds } }, { authorizedRepresentativeId: { in: existingUserIds } }] } });
    await prisma.driver.deleteMany({ where: { userId: { in: existingUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: existingUserIds } } });
  }

  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["INSPEC1234"] } } });

  const createdCustomer = await prisma.user.create({
    data: { email: customer.email, passwordHash: await hashPassword(customer.password), fullName: customer.fullName, role: customer.role },
  });
  const createdDriverUser = await prisma.user.create({
    data: { email: driver.email, passwordHash: await hashPassword(driver.password), fullName: driver.fullName, role: driver.role },
  });

  const driverProfile = await prisma.driver.create({ data: { userId: createdDriverUser.id, licenseNumber: "DRV-INSPEC-001", verified: true } });
  const vehicleDetail = await prisma.vehicleDetail.create({ data: { make: "Toyota", model: "Corolla", year: 2021, registrationNumber: "INSPEC1234", color: "Grey" } });

  customerId = createdCustomer.id;
  driverId = driverProfile.id;
  vehicleDetailId = vehicleDetail.id;
});

afterAll(async () => {
  await prisma.inspection.deleteMany({ where: { trip: { customerId } } });
  await prisma.payment.deleteMany({ where: { customerId } });
  await prisma.walletTransaction.deleteMany({ where: { tripWallet: { trip: { customerId } } } });
  await prisma.tripWallet.deleteMany({ where: { trip: { customerId } } });
  // Remove cancellations referencing these trips before deleting trips (FK constraint)
  await prisma.cancellation.deleteMany({ where: { trip: { customerId } } });
  await prisma.trip.deleteMany({ where: { customerId } });
  await prisma.driverQuote.deleteMany({ where: { driverId } });
  await prisma.transportRequest.deleteMany({ where: { customerId } });
  await prisma.driver.deleteMany({ where: { id: driverId } });
  // Ensure any driver records referencing the test users are removed before deleting users
  const usersToRemove = await prisma.user.findMany({ where: { email: { in: [customer.email, driver.email] } }, select: { id: true } });
  const userIds = usersToRemove.map((u) => u.id);
  if (userIds.length > 0) {
    await prisma.driver.deleteMany({ where: { userId: { in: userIds } } });
  }
  await prisma.user.deleteMany({ where: { email: { in: [customer.email, driver.email] } } });
  await prisma.vehicleDetail.deleteMany({ where: { id: vehicleDetailId } });
  await prisma.$disconnect();
});

describe("Pickup and Delivery Inspection", () => {
  it("allows a verified driver to submit pickup inspection and rejects duplicate submission", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nairobi", destination: "Mombasa", vehicleDetailId });
    expect(requestResp.status).toBe(201);
    const transportRequestId = requestResp.body.data.id;

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 25000, message: "Inspection quote" });
    expect(quoteResp.status).toBe(201);
    const quoteId = quoteResp.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip?.status).toBe("PAYMENT_PENDING");

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_INSPEC_001" });
    expect(paymentResp.status).toBe(201);
    const paymentId = paymentResp.body.data.id;

    const confirmResp = await request(app)
      .post(`/api/payments/${paymentId}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_INSPEC_CB_001" });
    expect(confirmResp.status).toBe(200);
    expect((await prisma.trip.findUnique({ where: { id: trip?.id } }))?.status).toBe("BOOKED");

    const beginPickup = await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });
    expect(beginPickup.status).toBe(200);
    expect(beginPickup.body.data.status).toBe("PICKUP_PENDING");

    const inspectionResp = await request(app)
      .post(`/api/trips/${trip?.id}/inspections`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        type: "PICKUP",
        photoUrls: ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        odometer: 12345,
        fuelLevel: 75,
        vehicleCondition: "Good",
        damageNotes: "No visible damage",
        observations: "Clean and ready",
        handoverConfirmed: true,
      });
    expect(inspectionResp.status).toBe(201);
    expect(inspectionResp.body.data.type).toBe("PICKUP");
    expect(inspectionResp.body.data.handoverConfirmed).toBe(true);

    const duplicateResp = await request(app)
      .post(`/api/trips/${trip?.id}/inspections`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        type: "PICKUP",
        photoUrls: ["https://example.com/photo3.jpg"],
        odometer: 12345,
        fuelLevel: 75,
        vehicleCondition: "Good",
        damageNotes: "No visible damage",
        observations: "Clean and ready",
        handoverConfirmed: true,
      });
    expect(duplicateResp.status).toBe(409);
  });

  it("rejects pickup inspection submission by wrong driver, customer, and unauthenticated users", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const otherDriver = await prisma.user.create({
      data: { email: "driver-inspection-wrong@example.com", passwordHash: await hashPassword("DriverInspectionWrong123!"), fullName: "Driver Wrong", role: UserRole.DRIVER },
    });
    const otherDriverProfile = await prisma.driver.create({ data: { userId: otherDriver.id, licenseNumber: "DRV-INSPEC-002", verified: true } });
    const otherDriverTokenResp = await request(app).post("/api/auth/login").send({ email: otherDriver.email, password: "DriverInspectionWrong123!" });
    const otherDriverToken = otherDriverTokenResp.body.data.token;

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nakuru", destination: "Naivasha", vehicleDetailId });
    expect(requestResp.status).toBe(201);
    const transportRequestId = requestResp.body.data.id;

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 26000, message: "Wrong driver quote" });
    expect(quoteResp.status).toBe(201);
    const quoteId = quoteResp.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_INSPEC_002" });
    expect(paymentResp.status).toBe(201);
    const confirmResp = await request(app)
      .post(`/api/payments/${paymentResp.body.data.id}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_INSPEC_CB_002" });
    expect(confirmResp.status).toBe(200);

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });

    const wrongDriverResp = await request(app)
      .post(`/api/trips/${trip?.id}/inspections`)
      .set("Authorization", `Bearer ${otherDriverToken}`)
      .send({
        type: "PICKUP",
        photoUrls: ["https://example.com/photo.jpg"],
        odometer: 10000,
        fuelLevel: 50,
        vehicleCondition: "Good",
        damageNotes: "None",
        observations: "Clean",
        handoverConfirmed: true,
      });
    expect(wrongDriverResp.status).toBe(403);

    const customerResp = await request(app)
      .post(`/api/trips/${trip?.id}/inspections`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({
        type: "PICKUP",
        photoUrls: ["https://example.com/photo.jpg"],
        odometer: 10000,
        fuelLevel: 50,
        vehicleCondition: "Good",
        damageNotes: "None",
        observations: "Clean",
        handoverConfirmed: true,
      });
    expect(customerResp.status).toBe(403);

    const unauthResp = await request(app)
      .post(`/api/trips/${trip?.id}/inspections`)
      .send({
        type: "PICKUP",
        photoUrls: ["https://example.com/photo.jpg"],
        odometer: 10000,
        fuelLevel: 50,
        vehicleCondition: "Good",
        damageNotes: "None",
        observations: "Clean",
        handoverConfirmed: true,
      });
    expect(unauthResp.status).toBe(401);

    await prisma.driver.delete({ where: { id: otherDriverProfile.id } });
    await prisma.user.delete({ where: { id: otherDriver.id } });
  });

  it("rejects delivery inspection when trip is not in DELIVERY_PENDING status and preserves Trip State Machine", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Kisumu", destination: "Eldoret", vehicleDetailId });
    expect(requestResp.status).toBe(201);
    const transportRequestId = requestResp.body.data.id;

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 27000, message: "Delivery step quote" });
    expect(quoteResp.status).toBe(201);
    const quoteId = quoteResp.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_INSPEC_003" });
    expect(paymentResp.status).toBe(201);
    await request(app)
      .post(`/api/payments/${paymentResp.body.data.id}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_INSPEC_CB_003" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });

    const deliveryInspectionResp = await request(app)
      .post(`/api/trips/${trip?.id}/inspections`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        type: "DELIVERY",
        photoUrls: ["https://example.com/photo.jpg"],
        odometer: 15000,
        fuelLevel: 40,
        vehicleCondition: "Good",
        damageNotes: "None",
        observations: "Delivered",
        handoverConfirmed: true,
      });

    expect(deliveryInspectionResp.status).toBe(400);
    expect(deliveryInspectionResp.body.error).toMatch(/DELIVERY_PENDING/);
  });

  it("rolls back pickup inspection creation if trip transition fails (atomicity)", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Embu", destination: "Meru", vehicleDetailId });
    expect(requestResp.status).toBe(201);
    const transportRequestId = requestResp.body.data.id;

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 28000, message: "Rollback test quote" });
    expect(quoteResp.status).toBe(201);
    const quoteId = quoteResp.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_INSPEC_ROLLBACK" });
    expect(paymentResp.status).toBe(201);
    await request(app)
      .post(`/api/payments/${paymentResp.body.data.id}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_INSPEC_ROLLBACK_CB" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });

    // Force the trip transition called from the inspection flow to fail so the transaction must rollback
    const tripService = require("../src/services/tripService");
    const spy = jest.spyOn(tripService, "transitionTripStatus").mockImplementation(async () => {
      throw new Error("forced transition failure for rollback test");
    });

    const resp = await request(app)
      .post(`/api/trips/${trip?.id}/inspections`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        type: "PICKUP",
        photoUrls: ["https://example.com/rollback1.jpg"],
        odometer: 20000,
        fuelLevel: 80,
        vehicleCondition: "Good",
        damageNotes: "None",
        observations: "Rollback test",
        handoverConfirmed: true,
      });

    // transaction should fail and no inspection should persist
    expect(resp.status).not.toBe(201);

    const inspections = await prisma.inspection.findMany({ where: { tripId: trip?.id } });
    expect(inspections.length).toBe(0);

    const freshTrip = await prisma.trip.findUnique({ where: { id: trip?.id } });
    expect(freshTrip?.status).toBe("PICKUP_PENDING");

    spy.mockRestore();
  });
});
