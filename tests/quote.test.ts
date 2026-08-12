import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { UserRole } from "@prisma/client";
import { hashPassword } from "../src/services/authService";

jest.setTimeout(60000);

const customer = {
  email: "customer-quote-test@example.com",
  password: "CustomerQuote123!",
  fullName: "Customer Quote",
  role: UserRole.CUSTOMER,
};

const otherCustomer = {
  email: "other-customer-quote-test@example.com",
  password: "OtherCustomerQuote123!",
  fullName: "Other Customer Quote",
  role: UserRole.CUSTOMER,
};

const representative = {
  email: "rep-quote-test@example.com",
  password: "RepQuote123!",
  fullName: "Rep Quote",
  role: UserRole.AUTHORIZED_REPRESENTATIVE,
};

const revokedRepresentative = {
  email: "revoked-rep-quote-test@example.com",
  password: "RevokedRepQuote123!",
  fullName: "Revoked Rep Quote",
  role: UserRole.AUTHORIZED_REPRESENTATIVE,
};

const driver = {
  email: "driver-quote-test@example.com",
  password: "DriverQuote123!",
  fullName: "Driver Quote",
  role: UserRole.DRIVER,
};

const otherDriver = {
  email: "other-driver-quote-test@example.com",
  password: "OtherDriverQuote123!",
  fullName: "Other Driver Quote",
  role: UserRole.DRIVER,
};

let customerId: string;
let otherCustomerId: string;
let representativeId: string;
let revokedRepresentativeId: string;
let driverId: string;
let otherDriverId: string;
let vehicleDetailId: string;

async function loginToken(email: string, password: string) {
  const response = await request(app).post("/api/auth/login").send({ email, password });
  return response.body.data.token;
}

beforeAll(async () => {
  const emails = [
    customer.email,
    otherCustomer.email,
    representative.email,
    revokedRepresentative.email,
    driver.email,
    otherDriver.email,
  ];

  const existingUsers = await prisma.user.findMany({ where: { email: { in: emails } } });
  const existingUserIds = existingUsers.map((user) => user.id);

  if (existingUserIds.length > 0) {
    await prisma.driverQuote.deleteMany({
      where: { driver: { userId: { in: existingUserIds } } },
    });

    await prisma.payment.deleteMany({
      where: { customerId: { in: existingUserIds } },
    });

    await prisma.trip.deleteMany({
      where: { customerId: { in: existingUserIds } },
    });

    await prisma.transportRequest.deleteMany({
      where: { OR: [{ customerId: { in: existingUserIds } }, { authorizedRepresentativeId: { in: existingUserIds } }] },
    });

    await prisma.customerRepresentative.deleteMany({
      where: { OR: [{ customerId: { in: existingUserIds } }, { representativeId: { in: existingUserIds } }] },
    });

    await prisma.driver.deleteMany({ where: { userId: { in: existingUserIds } } });
    await prisma.user.deleteMany({ where: { id: { in: existingUserIds } } });
  }

  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["QUOTE1234", "QUOTE9999"] } } });

  const createdCustomer = await prisma.user.create({
    data: {
      email: customer.email,
      passwordHash: await hashPassword(customer.password),
      fullName: customer.fullName,
      role: customer.role,
    },
  });

  const createdOtherCustomer = await prisma.user.create({
    data: {
      email: otherCustomer.email,
      passwordHash: await hashPassword(otherCustomer.password),
      fullName: otherCustomer.fullName,
      role: otherCustomer.role,
    },
  });

  const createdRepresentative = await prisma.user.create({
    data: {
      email: representative.email,
      passwordHash: await hashPassword(representative.password),
      fullName: representative.fullName,
      role: representative.role,
    },
  });

  const createdRevokedRepresentative = await prisma.user.create({
    data: {
      email: revokedRepresentative.email,
      passwordHash: await hashPassword(revokedRepresentative.password),
      fullName: revokedRepresentative.fullName,
      role: revokedRepresentative.role,
    },
  });

  const createdDriver = await prisma.user.create({
    data: {
      email: driver.email,
      passwordHash: await hashPassword(driver.password),
      fullName: driver.fullName,
      role: driver.role,
    },
  });

  const createdOtherDriver = await prisma.user.create({
    data: {
      email: otherDriver.email,
      passwordHash: await hashPassword(otherDriver.password),
      fullName: otherDriver.fullName,
      role: otherDriver.role,
    },
  });

  const driverProfile = await prisma.driver.create({
    data: {
      userId: createdDriver.id,
      licenseNumber: "DRV-001",
      verified: true,
    },
  });

  const otherDriverProfile = await prisma.driver.create({
    data: {
      userId: createdOtherDriver.id,
      licenseNumber: "DRV-002",
      verified: true,
    },
  });

  customerId = createdCustomer.id;
  otherCustomerId = createdOtherCustomer.id;
  representativeId = createdRepresentative.id;
  revokedRepresentativeId = createdRevokedRepresentative.id;
  driverId = driverProfile.id;
  otherDriverId = otherDriverProfile.id;

  const vehicleDetail = await prisma.vehicleDetail.create({
    data: {
      make: "Nissan",
      model: "Navara",
      year: 2023,
      registrationNumber: "QUOTE1234",
      color: "Blue",
    },
  });

  vehicleDetailId = vehicleDetail.id;

  await prisma.customerRepresentative.create({
    data: {
      customerId,
      representativeId,
      status: "ACTIVE",
    },
  });

  await prisma.customerRepresentative.create({
    data: {
      customerId,
      representativeId: revokedRepresentativeId,
      status: "REVOKED",
      revokedAt: new Date(),
    },
  });
});

