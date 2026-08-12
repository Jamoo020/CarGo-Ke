import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { UserRole, TripStatus } from "@prisma/client";
import { hashPassword } from "../src/services/authService";

jest.setTimeout(60000);

const customer = {
  email: "customer-dispute-test@example.com",
  password: "CustomerDispute123!",
  fullName: "Customer Dispute",
  role: UserRole.CUSTOMER,
};

const driver = {
  email: "driver-dispute-test@example.com",
  password: "DriverDispute123!",
  fullName: "Driver Dispute",
  role: UserRole.DRIVER,
};

const admin = {
  email: "admin-dispute-test@example.com",
  password: "AdminDispute123!",
  fullName: "Admin Dispute",
  role: UserRole.ADMIN,
};

let customerId: string;
let driverId: string;
let vehicleDetailId: string;
let tripId: string;

async function loginToken(email: string, password: string) {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.data.token;
}

async function setTripToEligibleState() {
  await prisma.trip.update({ where: { id: tripId }, data: { status: TripStatus.BOOKED } });
  await prisma.transportRequest.update({
    where: { id: (await prisma.trip.findUnique({ where: { id: tripId } }))!.transportRequestId },
    data: { status: TripStatus.BOOKED },
  });
}

beforeAll(async () => {
  const emails = [customer.email, driver.email, admin.email];
  const existingUsers = await prisma.user.findMany({ where: { email: { in: emails } } });
  const existingUserIds = existingUsers.map((user) => user.id);

  if (existingUserIds.length > 0) {
    await prisma.walletTransaction.deleteMany({ where: { OR: [{ tripWallet: { trip: { customerId: { in: existingUserIds } } } }, { driverWallet: { driver: { userId: { in: existingUserIds } } } }] } });
    await prisma.tripWallet.deleteMany({ where: { trip: { customerId: { in: existingUserIds } } } });
    await prisma.driverWallet.deleteMany({ where: { driver: { userId: { in: existingUserIds } } } });
    await prisma.refund.deleteMany({ where: { payment: { customerId: { in: existingUserIds } } } });
    await prisma.payment.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.cancellation.deleteMany({ where: { initiatedById: { in: existingUserIds } } });
    await prisma.dispute.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.trip.deleteMany({ where: { customerId: { in: existingUserIds } } });
    await prisma.driverQuote.deleteMany({ where: { transportRequest: { OR: [{ customerId: { in: existingUserIds } }, { authorizedRepresentativeId: { in: existingUserIds } }] } } });
    await prisma.transportRequest.deleteMany({ where: { OR: [{ customerId: { in: existingUserIds } }, { authorizedRepresentativeId: { in: existingUserIds } }] } });
    await prisma.driver.deleteMany({ where: { userId: { in: existingUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: existingUserIds } } });
  }

  const createdCustomer = await prisma.user.create({
    data: { email: customer.email, passwordHash: await hashPassword(customer.password), fullName: customer.fullName, role: customer.role },
  });

  const createdDriverUser = await prisma.user.create({
    data: { email: driver.email, passwordHash: await hashPassword(driver.password), fullName: driver.fullName, role: driver.role },
  });

  const createdAdminUser = await prisma.user.create({
    data: { email: admin.email, passwordHash: await hashPassword(admin.password), fullName: admin.fullName, role: admin.role },
  });

  const driverProfile = await prisma.driver.create({ data: { userId: createdDriverUser.id, licenseNumber: "DRV-DISPUTE-001", verified: true } });
  const vehicleDetail = await prisma.vehicleDetail.create({ data: { make: "Toyota", model: "Corolla", year: 2023, registrationNumber: "DISPUTE1234", color: "Black" } });

  customerId = createdCustomer.id;
  driverId = driverProfile.id;
  vehicleDetailId = vehicleDetail.id;

  expect(createdAdminUser).not.toBeNull();
});

afterAll(async () => {
  await prisma.walletTransaction.deleteMany({ where: { OR: [{ tripWallet: { trip: { customerId } } }, { driverWallet: { driverId } }] } });
  await prisma.refund.deleteMany({ where: { customerId } });
  await prisma.payment.deleteMany({ where: { customerId } });
  await prisma.tripWallet.deleteMany({ where: { trip: { customerId } } });
  await prisma.driverWallet.deleteMany({ where: { driverId } });
  await prisma.cancellation.deleteMany({ where: { initiatedById: customerId } });
  await prisma.dispute.deleteMany({ where: { customerId } });
  await prisma.trip.deleteMany({ where: { customerId } });
  await prisma.driverQuote.deleteMany({ where: { transportRequest: { customerId } } });
  await prisma.transportRequest.deleteMany({ where: { customerId } });
  await prisma.driver.deleteMany({ where: { id: driverId } });
  await prisma.user.deleteMany({ where: { email: { in: [customer.email, driver.email, admin.email] } } });
  await prisma.vehicleDetail.deleteMany({ where: { id: vehicleDetailId } });
  await prisma.$disconnect();
});

