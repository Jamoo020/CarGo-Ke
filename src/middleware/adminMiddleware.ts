import { NextFunction, Response } from "express";
import { AccountStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";
import { AppError } from "../errors/AppError";
import { AuthRequest } from "./authMiddleware";

export const ADMIN_CAPABILITIES = {
  USER_MANAGEMENT: "USER_MANAGEMENT",
  DRIVER_VERIFICATION: "DRIVER_VERIFICATION",
  TRIP_OVERSIGHT: "TRIP_OVERSIGHT",
  PAYMENT_OVERSIGHT: "PAYMENT_OVERSIGHT",
  WALLET_OVERSIGHT: "WALLET_OVERSIGHT",
  DISPUTE_MANAGEMENT: "DISPUTE_MANAGEMENT",
  CONFIGURATION_MANAGEMENT: "CONFIGURATION_MANAGEMENT",
  AUDIT_LOG_ACCESS: "AUDIT_LOG_ACCESS",
} as const;

export type AdminCapability = keyof typeof ADMIN_CAPABILITIES;

export function requireAdminCapability(capability: AdminCapability) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Missing authorization token", 401));
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.role !== UserRole.ADMIN) {
      return next(new AppError("Forbidden", 403));
    }

    if (user.accountStatus !== AccountStatus.ACTIVE) {
      return next(new AppError("Admin account is not active", 403));
    }

    if (!Object.values(ADMIN_CAPABILITIES).includes(capability)) {
      return next(new AppError("Unsupported admin capability", 400));
    }

    return next();
  };
}
