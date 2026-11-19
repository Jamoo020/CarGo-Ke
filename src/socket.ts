import { Server, Socket } from "socket.io";
import { AccountStatus, UserRole } from "@prisma/client";
import { prisma } from "./db";
import { AppError } from "./errors/AppError";
import { AuthPayload, verifyJwtToken } from "./services/authService";
import { assertAdminCapability } from "./services/adminService";
import { verifyTripParticipation } from "./services/authorizationService";

const TRIP_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

type Acknowledgement = (result: { ok: boolean; error?: string }) => void;
type AuthenticatedSocket = {
  data: Record<string, unknown>;
  disconnect(close?: boolean): unknown;
  emit(event: string, ...args: unknown[]): unknown;
};

export function isAllowedSocketOrigin(origin: string | undefined, allowedOrigins: string[]): boolean {
  return !origin || allowedOrigins.includes(origin);
}

export function disconnectUserSockets(io: Server, userId: string): void {
  io.in(`user:${userId}`).disconnectSockets(true);
}

function isUserRole(role: unknown): role is UserRole {
  return typeof role === "string" && Object.values(UserRole).includes(role as UserRole);
}

async function refreshActiveSocketUser(socket: AuthenticatedSocket): Promise<AuthPayload> {
  const identity = (socket.data.user ?? socket.data.authenticatedUser) as AuthPayload | undefined;
  if (!identity || typeof identity.userId !== "string" || !identity.userId) {
    throw new AppError("Unauthorized", 401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: identity.userId },
      select: { id: true, role: true, accountStatus: true },
    });

    if (!user || user.accountStatus !== AccountStatus.ACTIVE || !isUserRole(user.role)) {
      socket.disconnect(true);
      throw new AppError("Unauthorized", 401);
    }

    const currentIdentity = { userId: user.id, role: user.role };
    socket.data.user = currentIdentity;
    delete socket.data.authenticatedUser;
    return currentIdentity;
  } catch (error) {
    socket.disconnect(true);
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Unauthorized", 401);
  }
}

export async function emitToAuthorizedTripRoom(
  io: Server,
  tripId: string,
  event: string,
  data: unknown,
): Promise<void> {
  const sockets = await io.in(`trip:${tripId}`).fetchSockets();
  await Promise.all(
    sockets.map(async (socket) => {
      try {
        const user = await refreshActiveSocketUser(socket);
        await verifyTripParticipation(tripId, user);
        if (user.role === UserRole.ADMIN) {
          await assertAdminCapability(user, "TRIP_OVERSIGHT");
        }
        socket.emit(event, data);
      } catch {
        socket.disconnect(true);
      }
    }),
  );
}

function getSocketToken(socket: Socket): string | undefined {
  const authToken = socket.handshake.auth?.token;
  if (typeof authToken === "string" && authToken.trim()) {
    return authToken;
  }

  const authorization = socket.handshake.headers.authorization;
  if (typeof authorization === "string" && authorization.startsWith("Bearer ")) {
    return authorization.slice("Bearer ".length);
  }

  return undefined;
}

export function configureTripSockets(io: Server): void {
  io.use(async (socket, next) => {
    const token = getSocketToken(socket);
    if (!token) {
      next(new Error("Unauthorized"));
      return;
    }

    try {
      const tokenUser = verifyJwtToken(token);
      if (!tokenUser.userId || !isUserRole(tokenUser.role)) {
        next(new Error("Unauthorized"));
        return;
      }

      socket.data.authenticatedUser = tokenUser;
      const user = await refreshActiveSocketUser(socket);
      await socket.join(`user:${user.userId}`);
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    socket.use(async (_packet, next) => {
      try {
        await refreshActiveSocketUser(socket);
        next();
      } catch {
        next(new Error("Unauthorized"));
      }
    });

    socket.on("subscribe_trip", async (tripId: unknown, acknowledge?: Acknowledgement) => {
      try {
        if (typeof tripId !== "string" || !TRIP_ID_PATTERN.test(tripId)) {
          throw new AppError("Invalid trip ID", 400);
        }

        const user = await refreshActiveSocketUser(socket);

        await verifyTripParticipation(tripId, user);
        if (user.role === UserRole.ADMIN) {
          await assertAdminCapability(user, "TRIP_OVERSIGHT");
        }

        await socket.join(`trip:${tripId}`);
        acknowledge?.({ ok: true });
      } catch (error) {
        if (!(error instanceof AppError)) {
          console.error("[Socket.IO] Trip subscription authorization failed");
        }
        acknowledge?.({ ok: false, error: "Trip subscription denied" });
      }
    });

    socket.on("unsubscribe_trip", async (tripId: unknown) => {
      if (typeof tripId !== "string" || !TRIP_ID_PATTERN.test(tripId)) {
        return;
      }

      await socket.leave(`trip:${tripId}`);
    });
  });
}
