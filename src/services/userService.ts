import { prisma } from "../db";
import { User } from "@prisma/client";

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function sanitizeUser(user: User) {
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}
