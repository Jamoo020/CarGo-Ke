import { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../services/authService";
import { AppError } from "../errors/AppError";
import { AccountStatus, UserRole } from "@prisma/client";
import { prisma } from "../db";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: UserRole;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Missing authorization token", 401));
  }

  const token = authHeader.replace("Bearer ", "");
  let payload: ReturnType<typeof verifyJwtToken>;
  try {
    payload = verifyJwtToken(token);
  } catch {
    return next(new AppError("Invalid or expired token", 401));
  }

  if (typeof payload.userId !== "string" || !payload.userId) {
    return next(new AppError("Invalid or expired token", 401));
  }

  prisma.user
    .findUnique({
      where: { id: payload.userId },
      select: { id: true, role: true, accountStatus: true },
    })
    .then((user) => {
      if (!user || user.accountStatus !== AccountStatus.ACTIVE) {
        return next(new AppError("Invalid or expired token", 401));
      }

      req.user = { userId: user.id, role: user.role };
      return next();
    })
    .catch(next);
}

export function authorize(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Unauthorized", 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden", 403));
    }

    next();
  };
}
