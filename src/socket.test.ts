import { Server, Socket } from "socket.io";
import { AccountStatus, MilestoneType, UserRole } from "@prisma/client";
import { prisma } from "./db";
import { configureTripSockets, disconnectUserSockets, emitToAuthorizedTripRoom, isAllowedSocketOrigin } from "./socket";
import { createTripGpsLocation } from "./services/gpsService";
import { createTripMilestone } from "./services/milestoneService";
import { assertAdminCapability } from "./services/adminService";
import { verifyJwtToken } from "./services/authService";

jest.mock("./db", () => ({
  prisma: {
    user: { findUnique: jest.fn() },
    trip: { findUnique: jest.fn() },
    driver: { findUnique: jest.fn() },
    customerRepresentative: { findFirst: jest.fn() },
    gpsLocation: { create: jest.fn() },
    tripMilestone: { create: jest.fn() },
  },
}));

jest.mock("./services/authService", () => ({
  verifyJwtToken: jest.fn(),
}));

jest.mock("./services/adminService", () => ({
  assertAdminCapability: jest.fn(),
}));

const mockedPrisma = prisma as jest.Mocked<typeof prisma>;
const mockedVerifyJwtToken = verifyJwtToken as jest.Mock;
const mockedAssertAdminCapability = assertAdminCapability as jest.Mock;
let accountRole: UserRole = UserRole.CUSTOMER;

type FakeSocket = {
  handshake: { auth: Record<string, unknown>; headers: Record<string, string> };
  data: Record<string, unknown>;
  rooms: Set<string>;
  on: jest.Mock;
  use: jest.Mock;
  join: jest.Mock;
  leave: jest.Mock;
  emit: jest.Mock;
  disconnect: jest.Mock;
};

function createSocketHarness() {
  let authenticateSocket!: (socket: Socket, next: (error?: Error) => void) => Promise<void>;
  let handleConnection!: (socket: Socket) => void;
  let authenticateEvents!: (packet: unknown, next: (error?: Error) => void) => void;
  let socket: FakeSocket;
  const socketRoom = {
    fetchSockets: jest.fn().mockResolvedValue([] as FakeSocket[]),
    disconnectSockets: jest.fn(),
  };
  socket = {
    handshake: { auth: { token: "valid-token" }, headers: {} },
    data: {} as Record<string, unknown>,
    rooms: new Set<string>(),
    on: jest.fn(),
    use: jest.fn((handler) => {
      authenticateEvents = handler;
    }),
    join: jest.fn(async (room: string) => {
      socket.rooms.add(room);
    }),
    leave: jest.fn(async (room: string) => {
      socket.rooms.delete(room);
    }),
    emit: jest.fn(),
    disconnect: jest.fn(),
  };
  const io = {
    use: jest.fn((handler) => {
      authenticateSocket = handler;
    }),
    on: jest.fn((event, handler) => {
      if (event === "connection") {
        handleConnection = handler;
      }
    }),
    in: jest.fn(() => {
      socketRoom.fetchSockets.mockResolvedValue([socket]);
      return socketRoom;
    }),
  };
  configureTripSockets(io as unknown as Server);

  return {
    socket: socket as FakeSocket,
    io: io as unknown as Server,
    socketRoom,
    authenticate: () => new Promise<void>((resolve, reject) => {
      void authenticateSocket(socket as unknown as Socket, (error) => error ? reject(error) : resolve());
    }),
    connect: () => handleConnection(socket as unknown as Socket),
    authenticateEvent: (next: (error?: Error) => void) =>
      authenticateEvents({}, next),
  };
}

async function subscribe(socket: FakeSocket, tripId: unknown) {
  const handler = socket.on.mock.calls.find(([event]) => event === "subscribe_trip")?.[1];
  if (!handler) {
    throw new Error("Trip subscription handler was not registered");
  }

  return new Promise<{ ok: boolean; error?: string }>((resolve) => {
    void handler(tripId, resolve);
  });
}

function setTrip(overrides: Record<string, unknown> = {}) {
  (mockedPrisma.trip.findUnique as jest.Mock).mockResolvedValue({
    id: "trip-1",
    customerId: "customer-1",
    driverId: "driver-profile-1",
    status: "TRIP_ACTIVE",
    transportRequest: {
      customerId: "customer-1",
      authorizedRepresentativeId: null,
    },
    ...overrides,
  });
}