afterAll(async () => {
  await prisma.driverQuote.deleteMany({
    where: { OR: [{ driverId }, { driverId: otherDriverId }] },
  });

  await prisma.payment.deleteMany({
    where: {
      customerId: { in: [customerId, otherCustomerId] },
    },
  });

  await prisma.walletTransaction.deleteMany({ where: { tripWallet: { trip: { customerId: { in: [customerId, otherCustomerId] } } } } });
  await prisma.tripWallet.deleteMany({ where: { trip: { customerId: { in: [customerId, otherCustomerId] } } } });
  await prisma.trip.deleteMany({ where: { customerId: { in: [customerId, otherCustomerId] } } });

  await prisma.transportRequest.deleteMany({
    where: {
      OR: [{ customerId }, { customerId: otherCustomerId }],
    },
  });

  await prisma.customerRepresentative.deleteMany({ where: { customerId } });
  await prisma.driver.deleteMany({ where: { id: { in: [driverId, otherDriverId] } } });
  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          customer.email,
          otherCustomer.email,
          representative.email,
          revokedRepresentative.email,
          driver.email,
          otherDriver.email,
        ],
      },
    },
  });

  await prisma.vehicleDetail.deleteMany({ where: { id: vehicleDetailId } });
  await prisma.$disconnect();
});

