import { Request, Response, NextFunction } from "express";
import { registerUser, createJwtToken, comparePassword } from "../services/authService";
import { findUserByEmail, findUserById, sanitizeUser } from "../services/userService";
import { UserRole } from "@prisma/client";
import { AppError } from "../errors/AppError";
import { AuthRequest } from "../middleware/authMiddleware";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, fullName, role } = req.body;

    if (!email || !password || !role) {
      throw new AppError("Missing required registration fields", 400);
    }

    if (!Object.values(UserRole).includes(role)) {
      throw new AppError("Invalid role", 400);
    }

    const user = await registerUser(email, password, fullName, role);
    res.status(201).json({ data: sanitizeUser(user) });
  } catch (error) {
    if (error instanceof Error && error.message === "Email already in use") {
      return next(new AppError(error.message, 409));
    }
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await findUserByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = createJwtToken({ userId: user.id, role: user.role });
    res.status(200).json({ data: { token, user: sanitizeUser(user) } });
  } catch (error) {
    next(error);
  }
}

export async function me(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await findUserById(req.user.userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({ data: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function adminCheck(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    res.status(200).json({ data: { message: "admin access granted" } });
  } catch (error) {
    next(error);
  }
}
