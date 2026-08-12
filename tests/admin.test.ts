import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { UserRole, DriverVerificationStatus, AccountStatus } from "@prisma/client";
import { hashPassword } from "../src/services/authService";
import { ADMIN_CAPABILITIES, assertAdminCapability, getUserAdmin, listUsersAdmin } from "../src/services/adminService";
import { requireAdminCapability } from "../src/middleware/adminMiddleware";

jest.setTimeout(60000);

const admin = {
  email: "admin-stage12@example.com",
  password: "Stage12Admin123!",
  fullName: "Admin Stage12",
  role: UserRole.ADMIN,
};

const customer = {
  email: "customer-stage12@example.com",
  password: "CustomerStage123!",
  fullName: "Customer Stage12",
  role: UserRole.CUSTOMER,
};

const driverUser = {
  email: "driver-stage12@example.com",
  password: "DriverStage123!",
  fullName: "Driver Stage12",
  role: UserRole.DRIVER,
};

let adminToken: string;
let customerToken: string;
let driverToken: string;
let testDriverId: string;
let testUserId: string;
let tripId: string;
let paymentId: string;

async function loginToken(email: string, password: string) {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.data.token;
}

beforeAll(async () => {
  await prisma.auditLog.deleteMany({ where: { action: { contains: "admin" } } });
  await prisma.platformSetting.deleteMany({});
  await prisma.walletTransaction.deleteMany({});
  await prisma.tripWallet.deleteMany({});
  await prisma.driverWallet.deleteMany({});
  await prisma.refund.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.dispute.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.transportRequest.deleteMany({});
  await prisma.driverQuote.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["ADM-TRIP-001", "DISPUTE1234", "DRV-ADMIN-001"] } } });
  await prisma.user.deleteMany({ where: { email: { in: [admin.email, customer.email, driverUser.email] } } });

  const adminUser = await prisma.user.create({
    data: {
      email: admin.email,
      passwordHash: await hashPassword(admin.password),
      fullName: admin.fullName,
      role: admin.role,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      email: customer.email,
      passwordHash: await hashPassword(customer.password),
      fullName: customer.fullName,
      role: customer.role,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  const createdDriverUser = await prisma.user.create({
    data: {
      email: driverUser.email,
      passwordHash: await hashPassword(driverUser.password),
      fullName: driverUser.fullName,
      role: driverUser.role,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  const driver = await prisma.driver.create({
    data: {
      userId: createdDriverUser.id,
      licenseNumber: "DRV-ADMIN-001",
      verified: false,
      verificationStatus: DriverVerificationStatus.PENDING,
    },
  });

  testDriverId = driver.id;
  testUserId = customerUser.id;

  adminToken = await loginToken(admin.email, admin.password);
  customerToken = await loginToken(customer.email, customer.password);
  driverToken = await loginToken(driverUser.email, driverUser.password);

  const vehicle = await prisma.vehicleDetail.create({
    data: {
      make: "Toyota",
      model: "Hiace",
      year: 2024,
      registrationNumber: "ADM-TRIP-001",
      color: "Silver",
    },
  });

  const transportRequest = await prisma.transportRequest.create({
    data: {
      customerId: customerUser.id,
      vehicleDetailId: vehicle.id,
      origin: "Nairobi",
      destination: "Mombasa",
      status: "BOOKED",
    },
  });

  const trip = await prisma.trip.create({
    data: {
      transportRequestId: transportRequest.id,
      customerId: customerUser.id,
      driverId: driver.id,
      vehicleDetailId: vehicle.id,
      status: "BOOKED",
      bookingAmount: 25000,
      driverFee: 20000,
      carGoFee: 5000,
    },
  });

  tripId = trip.id;

  const payment = await prisma.payment.create({
    data: {
      tripId: trip.id,
      customerId: customerUser.id,
      amount: 25000,
      status: "CONFIRMED",
      providerReference: "admin-payment-ref-001",
    },
  });

  paymentId = payment.id;

  await prisma.tripWallet.create({
    data: {
      tripId: trip.id,
      customerPaymentAmount: payment.amount,
      refundAmount: 0,
      driverFee: trip.driverFee,
      fuelBudget: trip.fuelBudget ?? 0,
      carGoFee: trip.carGoFee ?? 0,
      driverAmountReleased: 0,
      driverAmountRemaining: trip.driverFee,
    },
  });

  await prisma.driverWallet.create({
    data: {
      driverId: driver.id,
      availableBalance: 0,
      pendingBalance: 0,
      totalEarned: 0,
    },
  });
});

afterAll(async () => {
  await prisma.auditLog.deleteMany({ where: { action: { contains: "admin" } } });
  await prisma.platformSetting.deleteMany({});
  await prisma.walletTransaction.deleteMany({});
  await prisma.tripWallet.deleteMany({});
  await prisma.driverWallet.deleteMany({});
  await prisma.refund.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.dispute.deleteMany({});
  await prisma.trip.deleteMany({});
  await prisma.transportRequest.deleteMany({});
  await prisma.driverQuote.deleteMany({});
  await prisma.driver.deleteMany({});
  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["ADM-TRIP-001", "DISPUTE1234", "DRV-ADMIN-001"] } } });
  await prisma.user.deleteMany({ where: { email: { in: [admin.email, customer.email, driverUser.email] } } });
  await prisma.$disconnect();
});

