import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { UserRole } from "@prisma/client";
import { config } from "../config";

const SALT_ROUNDS = 12;

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

export async function registerUser(email: string, password: string, fullName: string | undefined, role: UserRole) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already in use");
  }

  const passwordHash = await hashPassword(password);
  return prisma.user.create({
    data: {
      email,
      passwordHash,
      fullName,
      role,
    },
  });
}

export function createJwtToken(payload: AuthPayload) {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "8h" });
}

export function verifyJwtToken(token: string) {
  return jwt.verify(token, config.jwtSecret) as AuthPayload;
}