describe("Quoting and driver selection", () => {
  it("allows a verified driver to create a valid quote", async () => {
    const token = await loginToken(driver.email, driver.password);
    const createRequestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ origin: "Nairobi", destination: "Mombasa", vehicleDetailId });

    expect(createRequestResponse.status).toBe(403);

    const customerToken = await loginToken(customer.email, customer.password);
    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nairobi", destination: "Mombasa", vehicleDetailId });

    expect(requestResponse.status).toBe(201);
    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 25000, message: "Ready to transport safely" });

    expect(quoteResponse.status).toBe(201);
    expect(quoteResponse.body.data).toHaveProperty("transportRequestId", transportRequestId);
    expect(quoteResponse.body.data).toHaveProperty("driverId", driverId);
    expect(quoteResponse.body.data).toHaveProperty("amount", 25000);
  });

  it("prevents a driver from submitting a quote using another driver identity", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nakuru", destination: "Kisumu", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;
    const token = await loginToken(driver.email, driver.password);

    const response = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 22000, driverId: otherDriverId, message: "Driver impersonation attempt" });

    expect(response.status).toBe(201);
    expect(response.body.data.driverId).toBe(driverId);
    expect(response.body.data.driverId).not.toBe(otherDriverId);
  });

  it("rejects a quote on a cancelled request", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nyeri", destination: "Nairobi", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;
    await prisma.transportRequest.update({ where: { id: transportRequestId }, data: { status: "CANCELLED" } });

    const token = await loginToken(driver.email, driver.password);
    const response = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${token}`)
      .send({ amount: 20000, message: "Cannot quote cancelled" });

    expect(response.status).toBe(400);
  });

  it("allows a customer to view quotes for their own request", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Thika", destination: "Nakuru", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 23000, message: "Reliable driver" });

    expect(quoteResponse.status).toBe(201);

    const listResponse = await request(app)
      .get(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body.data)).toBe(true);
    expect(listResponse.body.data[0]).toHaveProperty("amount", 23000);
  });

  it("prevents a customer from viewing another customer's quotes", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const otherToken = await loginToken(otherCustomer.email, otherCustomer.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Eldoret", destination: "Kitale", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;
    const driverToken = await loginToken(driver.email, driver.password);

    await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 21000, message: "Competitive bid" });

    const listResponse = await request(app)
      .get(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(listResponse.status).toBe(403);
  });

  it("allows an authorized representative to view quotes for their customer", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const repToken = await loginToken(representative.email, representative.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Kajiado", destination: "Nairobi", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 24000, message: "Experienced driver" });

    expect(quoteResponse.status).toBe(201);

    const listResponse = await request(app)
      .get(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${repToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.data.length).toBeGreaterThan(0);
  });

  it("rejects an unauthorized representative from viewing quotes", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const revokedRepToken = await loginToken(revokedRepresentative.email, revokedRepresentative.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Thika", destination: "Nakuru", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 22500, message: "Safe transport" });

    const response = await request(app)
      .get(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${revokedRepToken}`);

    expect(response.status).toBe(403);
  });

  it("allows a customer to select an eligible quote and updates request status", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Malindi", destination: "Mombasa", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 26000, message: "Fast and reliable" });

    const quoteId = quoteResponse.body.data.id;

    const selectResponse = await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(selectResponse.status).toBe(200);
    expect(selectResponse.body.data).toHaveProperty("status", "SELECTED");

    const requestAfterSelection = await prisma.transportRequest.findUnique({ where: { id: transportRequestId } });
    expect(requestAfterSelection?.status).toBe("DRIVER_SELECTED");
  });

  it("rejects selection of a quote belonging to another request", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const firstRequestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Mombasa", destination: "Nairobi", vehicleDetailId });
    const firstRequestId = firstRequestResponse.body.data.id;

    const secondRequestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nakuru", destination: "Eldoret", vehicleDetailId });
    const secondRequestId = secondRequestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${secondRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 27000, message: "Another quote" });

    const quoteId = quoteResponse.body.data.id;

    const response = await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${customerToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data.transportRequestId).toBe(secondRequestId);
    expect(response.body.data.status).toBe("SELECTED");
  });

  it("rejects invalid quote data", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Nakuru", destination: "Mombasa", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const response = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: -100, message: "Invalid amount" });

    expect(response.status).toBe(400);
  });

  it("prevents duplicate quote submissions from the same driver", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Murang'a", destination: "Nairobi", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const firstQuoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 28000, message: "First quote" });

    expect(firstQuoteResponse.status).toBe(201);

    const secondQuoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 29000, message: "Duplicate quote" });

    expect(secondQuoteResponse.status).toBe(409);
  });

  it("prevents unauthorized users from selecting quotes", async () => {
    const customerToken = await loginToken(customer.email, customer.password);
    const otherCustomerToken = await loginToken(otherCustomer.email, otherCustomer.password);
    const driverToken = await loginToken(driver.email, driver.password);

    const requestResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${customerToken}`)
      .send({ origin: "Kitale", destination: "Eldoret", vehicleDetailId });

    const transportRequestId = requestResponse.body.data.id;

    const quoteResponse = await request(app)
      .post(`/api/transport-requests/${transportRequestId}/quotes`)
      .set("Authorization", `Bearer ${driverToken}`)
      .send({ amount: 24000, message: "Unauthorized selection test" });

    const quoteId = quoteResponse.body.data.id;

    const selectResponse = await request(app)
      .post(`/api/quotes/${quoteId}/select`)
      .set("Authorization", `Bearer ${otherCustomerToken}`);

    expect(selectResponse.status).toBe(403);
  });
});
