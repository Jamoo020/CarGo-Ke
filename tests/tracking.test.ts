import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { UserRole } from "@prisma/client";
import { hashPassword } from "../src/services/authService";

jest.setTimeout(60000);

const customer = {
  email: "customer-tracking-test@example.com",
  password: "CustomerTracking123!",
  fullName: "Customer Tracking",
  role: UserRole.CUSTOMER,
};

const driver = {
  email: "driver-tracking-test@example.com",
  password: "DriverTracking123!",
  fullName: "Driver Tracking",
  role: UserRole.DRIVER,
};

let customerId: string;
let driverId: string;
let driverUserId: string;
let vehicleDetailId: string;

async function cleanupTrackedUsers(userIds: string[]) {
  if (userIds.length === 0) return;

  await prisma.driverQuote.deleteMany({ where: { driver: { userId: { in: userIds } } } });
  await prisma.payment.deleteMany({ where: { customerId: { in: userIds } } });
  await prisma.walletTransaction.deleteMany({ where: { OR: [{ tripWallet: { trip: { customerId: { in: userIds } } } }, { driverWallet: { driver: { userId: { in: userIds } } } }] } });
  await prisma.tripWallet.deleteMany({ where: { trip: { customerId: { in: userIds } } } });
  await prisma.driverWallet.deleteMany({ where: { driver: { userId: { in: userIds } } } });
  await prisma.inspection.deleteMany({ where: { trip: { customerId: { in: userIds } } } });
  await prisma.gpsLocation.deleteMany({ where: { trip: { customerId: { in: userIds } } } });
  await prisma.tripMilestone.deleteMany({ where: { trip: { customerId: { in: userIds } } } });
  await prisma.cancellation.deleteMany({ where: { trip: { customerId: { in: userIds } } } });
  await prisma.trip.deleteMany({ where: { customerId: { in: userIds } } });
  await prisma.transportRequest.deleteMany({ where: { OR: [{ customerId: { in: userIds } }, { authorizedRepresentativeId: { in: userIds } }] } });
  await prisma.customerRepresentative.deleteMany({ where: { OR: [{ representativeId: { in: userIds } }, { customerId: { in: userIds } }] } });
  await prisma.driver.deleteMany({ where: { userId: { in: userIds } } });
  await prisma.user.deleteMany({ where: { id: { in: userIds } } });
}

async function loginToken(email: string, password: string) {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.data.token;
}

async function createBookedTrip(customerToken: string, driverToken: string) {
  const requestResp = await request(app)
    .post("/api/transport-requests")
    .set("Authorization", `Bearer ${customerToken}`)
    .send({ origin: "Thika", destination: "Nairobi", vehicleDetailId });
  const transportRequestId = requestResp.body.data.id;

  const quoteResp = await request(app)
    .post(`/api/transport-requests/${transportRequestId}/quotes`)
    .set("Authorization", `Bearer ${driverToken}`)
    .send({ amount: 15000, message: "Tracking setup quote" });
  const quoteId = quoteResp.body.data.id;

  await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
  const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
  return trip;
}

