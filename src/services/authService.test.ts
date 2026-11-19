import express from "express";
import request from "supertest";
import { DriverVerificationStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import authRoutes from "../routes/authRoutes";
import { errorHandler } from "../middleware/errorHandler";
import { registerUser } from "./authService";

jest.mock("../db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    driver: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

describe("public registration roles", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (mockedPrisma.user.create as jest.Mock).mockImplementation(async ({ data }: { data: Record<string, unknown> }) => ({
      id: "user-1",
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName,
      role: data.role,
      accountStatus: "ACTIVE",
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    }));
    (mockedPrisma.driver.create as jest.Mock).mockResolvedValue({});
    (mockedPrisma.$transaction as jest.Mock).mockImplementation(
      async (callback: (tx: typeof prisma) => Promise<unknown>) => callback(mockedPrisma),
    );
  });

  it("registers a customer with the customer role persisted by the service", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "customer@example.test",
      password: "Password123!",
      role: "CUSTOMER",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.role).toBe(UserRole.CUSTOMER);
    expect(mockedPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ role: UserRole.CUSTOMER }) }),
    );
    expect(mockedPrisma.driver.create).not.toHaveBeenCalled();
  });

  it("registers a driver with pending verification and persists the driver role", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "driver@example.test",
      password: "Password123!",
      role: "DRIVER",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.role).toBe(UserRole.DRIVER);
    expect(mockedPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ role: UserRole.DRIVER }) }),
    );
    expect(mockedPrisma.driver.create).toHaveBeenCalledWith({
      data: {
        userId: "user-1",
        verified: false,
        verificationStatus: DriverVerificationStatus.PENDING,
      },
    });
  });

  it.each(["ADMIN", "AUTHORIZED_REPRESENTATIVE", "SUPERUSER"])(
    "rejects privileged or unsupported public role %s before persistence",
    async (role) => {
      const response = await request(app).post("/api/auth/register").send({
        email: "attacker@example.test",
        password: "Password123!",
        role,
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid role for public registration");
      expect(mockedPrisma.user.create).not.toHaveBeenCalled();
      expect(mockedPrisma.$transaction).not.toHaveBeenCalled();
    },
  );

  it("rejects privileged roles when the shared registration service is called directly", async () => {
    await expect(
      registerUser("attacker@example.test", "Password123!", undefined, UserRole.ADMIN as never),
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Invalid role for public registration",
    });

    expect(mockedPrisma.user.findUnique).not.toHaveBeenCalled();
    expect(mockedPrisma.user.create).not.toHaveBeenCalled();
  });
});
