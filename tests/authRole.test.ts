import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";

jest.setTimeout(60000);

const adminUser = {
  email: "admin-test@example.com",
  password: "AdminPassword123!",
  fullName: "Admin Test",
  role: "ADMIN",
};

const customerUser = {
  email: "customer-test@example.com",
  password: "CustomerPassword123!",
  fullName: "Customer Test",
  role: "CUSTOMER",
};

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, customerUser.email] } } });
  await request(app).post("/api/auth/register").send(adminUser);
  await request(app).post("/api/auth/register").send(customerUser);
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, customerUser.email] } } });
  await prisma.$disconnect();
});

describe("Role authorization", () => {
  it("provides admin access to ADMIN role", async () => {
    await request(app).post("/api/auth/register").send(adminUser);
    const loginResponse = await request(app).post("/api/auth/login").send({ email: adminUser.email, password: adminUser.password });
    const token = loginResponse.body.data.token;

    const response = await request(app)
      .get("/api/auth/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("message", "admin access granted");
  });

  it("rejects non-admin access to admin route", async () => {
    const customerResponse = await request(app).post("/api/auth/login").send({ email: customerUser.email, password: customerUser.password });
    const token = customerResponse.body.data.token;

    const response = await request(app)
      .get("/api/auth/admin")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(403);
  });
});