describe("trip socket access", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    accountRole = UserRole.CUSTOMER;
    mockedVerifyJwtToken.mockReturnValue({ userId: "customer-1", role: UserRole.CUSTOMER });
    mockedAssertAdminCapability.mockResolvedValue(undefined);
    (mockedPrisma.user.findUnique as jest.Mock).mockImplementation(async ({ where }: { where: { id: string } }) => ({
      id: where.id,
      role: accountRole,
      accountStatus: AccountStatus.ACTIVE,
    }));
  });

  it("connects an authenticated active account and stores its current database identity", async () => {
    const harness = createSocketHarness();
    await expect(harness.authenticate()).resolves.toBeUndefined();
    expect(harness.socket.data.user).toEqual({ userId: "customer-1", role: UserRole.CUSTOMER });
    expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: "customer-1" },
      select: { id: true, role: true, accountStatus: true },
    });
    expect(harness.socket.join).toHaveBeenCalledWith("user:customer-1");
  });

  it("rejects unauthenticated, invalid, and expired socket credentials", async () => {
    const harness = createSocketHarness();
    harness.socket.handshake.auth = {};
    await expect(harness.authenticate()).rejects.toThrow("Unauthorized");

    for (const error of [new Error("invalid signature"), Object.assign(new Error("jwt expired"), { name: "TokenExpiredError" })]) {
      const invalidHarness = createSocketHarness();
      mockedVerifyJwtToken.mockImplementationOnce(() => { throw error; });
      await expect(invalidHarness.authenticate()).rejects.toThrow("Unauthorized");
    }
    expect(harness.socket.data.user).toBeUndefined();
  });

  it.each([AccountStatus.SUSPENDED, AccountStatus.DEACTIVATED])(
    "rejects a new connection for an account in %s status",
    async (accountStatus) => {
      const harness = createSocketHarness();
      (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "customer-1",
        role: UserRole.CUSTOMER,
        accountStatus,
      });

      await expect(harness.authenticate()).rejects.toThrow("Unauthorized");
      expect(harness.socket.data.user).toBeUndefined();
    },
  );

  it("fails closed on user lookup errors", async () => {
    const harness = createSocketHarness();
    (mockedPrisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("database unavailable"));

    await expect(harness.authenticate()).rejects.toThrow("Unauthorized");
    expect(harness.socket.data.user).toBeUndefined();
  });

  it("does not allow a customer to subscribe to another customer's trip", async () => {
    const harness = createSocketHarness();
    setTrip({ customerId: "customer-2" });
    await harness.authenticate();
    harness.connect();

    const result = await subscribe(harness.socket, "trip-1");

    expect(result).toEqual({ ok: false, error: "Trip subscription denied" });
    expect(harness.socket.rooms.has("trip:trip-1")).toBe(false);
  });

  it("does not allow a driver to subscribe to an unassigned trip", async () => {
    const harness = createSocketHarness();
    mockedVerifyJwtToken.mockReturnValue({ userId: "driver-user-2", role: UserRole.DRIVER });
    accountRole = UserRole.DRIVER;
    (mockedPrisma.driver.findUnique as jest.Mock).mockResolvedValue({
      id: "driver-profile-2",
      verified: true,
      verificationStatus: "APPROVED",
    });
    setTrip();
    await harness.authenticate();
    harness.connect();

    const result = await subscribe(harness.socket, "trip-1");

    expect(result.ok).toBe(false);
    expect(harness.socket.rooms.has("trip:trip-1")).toBe(false);
  });

  it("allows an active representative and denies an unlinked representative", async () => {
    const harness = createSocketHarness();
    mockedVerifyJwtToken.mockReturnValue({ userId: "representative-1", role: UserRole.AUTHORIZED_REPRESENTATIVE });
    accountRole = UserRole.AUTHORIZED_REPRESENTATIVE;
    setTrip();
    (mockedPrisma.customerRepresentative.findFirst as jest.Mock).mockResolvedValue({
      customerId: "customer-1",
      representativeId: "representative-1",
      status: "ACTIVE",
      revokedAt: null,
    });
    await harness.authenticate();
    harness.connect();

    const allowed = await subscribe(harness.socket, "trip-1");
    expect(allowed).toEqual({ ok: true });
    expect(harness.socket.join).toHaveBeenCalledWith("trip:trip-1");

    const unlinkedHarness = createSocketHarness();
    setTrip();
    (mockedPrisma.customerRepresentative.findFirst as jest.Mock).mockResolvedValue(null);
    await unlinkedHarness.authenticate();
    unlinkedHarness.connect();

    const denied = await subscribe(unlinkedHarness.socket, "trip-1");
    expect(denied.ok).toBe(false);
    expect(unlinkedHarness.socket.rooms.has("trip:trip-1")).toBe(false);
  });

  it("requires active trip-oversight authorization for administrators", async () => {
    const harness = createSocketHarness();
    mockedVerifyJwtToken.mockReturnValue({ userId: "admin-1", role: UserRole.ADMIN });
    accountRole = UserRole.ADMIN;
    setTrip();
    await harness.authenticate();
    harness.connect();

    const result = await subscribe(harness.socket, "trip-1");

    expect(result).toEqual({ ok: true });
    expect(mockedAssertAdminCapability).toHaveBeenCalledWith(
      { userId: "admin-1", role: UserRole.ADMIN },
      "TRIP_OVERSIGHT",
    );
  });

  it("rejects invalid trip IDs without joining any room", async () => {
    const harness = createSocketHarness();
    await harness.authenticate();
    harness.connect();

    const result = await subscribe(harness.socket, "../trip-1");

    expect(result.ok).toBe(false);
    expect(harness.socket.rooms.has("trip:../trip-1")).toBe(false);
    expect(mockedPrisma.trip.findUnique).not.toHaveBeenCalled();
  });

  it("rejects an existing socket event after its account is suspended", async () => {
    const harness = createSocketHarness();
    await harness.authenticate();
    harness.connect();
    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "customer-1",
      role: UserRole.CUSTOMER,
      accountStatus: AccountStatus.SUSPENDED,
    });

    const next = jest.fn();

    harness.authenticateEvent(next);

    await new Promise((resolve) => setImmediate(resolve));
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(harness.socket.disconnect).toHaveBeenCalledWith(true);
  });

  it("disconnects all sockets in the user's revocation room on account deactivation", () => {
    const harness = createSocketHarness();

    disconnectUserSockets(harness.io, "customer-1");

    expect(harness.io.in).toHaveBeenCalledWith("user:customer-1");
    expect(harness.socketRoom.disconnectSockets).toHaveBeenCalledWith(true);
  });

  it("disconnects existing sockets when a later database status check fails", async () => {
    const harness = createSocketHarness();
    await harness.authenticate();
    harness.connect();
    (mockedPrisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("database unavailable"));

    const result = await subscribe(harness.socket, "trip-1");

    expect(result).toEqual({ ok: false, error: "Trip subscription denied" });
    expect(harness.socket.rooms.has("trip:trip-1")).toBe(false);
    expect(harness.socket.disconnect).toHaveBeenCalledWith(true);
  });
});

