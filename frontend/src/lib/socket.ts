import io, { Socket } from "socket.io-client";
import { getStoredToken } from "./storage";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

let socketInstance: Socket | null = null;

export function connectSocket(): Socket {
  if (!socketInstance) {
    socketInstance = io(API_URL, {
      auth: (callback) => callback({ token: getStoredToken() }),
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      console.log("[Socket.IO] Connected to trip tracking");
    });

    socketInstance.on("disconnect", () => {
      console.log("[Socket.IO] Disconnected from trip tracking");
    });

    socketInstance.on("connect_error", () => {
      console.error("[Socket.IO] Unable to connect to trip tracking");
    });
  }

  return socketInstance;
}

export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

export function getSocket(): Socket | null {
  return socketInstance;
}

export function subscribeTripTracking(tripId: string): Socket | null {
  const socket = connectSocket();
  socket.emit("subscribe_trip", tripId, (result: { ok: boolean }) => {
    if (!result.ok) {
      console.error("[Socket.IO] Trip tracking subscription was denied");
    }
  });
  return socket;
}

export function unsubscribeTripTracking(tripId: string): void {
  if (socketInstance) {
    socketInstance.emit("unsubscribe_trip", tripId);
  }
}

export interface DriverLocation {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
  driverId: string;
}

export function onDriverLocationUpdate(
  tripId: string,
  callback: (location: DriverLocation) => void
): () => void {
  const socket = connectSocket();
  socket.on("driver:location", callback);

  return () => {
    socket.off("driver:location", callback);
  };
}

export interface TripMilestoneUpdate {
  id: string;
  tripId: string;
  type: string;
  eventTime: string;
}

export function onTripMilestoneUpdate(callback: (milestone: TripMilestoneUpdate) => void): () => void {
  const socket = connectSocket();
  socket.on("trip:milestone", callback);

  return () => {
    socket.off("trip:milestone", callback);
  };
}
