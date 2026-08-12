import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";
import { config } from "../src/config";
import { hashPassword } from "../src/services/authService";

const testUser = {
  email: "test-user@example.com",
  password: "Password123!",
  fullName: "Test User",
  role: "CUSTOMER",
};

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  await prisma.$disconnect();
});

describe("Authentication", () => {
  it("rejects malformed registration payloads", async () => {
    const response = await request(app).post("/api/auth/register").send({ email: "no-password@example.com" });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("registers a new user and stores bcrypt hash", async () => {
    const response = await request(app).post("/api/auth/register").send(testUser);
    expect(response.status).toBe(201);
    expect(response.body.data).toHaveProperty("email", testUser.email);
    expect(response.body.data).not.toHaveProperty("passwordHash");

    const user = await prisma.user.findUnique({ where: { email: testUser.email } });
    expect(user).not.toBeNull();
    expect(user?.passwordHash).toBeDefined();
    expect(user?.passwordHash).not.toBe(testUser.password);
  });

  it("rejects login with incorrect password", async () => {
    const response = await request(app).post("/api/auth/login").send({ email: testUser.email, password: "WrongPassword!" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("returns a valid JWT for correct credentials", async () => {
    const response = await request(app).post("/api/auth/login").send({ email: testUser.email, password: testUser.password });
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("token");
    expect(response.body.data.user).toHaveProperty("email", testUser.email);
    expect(response.body.data.user).not.toHaveProperty("passwordHash");
  });

  it("rejects missing auth token for protected route", async () => {
    const response = await request(app).get("/api/auth/me");
    expect(response.status).toBe(401);
  });

  it("returns authenticated user profile with valid token", async () => {
    const loginResponse = await request(app).post("/api/auth/login").send({ email: testUser.email, password: testUser.password });
    const token = loginResponse.body.data.token;
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty("email", testUser.email);
    expect(response.body.data).not.toHaveProperty("passwordHash");
  });
});
