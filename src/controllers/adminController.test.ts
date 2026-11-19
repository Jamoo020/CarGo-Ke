import { AccountStatus } from "@prisma/client";
import { Response } from "express";
import { updateUserStatusController } from "./adminController";
import { AuthRequest } from "../middleware/authMiddleware";
import { updateUserAccountStatusAdmin } from "../services/adminService";
import { disconnectUserSockets } from "../socket";

jest.mock("../services/adminService", () => ({
  updateUserAccountStatusAdmin: jest.fn(),
}));

jest.mock("../services/disputeService", () => ({}));

jest.mock("../socket", () => ({
  disconnectUserSockets: jest.fn(),
}));

const mockUpdateUserAccountStatusAdmin = updateUserAccountStatusAdmin as jest.Mock;
const mockDisconnectUserSockets = disconnectUserSockets as jest.Mock;

describe("updateUserStatusController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("disconnects the user's sockets after the account is suspended", async () => {
    mockUpdateUserAccountStatusAdmin.mockResolvedValue({
      id: "user-1",
      accountStatus: AccountStatus.SUSPENDED,
    });
    const req = {
      user: { userId: "admin-1", role: "ADMIN" },
      params: { userId: "user-1" },
      body: { accountStatus: AccountStatus.SUSPENDED },
      app: { io: {} },
    } as unknown as AuthRequest;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    await updateUserStatusController(req, res, next);

    expect(mockUpdateUserAccountStatusAdmin).toHaveBeenCalledWith(
      "user-1",
      { accountStatus: AccountStatus.SUSPENDED },
      req.user,
    );
    expect(mockDisconnectUserSockets).toHaveBeenCalledWith({}, "user-1");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it("keeps active users connected", async () => {
    mockUpdateUserAccountStatusAdmin.mockResolvedValue({
      id: "user-1",
      accountStatus: AccountStatus.ACTIVE,
    });
    const req = {
      user: { userId: "admin-1", role: "ADMIN" },
      params: { userId: "user-1" },
      body: { accountStatus: AccountStatus.ACTIVE },
      app: { io: {} },
    } as unknown as AuthRequest;

    await updateUserStatusController(
      req,
      { status: jest.fn().mockReturnThis(), json: jest.fn() } as unknown as Response,
      jest.fn(),
    );

    expect(mockDisconnectUserSockets).not.toHaveBeenCalled();
  });
});
