import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { DriverVerificationStatus, UserRole } from "@prisma/client";
import { config } from "../config";
import { AppError } from "../errors/AppError";

const SALT_ROUNDS = 12;

const PUBLIC_REGISTRATION_ROLES = new Set<string>(["CUSTOMER", "DRIVER"]);

export type PublicRegistrationRole = Extract<UserRole, "CUSTOMER" | "DRIVER">;

export function isPublicRegistrationRole(role: unknown): role is PublicRegistrationRole {
  return typeof role === "string" && PUBLIC_REGISTRATION_ROLES.has(role);
}

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string | undefined,
  role: PublicRegistrationRole,
) {
  if (!isPublicRegistrationRole(role)) {
    throw new AppError("Invalid role for public registration", 400);
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await hashPassword(password);

  return prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role,
      },
    });

    if (role === UserRole.DRIVER) {
      await tx.driver.create({
        data: {
          userId: createdUser.id,
          verified: false,
          verificationStatus: DriverVerificationStatus.PENDING,
        },
      });
    }

    return createdUser;
  });
}

export function createJwtToken(payload: AuthPayload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "8h" });
}

export function verifyJwtToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as AuthPayload;
}