describe("socket origins and trip updates", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    accountRole = UserRole.CUSTOMER;
    mockedVerifyJwtToken.mockReturnValue({ userId: "customer-1", role: UserRole.CUSTOMER });
    (mockedPrisma.user.findUnique as jest.Mock).mockImplementation(async ({ where }: { where: { id: string } }) => ({
      id: where.id,
      role: accountRole,
      accountStatus: AccountStatus.ACTIVE,
    }));
  });

  it("allows configured origins and rejects unapproved origins", () => {
    const allowed = ["http://localhost:5173", "https://cargo.example"];

    expect(isAllowedSocketOrigin("http://localhost:5173", allowed)).toBe(true);
    expect(isAllowedSocketOrigin("https://unknown.example", allowed)).toBe(false);
    expect(isAllowedSocketOrigin(undefined, allowed)).toBe(true);
  });

  it("targets the authorized trip room for GPS and milestone updates", async () => {
    const currentUser = { userId: "driver-user-1", role: UserRole.DRIVER };
    accountRole = UserRole.DRIVER;
    const emit = jest.fn();
    setTrip();
    (mockedPrisma.driver.findUnique as jest.Mock).mockResolvedValue({
      id: "driver-profile-1",
      verified: true,
      verificationStatus: "APPROVED",
    });
    (mockedPrisma.gpsLocation.create as jest.Mock).mockResolvedValue({
      id: "gps-1",
      tripId: "trip-1",
      latitude: -1.2,
      longitude: 36.8,
      timestamp: new Date("2026-10-10T00:00:00.000Z"),
    });
    (mockedPrisma.tripMilestone.create as jest.Mock).mockResolvedValue({
      id: "milestone-1",
      tripId: "trip-1",
      type: "ROUTE_MILESTONE",
      eventTime: new Date("2026-10-10T00:00:00.000Z"),
    });

    await createTripGpsLocation("trip-1", { latitude: -1.2, longitude: 36.8 }, currentUser, emit);
    await createTripMilestone(
      "trip-1",
      { type: MilestoneType.ROUTE_MILESTONE },
      currentUser,
      emit,
    );

    expect(emit).toHaveBeenCalledWith("trip:trip-1", "driver:location", expect.objectContaining({ driverId: "driver-profile-1" }));
    expect(emit).toHaveBeenCalledWith("trip:trip-1", "trip:milestone", expect.objectContaining({ id: "milestone-1" }));
  });

  it("does not emit protected trip events to sockets whose account is no longer active", async () => {
    const harness = createSocketHarness();
    await harness.authenticate();
    harness.connect();
    (mockedPrisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "customer-1",
      role: UserRole.CUSTOMER,
      accountStatus: AccountStatus.DEACTIVATED,
    });

    await emitToAuthorizedTripRoom(harness.io, "trip-1", "driver:location", { latitude: -1.2 });

    expect(harness.socket.emit).not.toHaveBeenCalled();
    expect(harness.socket.disconnect).toHaveBeenCalledWith(true);
  });

  it("does not broadcast protected trip updates to an active but unauthorized customer", async () => {
    const harness = createSocketHarness();
    await harness.authenticate();
    harness.connect();
    setTrip({ customerId: "customer-2" });

    await emitToAuthorizedTripRoom(harness.io, "trip-1", "trip:milestone", { id: "milestone-1" });

    expect(harness.socket.emit).not.toHaveBeenCalled();
    expect(harness.socket.disconnect).toHaveBeenCalledWith(true);
  });
});