describe("Disputes", () => {
  beforeEach(async () => {
    const transportRequest = await prisma.transportRequest.create({
      data: {
        customerId,
        vehicleDetailId,
        origin: "Nairobi",
        destination: "Mombasa",
      },
    });

    const quote = await prisma.driverQuote.create({
      data: {
        transportRequestId: transportRequest.id,
        driverId,
        amount: 25000,
        message: "Dispute test quote",
      },
    });

    await prisma.driverQuote.update({ where: { id: quote.id }, data: { status: "SELECTED" } });

    const trip = await prisma.trip.create({
      data: {
        transportRequestId: transportRequest.id,
        customerId,
        driverId,
        vehicleDetailId,
        status: TripStatus.PAYMENT_PENDING,
        bookingAmount: 25000,
        driverFee: 20000,
        carGoFee: 5000,
      },
    });

    tripId = trip.id;
  });

  it("allows a customer to open a dispute on a trip", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    await setTripToEligibleState();

    const response = await request(app)
      .post(`/api/trips/${tripId}/disputes`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ description: "Vehicle condition was poor", category: "VEHICLE_CONDITION", priority: "HIGH" });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe("OPEN");
    expect(response.body.data.tripId).toBe(tripId);
    expect(response.body.data.category).toBe("VEHICLE_CONDITION");
    expect(response.body.data.description).toBe("Vehicle condition was poor");
    expect(response.body.data.priority).toBe("HIGH");

    const dispute = await prisma.dispute.findUnique({ where: { tripId } });
    expect(dispute).not.toBeNull();
    expect(dispute?.description).toBe("Vehicle condition was poor");
    expect(dispute?.category).toBe("VEHICLE_CONDITION");
    expect(dispute?.priority).toBe("HIGH");
    expect(dispute?.raisedByRole).toBe(UserRole.CUSTOMER);

    const updatedTrip = await prisma.trip.findUnique({ where: { id: tripId } });
    expect(updatedTrip?.status).toBe(TripStatus.DISPUTED);
  });

  it("rejects unauthorized dispute creation and invalid input", async () => {
    const driverToken = await loginToken(driver.email, driver.password);
    await setTripToEligibleState();

    const unauthorizedResponse = await request(app)
      .post(`/api/trips/${tripId}/disputes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ description: "Driver should not open this dispute" });

    expect(unauthorizedResponse.status).toBe(403);

    const invalidResponse = await request(app)
      .post(`/api/trips/${tripId}/disputes`)
      .set("Authorization", `Bearer ${await loginToken(customer.email, customer.password)}`)
      .send({ category: "PAYMENT" });

    expect(invalidResponse.status).toBe(400);
  });

  it("rejects nonexistent trips and prevents duplicate disputes", async () => {
    const customerToken = await loginToken(customer.email, customer.password);

    const missingTripResponse = await request(app)
      .post("/api/trips/nonexistent/disputes")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ description: "Missing trip dispute" });

    expect(missingTripResponse.status).toBe(404);

    await setTripToEligibleState();

    const firstResponse = await request(app)
      .post(`/api/trips/${tripId}/disputes`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ description: "First dispute" });

    expect(firstResponse.status).toBe(201);

    const duplicateResponse = await request(app)
      .post(`/api/trips/${tripId}/disputes`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ description: "Second dispute" });

    expect(duplicateResponse.status).toBe(409);
  });

  it("supports admin retrieval and resolution while rejecting non-admin resolution", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const adminToken = await loginToken(admin.email, admin.password);
    await setTripToEligibleState();

    const createResponse = await request(app)
      .post(`/api/trips/${tripId}/disputes`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ description: "Payment issue", category: "PAYMENT", priority: "NORMAL" });

    expect(createResponse.status).toBe(201);
    const disputeId = createResponse.body.data.id;

    const fetchResponse = await request(app)
      .get(`/api/disputes/${disputeId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(fetchResponse.status).toBe(200);
    expect(fetchResponse.body.data.id).toBe(disputeId);

    const nonAdminResolveResponse = await request(app)
      .patch(`/api/disputes/${disputeId}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ status: "RESOLVED", resolutionType: "FULL_REFUND", resolutionAmount: 25000, resolutionSummary: "Refund issued" });

    expect(nonAdminResolveResponse.status).toBe(403);

    // Create a confirmed payment and trip wallet so refund processing can occur
    await prisma.payment.create({ data: { tripId, customerId, amount: 25000, status: "CONFIRMED" } });
    await prisma.tripWallet.create({ data: { tripId, customerPaymentAmount: 25000, refundAmount: 0, driverAmountReleased: 0, driverAmountRemaining: 20000 } });

    const adminResolveResponse = await request(app)
      .patch(`/api/disputes/${disputeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "RESOLVED", resolutionType: "FULL_REFUND", resolutionAmount: 25000, resolutionSummary: "Refund issued" });

    expect(adminResolveResponse.status).toBe(200);
    expect(adminResolveResponse.body.data.status).toBe("RESOLVED");
    expect(adminResolveResponse.body.data.resolutionType).toBe("FULL_REFUND");

    const dispute = await prisma.dispute.findUnique({ where: { id: disputeId } });
    expect(dispute?.resolutionAmount).toBe(25000);
    expect(dispute?.resolutionSummary).toBe("Refund issued");
  });
});
