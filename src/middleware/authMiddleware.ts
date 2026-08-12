import { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../services/authService";
import { AppError } from "../errors/AppError";
import { UserRole } from "@prisma/client";

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
  try {
    const payload = verifyJwtToken(token);
    req.user = payload;
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
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