describe("Stage 12 Admin operations", () => {
  it("requires ADMIN for admin endpoints and blocks customer/driver access", async () => {
    const adminResponse = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${adminToken}`);
    expect(adminResponse.status).toBe(200);

    const customerResponse = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${customerToken}`);
    expect(customerResponse.status).toBe(403);

    const driverResponse = await request(app).get("/api/admin/users").set("Authorization", `Bearer ${driverToken}`);
    expect(driverResponse.status).toBe(403);

    const missingAuthResponse = await request(app).get("/api/admin/users");
    expect(missingAuthResponse.status).toBe(401);
  });

  it("lists pending drivers and approves a driver with an audit record", async () => {
    const listResponse = await request(app).get("/api/admin/drivers").set("Authorization", `Bearer ${adminToken}`);
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body.data)).toBe(true);

    const approveResponse = await request(app)
      .patch(`/api/admin/drivers/${testDriverId}/approve`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ reason: "Documentation verified" });

    expect(approveResponse.status).toBe(200);
    expect(approveResponse.body.data.verificationStatus).toBe("APPROVED");
    expect(approveResponse.body.data.verified).toBe(true);

    const auditText = await prisma.auditLog.findFirst({
      where: { entity: "Driver", entityId: testDriverId, action: "DRIVER_APPROVED" },
    });
    expect(auditText).not.toBeNull();
  });

  it("supports driver suspension and reactivation", async () => {
    const suspendResponse = await request(app)
      .patch(`/api/admin/drivers/${testDriverId}/suspend`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ reason: "Policy review" });
    expect(suspendResponse.status).toBe(200);
    expect(suspendResponse.body.data.verificationStatus).toBe("SUSPENDED");
    expect(suspendResponse.body.data.verified).toBe(false);

    const reactivateResponse = await request(app)
      .patch(`/api/admin/drivers/${testDriverId}/reactivate`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ reason: "Review complete" });
    expect(reactivateResponse.status).toBe(200);
    expect(reactivateResponse.body.data.verificationStatus).toBe("APPROVED");
    expect(reactivateResponse.body.data.verified).toBe(true);
  });

  it("allows admin user listing and account suspension/reactivation", async () => {
    const listResponse = await request(app).get("/api/admin/users?search=stage12").set("Authorization", `Bearer ${adminToken}`);
    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.length).toBeGreaterThan(0);

    const suspendResponse = await request(app)
      .patch(`/api/admin/users/${testUserId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ accountStatus: "SUSPENDED", reason: "Manual review" });

    expect(suspendResponse.status).toBe(200);
    expect(suspendResponse.body.data.accountStatus).toBe("SUSPENDED");

    const reactivateResponse = await request(app)
      .patch(`/api/admin/users/${testUserId}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ accountStatus: "ACTIVE", reason: "Review cleared" });

    expect(reactivateResponse.status).toBe(200);
    expect(reactivateResponse.body.data.accountStatus).toBe("ACTIVE");
  });

  it("provides trip, payment and wallet oversight for admins while rejecting non-admin access", async () => {
    const tripList = await request(app).get("/api/admin/trips?status=BOOKED").set("Authorization", `Bearer ${adminToken}`);
    expect(tripList.status).toBe(200);
    expect(Array.isArray(tripList.body.data)).toBe(true);

    const tripDetail = await request(app).get(`/api/admin/trips/${tripId}`).set("Authorization", `Bearer ${adminToken}`);
    expect(tripDetail.status).toBe(200);
    expect(tripDetail.body.data.id).toBe(tripId);

    const paymentList = await request(app).get("/api/admin/payments?status=CONFIRMED").set("Authorization", `Bearer ${adminToken}`);
    expect(paymentList.status).toBe(200);
    expect(Array.isArray(paymentList.body.data)).toBe(true);

    const paymentDetail = await request(app).get(`/api/admin/payments/${paymentId}`).set("Authorization", `Bearer ${adminToken}`);
    expect(paymentDetail.status).toBe(200);
    expect(paymentDetail.body.data.id).toBe(paymentId);

    const walletList = await request(app).get("/api/admin/wallet-transactions").set("Authorization", `Bearer ${adminToken}`);
    expect(walletList.status).toBe(200);
    expect(Array.isArray(walletList.body.data)).toBe(true);

    const customerTripResponse = await request(app).get("/api/admin/trips").set("Authorization", `Bearer ${customerToken}`);
    expect(customerTripResponse.status).toBe(403);
  });

  it("supports configuration updates and audit records", async () => {
    const getConfig = await request(app).get("/api/admin/config").set("Authorization", `Bearer ${adminToken}`);
    expect(getConfig.status).toBe(200);
    expect(Array.isArray(getConfig.body.data)).toBe(true);

    const setConfig = await request(app)
      .patch("/api/admin/config/driverVerificationRequired")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ value: "true", description: "Require driver verification before assignment" });

    expect(setConfig.status).toBe(200);
    expect(setConfig.body.data.key).toBe("driverVerificationRequired");

    const audit = await prisma.auditLog.findFirst({
      where: { action: "CONFIGURATION_UPDATED" },
    });
    expect(audit).not.toBeNull();
  });

  it("keeps dispute resolution audited and admin-only", async () => {
    const dispute = await prisma.dispute.create({
      data: {
        tripId,
        customerId: testUserId,
        raisedById: testUserId,
        raisedByRole: UserRole.CUSTOMER,
        description: "Admin dispute audit test",
        status: "OPEN",
      },
    });

    const customerResolution = await request(app)
      .patch(`/api/admin/disputes/${dispute.id}`)
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ status: "RESOLVED", resolutionType: "NO_ACTION", resolutionSummary: "Customer should not resolve" });
    expect(customerResolution.status).toBe(403);

    const adminResolution = await request(app)
      .patch(`/api/admin/disputes/${dispute.id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "RESOLVED", resolutionType: "NO_ACTION", resolutionSummary: "Administrative review complete" });

    expect(adminResolution.status).toBe(200);
    const audit = await prisma.auditLog.findFirst({
      where: { entity: "Dispute", entityId: dispute.id, action: "DISPUTE_RESOLVED" },
    });
    expect(audit).not.toBeNull();
  });

  it("enforces admin capability checks in middleware and service entry points", async () => {
    const adminUser = await prisma.user.findUnique({ where: { email: admin.email } });
    expect(adminUser).not.toBeNull();

    const next = jest.fn();
    await requireAdminCapability(ADMIN_CAPABILITIES.USER_MANAGEMENT)({
      user: { userId: adminUser!.id, role: UserRole.ADMIN },
    } as any, {} as any, next);
    expect(next).toHaveBeenCalledTimes(1);

    await expect(assertAdminCapability({ userId: adminUser!.id, role: UserRole.ADMIN }, ADMIN_CAPABILITIES.USER_MANAGEMENT)).resolves.toMatchObject({
      id: adminUser!.id,
      role: UserRole.ADMIN,
    });

    await expect(assertAdminCapability({ userId: adminUser!.id, role: UserRole.ADMIN }, "INVALID_CAPABILITY" as any)).rejects.toThrow("Unsupported admin capability");

    await prisma.user.update({ where: { id: adminUser!.id }, data: { accountStatus: AccountStatus.SUSPENDED } });
    await expect(assertAdminCapability({ userId: adminUser!.id, role: UserRole.ADMIN }, ADMIN_CAPABILITIES.USER_MANAGEMENT)).rejects.toThrow("Admin account is not active");
    await prisma.user.update({ where: { id: adminUser!.id }, data: { accountStatus: AccountStatus.ACTIVE } });

    await expect(listUsersAdmin({}, { userId: adminUser!.id, role: UserRole.ADMIN })).resolves.toEqual(expect.any(Array));
    await expect(getUserAdmin(testUserId, { userId: adminUser!.id, role: UserRole.ADMIN })).resolves.toMatchObject({ id: testUserId });
  });
});
