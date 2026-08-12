import request from "supertest";
import app from "../src/app";
import { prisma } from "../src/db";

const authUser = {
  email: "middleware-test@example.com",
  password: "MiddlewarePassword123!",
  fullName: "Middleware Test",
  role: "CUSTOMER",
};

beforeAll(async () => {
  await prisma.user.deleteMany({ where: { email: authUser.email } });
  await request(app).post("/api/auth/register").send(authUser);
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: authUser.email } });
  await prisma.$disconnect();
});

describe("Authentication middleware", () => {
  it("rejects missing token", async () => {
    const response = await request(app).get("/api/auth/me");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("rejects invalid token", async () => {
    const response = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalid.token.here");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
});
