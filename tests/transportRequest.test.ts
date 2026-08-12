import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { UserRole } from "@prisma/client";
import { hashPassword } from "../src/services/authService";

jest.setTimeout(60000);

const customer = {
  email: "customer-transport-test@example.com",
  password: "CustomerTransport123!",
  fullName: "Customer Transport",
  role: UserRole.CUSTOMER,
};

const otherCustomer = {
  email: "other-customer-transport-test@example.com",
  password: "OtherCustomerTransport123!",
  fullName: "Other Customer Transport",
  role: UserRole.CUSTOMER,
};

const representative = {
  email: "rep-transport-test@example.com",
  password: "RepTransport123!",
  fullName: "Rep Transport",
  role: UserRole.AUTHORIZED_REPRESENTATIVE,
};

const revokedRepresentative = {
  email: "revoked-rep-test@example.com",
  password: "RevokedRep123!",
  fullName: "Revoked Rep",
  role: UserRole.AUTHORIZED_REPRESENTATIVE,
};

const driver = {
  email: "driver-transport-test@example.com",
  password: "DriverTransport123!",
  fullName: "Driver Transport",
  role: UserRole.DRIVER,
};

let customerId: string;
let otherCustomerId: string;
let representativeId: string;
let revokedRepresentativeId: string;
let vehicleDetailId: string;

beforeAll(async () => {
  jest.setTimeout(60000);

  const existingUsers = await prisma.user.findMany({
    where: {
      email: {
        in: [
          customer.email,
          otherCustomer.email,
          representative.email,
          revokedRepresentative.email,
          driver.email,
        ],
      },
    },
  });

  const existingUserIds = existingUsers.map((user) => user.id);
  if (existingUserIds.length > 0) {
    await prisma.transportRequest.deleteMany({
      where: {
        OR: [
          { customerId: { in: existingUserIds } },
          { authorizedRepresentativeId: { in: existingUserIds } },
        ],
      },
    });

    await prisma.customerRepresentative.deleteMany({
      where: {
        OR: [
          { customerId: { in: existingUserIds } },
          { representativeId: { in: existingUserIds } },
        ],
      },
    });
  }

  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          customer.email,
          otherCustomer.email,
          representative.email,
          revokedRepresentative.email,
          driver.email,
        ],
      },
    },
  });

  await prisma.vehicleDetail.deleteMany({ where: { registrationNumber: { in: ["ABC1234", "XYZ9999"] } } });

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

  await prisma.user.create({
    data: {
      email: driver.email,
      passwordHash: await hashPassword(driver.password),
      fullName: driver.fullName,
      role: driver.role,
    },
  });

  customerId = createdCustomer.id;
  otherCustomerId = createdOtherCustomer.id;
  representativeId = createdRepresentative.id;
  revokedRepresentativeId = createdRevokedRepresentative.id;

  const vehicleDetail = await prisma.vehicleDetail.create({
    data: {
      make: "Toyota",
      model: "Hilux",
      year: 2022,
      registrationNumber: "ABC1234",
      color: "White",
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
  await prisma.transportRequest.deleteMany({
    where: {
      OR: [
        { customerId },
        { customerId: otherCustomerId },
      ],
    },
  });

  await prisma.customerRepresentative.deleteMany({
    where: { customerId },
  });

  await prisma.user.deleteMany({
    where: {
      email: {
        in: [
          customer.email,
          otherCustomer.email,
          representative.email,
          revokedRepresentative.email,
          driver.email,
        ],
      },
    },
  });

  await prisma.vehicleDetail.deleteMany({ where: { id: vehicleDetailId } });
  await prisma.$disconnect();
});

describe("Transport Request module", () => {
  it("allows a customer to create a transport request", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: customer.email, password: customer.password });
    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ origin: "Nairobi", destination: "Mombasa", vehicleDetailId });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("status", "REQUESTED");
    expect(response.body.data).toHaveProperty("customerId", customerId);
    expect(response.body.data).not.toHaveProperty("passwordHash");
  });

  it("rejects transport request creation with invalid data", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: customer.email, password: customer.password });
    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ destination: "Mombasa" });

    expect(response.status).toBe(400);
  });

  it("rejects unauthorized users from creating a transport request", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: driver.email, password: driver.password });
    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ origin: "Nairobi", destination: "Mombasa", vehicleDetailId });

    expect(response.status).toBe(403);
  });

  it("prevents a customer from accessing another customer's transport request", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: otherCustomer.email, password: otherCustomer.password });
    const token = loginResponse.body.data.token;

    const createResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ origin: "Nakuru", destination: "Kisumu", vehicleDetailId });

    const otherRequestId = createResponse.body.data.id;

    const forbiddenResponse = await request(app)
      .get(`/api/transport-requests/${otherRequestId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(forbiddenResponse.status).toBe(200);

    const customer2Login = await request(app).post("/api/auth/login").send({ email: customer.email, password: customer.password });
    const customer2Token = customer2Login.body.data.token;

    const response = await request(app)
      .get(`/api/transport-requests/${otherRequestId}`)
      .set("Authorization", `Bearer ${customer2Token}`);

    expect(response.status).toBe(403);
  });

  it("allows an active authorized representative to create a transport request for a customer", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: representative.email, password: representative.password });
    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ customerId, origin: "Nairobi", destination: "Naivasha", vehicleDetailId });

    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("authorizedRepresentativeId", representativeId);
    expect(response.body.data).toHaveProperty("customerId", customerId);
  });

  it("rejects a revoked authorized representative from creating a transport request", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: revokedRepresentative.email, password: revokedRepresentative.password });
    const token = loginResponse.body.data.token;

    const response = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ customerId, origin: "Nairobi", destination: "Naivasha", vehicleDetailId });

    expect(response.status).toBe(403);
  });

  it("allows cancellation of a requested transport request", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: customer.email, password: customer.password });
    const token = loginResponse.body.data.token;

    const createResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ origin: "Thika", destination: "Nairobi", vehicleDetailId });

    const cancelResponse = await request(app)
      .post(`/api/transport-requests/${createResponse.body.data.id}/cancel`)
      .set("Authorization", `Bearer ${token}`);

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.data).toHaveProperty("status", "CANCELLED");
  });

  it("rejects cancellation when request status transition is invalid", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: customer.email, password: customer.password });
    const token = loginResponse.body.data.token;

    const createResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ origin: "Kitale", destination: "Kakamega", vehicleDetailId });

    await prisma.transportRequest.update({
      where: { id: createResponse.body.data.id },
      data: { status: "DRIVER_SELECTED" },
    });

    const cancelResponse = await request(app)
      .post(`/api/transport-requests/${createResponse.body.data.id}/cancel`)
      .set("Authorization", `Bearer ${token}`);

    expect(cancelResponse.status).toBe(400);
  });

  it("preserves the vehicle detail record after request creation", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: customer.email, password: customer.password });
    const token = loginResponse.body.data.token;

    const createResponse = await request(app)
      .post("/api/transport-requests")
      .set("Authorization", `Bearer ${token}`)
      .send({ origin: "Naivasha", destination: "Nakuru", vehicleDetailId });

    const vehicle = await prisma.vehicleDetail.findUnique({ where: { id: vehicleDetailId } });
    expect(vehicle).not.toBeNull();
    expect(vehicle?.registrationNumber).toBe("ABC1234");
    expect(createResponse.body.data.vehicleDetailId).toBe(vehicleDetailId);
  });
});
