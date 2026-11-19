import express from "express";
import request from "supertest";
import { AccountStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { errorHandler } from "./errorHandler";
import { authenticate, authorize, AuthRequest } from "./authMiddleware";
import { verifyJwtToken } from "../services/authService";

jest.mock("../db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("../services/authService", () => ({
  verifyJwtToken: jest.fn(),
}));

const mockedFindUnique = prisma.user.findUnique as jest.Mock;
const mockedVerifyJwtToken = verifyJwtToken as jest.Mock;
const app = express();

app.get(
  "/protected",
  authenticate,
  (req: AuthRequest, res) => res.status(200).json({ user: req.user }),
);
app.get("/drivers-only", authenticate, authorize([UserRole.DRIVER]), (_req, res) => {
  res.status(200).json({ ok: true });
});
app.get("/admins-only", authenticate, authorize([UserRole.ADMIN]), (_req, res) => {
  res.status(200).json({ ok: true });
});
app.use(errorHandler);

const token = "signed-token";
const activeCustomer = {
  id: "user-1",
  role: UserRole.CUSTOMER,
  accountStatus: AccountStatus.ACTIVE,
};

describe("authenticated account status", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedVerifyJwtToken.mockReturnValue({ userId: "user-1", role: UserRole.CUSTOMER });
    mockedFindUnique.mockResolvedValue(activeCustomer);
  });

  it("allows a valid token for an active account using the current database role", async () => {
    const response = await request(app).get("/protected").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({ userId: "user-1", role: UserRole.CUSTOMER });
    expect(mockedFindUnique).toHaveBeenCalledWith({
      where: { id: "user-1" },
      select: { id: true, role: true, accountStatus: true },
    });
  });

  it.each([AccountStatus.SUSPENDED, AccountStatus.DEACTIVATED])(
    "rejects an old valid token when the account is %s",
    async (accountStatus) => {
      mockedFindUnique.mockResolvedValue({ ...activeCustomer, accountStatus });

      const response = await request(app).get("/protected").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid or expired token");
    },
  );

  it("rejects a valid token when its user no longer exists", async () => {
    mockedFindUnique.mockResolvedValue(null);

    const response = await request(app).get("/protected").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid or expired token");
  });

  it.each([
    ["invalid", new Error("invalid signature")],
    ["expired", Object.assign(new Error("jwt expired"), { name: "TokenExpiredError" })],
  ])("rejects an %s token before looking up an account", async (_kind, verificationError) => {
    mockedVerifyJwtToken.mockImplementation(() => {
      throw verificationError;
    });

    const response = await request(app).get("/protected").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Invalid or expired token");
    expect(mockedFindUnique).not.toHaveBeenCalled();
  });

  it("continues to enforce route role authorization using the current account role", async () => {
    mockedVerifyJwtToken.mockReturnValue({ userId: "user-1", role: UserRole.ADMIN });
    mockedFindUnique.mockResolvedValue({ ...activeCustomer, role: UserRole.DRIVER });

    const allowed = await request(app).get("/drivers-only").set("Authorization", `Bearer ${token}`);
    const denied = await request(app).get("/admins-only").set("Authorization", `Bearer ${token}`);

    expect(allowed.status).toBe(200);
    expect(denied.status).toBe(403);
  });

  it("does not continue the request when the account lookup fails", async () => {
    mockedFindUnique.mockRejectedValue(new Error("database unavailable"));

    const response = await request(app).get("/protected").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal server error");
  });
});