async function transitionTripToStatus(
  tripId: string,
  customerToken: string,
  driverToken: string,
  targetStatus: "TRIP_ACTIVE" | "IN_TRANSIT" | "DELIVERY_PENDING" | "DELIVERED" | "COMPLETED",
) {
  if (targetStatus === "TRIP_ACTIVE" || targetStatus === "IN_TRANSIT" || targetStatus === "DELIVERY_PENDING" || targetStatus === "DELIVERED" || targetStatus === "COMPLETED") {
    await request(app)
      .post(`/api/trips/${tripId}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });

    await request(app)
      .post(`/api/trips/${tripId}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "completePickupInspection" });

    await request(app)
      .post(`/api/trips/${tripId}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "requestTripStart" });

    await request(app)
      .post(`/api/trips/${tripId}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "activateTrip" });
  }

  if (targetStatus === "IN_TRANSIT" || targetStatus === "DELIVERY_PENDING" || targetStatus === "DELIVERED" || targetStatus === "COMPLETED") {
    await request(app)
      .post(`/api/trips/${tripId}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginTransit" });
  }

  if (targetStatus === "DELIVERY_PENDING" || targetStatus === "DELIVERED" || targetStatus === "COMPLETED") {
    await request(app)
      .post(`/api/trips/${tripId}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "markDeliveryPending" });
  }

  if (targetStatus === "DELIVERED" || targetStatus === "COMPLETED") {
    await request(app)
      .post(`/api/trips/${tripId}/inspections`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({
        type: "DELIVERY",
        photoUrls: ["https://example.com/delivery.jpg"],
        odometer: 20000,
        fuelLevel: 40,
        vehicleCondition: "Good",
        damageNotes: "No damage",
        observations: "Delivered successfully",
        handoverConfirmed: true,
      });

    await request(app)
      .post(`/api/trips/${tripId}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "confirmDelivery" });
  }

  if (targetStatus === "COMPLETED") {
    await request(app)
      .post(`/api/trips/${tripId}/transitions`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ action: "completeTrip" });
  }
}

beforeAll(async () => {
  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        in: [
          customer.email,
          driver.email,
          "admin-tracking-test@example.com",
          "rep-tracking-test@example.com",
        ],
      },
    },
  });
  const existingUserIds = existingUsers.map((u) => u.id);

  if (existingUserIds.length > 0) {
    await cleanupTrackedUsers(existingUserIds);
  }

  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["TRACK1234"] } } });

  const createdCustomer = await prisma.user.create({
    data: { email: customer.email, passwordHash: await hashPassword(customer.password), fullName: customer.fullName, role: customer.role },
  });
  const createdDriverUser = await prisma.user.create({
    data: { email: driver.email, passwordHash: await hashPassword(driver.password), fullName: driver.fullName, role: driver.role },
  });

  const driverProfile = await prisma.driver.create({ data: { userId: createdDriverUser.id, licenseNumber: "DRV-TRACK-001", verified: true } });
  const vehicleDetail = await prisma.vehicleDetail.create({ data: { make: "Nissan", model: "NP300", year: 2022, registrationNumber: "TRACK1234", color: "White" } });

  customerId = createdCustomer.id;
  driverId = driverProfile.id;
  driverUserId = createdDriverUser.id;
  vehicleDetailId = vehicleDetail.id;
});

afterAll(async () => {
  const extraUsers = await prisma.user.findMany({
    where: { email: { in: ["admin-tracking-test@example.com", "rep-tracking-test@example.com"] } },
    select: { id: true },
  });
  const extraUserIds = extraUsers.map((u) => u.id);

  await cleanupTrackedUsers([customerId, driverUserId, ...extraUserIds]);
  await prisma.vehicleDetail.deleteMany({ where: { id: vehicleDetailId } });
  await prisma.$disconnect();
});

describe("GPS location and trip milestones", () => {
  it("allows a verified driver to submit GPS updates during active transit and retrieve the last known location", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Thika", destination: "Nairobi", vehicleDetailId });
    expect(requestResp.status).toBe(201);
    const transportRequestId = requestResp.body.data.id;

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 15000, message: "GPS test quote" });
    expect(quoteResp.status).toBe(201);
    const quoteId = quoteResp.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip?.status).toBe("PAYMENT_PENDING");

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TRACK_001" });
    expect(paymentResp.status).toBe(201);

    await request(app)
      .post(`/api/payments/${paymentResp.body.data.id}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_TRACK_CB_001" });

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

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginTransit" });

    const gpsResp = await request(app)
      .post(`/api/trips/${trip?.id}/gps`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ latitude: -1.2921, longitude: 36.8219, accuracy: 10, timestamp: new Date().toISOString() });
    expect(gpsResp.status).toBe(201);
    expect(gpsResp.body.data.latitude).toBe(-1.2921);
    expect(gpsResp.body.data.longitude).toBe(36.8219);

    const lastResp = await request(app)
      .get(`/api/trips/${trip?.id}/gps/last`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(lastResp.status).toBe(200);
    expect(lastResp.body.data).toBeDefined();
    expect(lastResp.body.data.latitude).toBe(-1.2921);
    expect(lastResp.body.data.longitude).toBe(36.8219);

    const listResp = await request(app)
      .get(`/api/trips/${trip?.id}/gps`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(listResp.status).toBe(200);
    expect(Array.isArray(listResp.body.data)).toBe(true);
    expect(listResp.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it("allows drivers to record trip milestones and customers to view them", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Machakos", destination: "Nairobi", vehicleDetailId });
    expect(requestResp.status).toBe(201);
    const transportRequestId = requestResp.body.data.id;

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 14000, message: "Milestone test quote" });
    expect(quoteResp.status).toBe(201);
    const quoteId = quoteResp.body.data.id;

    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });
    expect(trip?.status).toBe("PAYMENT_PENDING");

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TRACK_002" });
    expect(paymentResp.status).toBe(201);
    await request(app)
      .post(`/api/payments/${paymentResp.body.data.id}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_TRACK_CB_002" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });

    const milestoneResp = await request(app)
      .post(`/api/trips/${trip?.id}/milestones`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ type: "PICKUP_COMPLETED", notes: "Pickup handover complete" });

    expect(milestoneResp.status).toBe(201);
    expect(milestoneResp.body.data.type).toBe("PICKUP_COMPLETED");
    expect(milestoneResp.body.data.notes).toBe("Pickup handover complete");
    expect(milestoneResp.body.data.createdById).toBeDefined();

    const listResp = await request(app)
      .get(`/api/trips/${trip?.id}/milestones`)
      .set("Authorization", `Bearer ${customerToken}`);
    expect(listResp.status).toBe(200);
    expect(Array.isArray(listResp.body.data)).toBe(true);
    expect(listResp.body.data.some((item: any) => item.type === "PICKUP_COMPLETED")).toBe(true);
  });

  it("prevents unauthorized users from submitting GPS or milestones and allows admin and reps to view them", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const adminUser = await prisma.user.create({
      data: { email: "admin-tracking-test@example.com", passwordHash: await hashPassword("AdminTracking123!"), fullName: "Admin Tracking", role: UserRole.ADMIN },
    });
    const adminTokenResp = await request(app).post("/api/auth/login").send({ email: adminUser.email, password: "AdminTracking123!" });
    const adminToken = adminTokenResp.body.data.token;

    const representativeUser = await prisma.user.create({
      data: { email: "rep-tracking-test@example.com", passwordHash: await hashPassword("RepTracking123!"), fullName: "Rep Tracking", role: UserRole.AUTHORIZED_REPRESENTATIVE },
    });
    await prisma.customerRepresentative.create({
      data: {
        customerId,
        representativeId: representativeUser.id,
        status: "ACTIVE",
      },
    });
    const repTokenResp = await request(app).post("/api/auth/login").send({ email: representativeUser.email, password: "RepTracking123!" });
    const repToken = repTokenResp.body.data.token;

    const trip = await createBookedTrip(customerToken, driverToken);
    expect(trip?.status).toBe("PAYMENT_PENDING");

    const unpaidGpsResp = await request(app)
      .post(`/api/trips/${trip?.id}/gps`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ latitude: -1.2921, longitude: 36.8219 });
    expect(unpaidGpsResp.status).toBe(400);

    const milestoneByCustomerResp = await request(app)
      .post(`/api/trips/${trip?.id}/milestones`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ type: "TRIP_STARTED" });
    expect(milestoneByCustomerResp.status).toBe(403);

    const milestoneByRepResp = await request(app)
      .post(`/api/trips/${trip?.id}/milestones`)
      .set("Authorization", `Bearer ${repToken}`)
      .send({ type: "TRIP_STARTED" });
    expect(milestoneByRepResp.status).toBe(403);

    const listGpsAdminResp = await request(app)
      .get(`/api/trips/${trip?.id}/gps`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(listGpsAdminResp.status).toBe(200);

    const listMilestonesAdminResp = await request(app)
      .get(`/api/trips/${trip?.id}/milestones`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(listMilestonesAdminResp.status).toBe(200);

    const listGpsRepResp = await request(app)
      .get(`/api/trips/${trip?.id}/gps`)
      .set("Authorization", `Bearer ${repToken}`);
    expect(listGpsRepResp.status).toBe(200);

    const listMilestonesRepResp = await request(app)
      .get(`/api/trips/${trip?.id}/milestones`)
      .set("Authorization", `Bearer ${repToken}`);
    expect(listMilestonesRepResp.status).toBe(200);
  });

  it("rejects invalid GPS and milestone values", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResp = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Mombasa", destination: "Kisumu", vehicleDetailId });
    const transportRequestId = requestResp.body.data.id;

    const quoteResp = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 16000, message: "Invalid payload quote" });
    const quoteId = quoteResp.body.data.id;
    await request(app).post(`/api/quotes/${quoteId}/select`).set("Authorization", `Bearer ${customerToken}`);
    const trip = await prisma.trip.findUnique({ where: { transportRequestId } });

    const paymentResp = await request(app)
      .post(`/api/trips/${trip?.id}/payments`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerReference: "MPESA_TRACK_003" });
    await request(app)
      .post(`/api/payments/${paymentResp.body.data.id}/confirm`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ providerCallbackReference: "MPESA_TRACK_CB_003" });

    await request(app)
      .post(`/api/trips/${trip?.id}/transitions`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ action: "beginPickup" });

    const invalidGpsResp = await request(app)
      .post(`/api/trips/${trip?.id}/gps`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ latitude: -100, longitude: 36.8219 });
    expect(invalidGpsResp.status).toBe(400);

    const invalidMilestoneResp = await request(app)
      .post(`/api/trips/${trip?.id}/milestones`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ type: "INVALID_TYPE" });
    expect(invalidMilestoneResp.status).toBe(400);
  });
});
