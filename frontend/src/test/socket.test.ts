import { beforeEach, describe, expect, it, vi } from "vitest";
import { logout } from "../lib/auth";
import { connectSocket, disconnectSocket, subscribeTripTracking } from "../lib/socket";

const { mockSocket, mockIo } = vi.hoisted(() => ({
  mockSocket: {
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
  },
  mockIo: vi.fn(),
}));

vi.mock("socket.io-client", () => ({
  default: mockIo,
}));

describe("Socket.IO authentication lifecycle", () => {
  beforeEach(() => {
    disconnectSocket();
    vi.clearAllMocks();
    localStorage.clear();
    mockIo.mockReturnValue(mockSocket);
  });

  it("supplies the stored CarGo token when connecting", () => {
    localStorage.setItem("cargo_kenya_token", "socket-test-token");

    connectSocket();

    const options = mockIo.mock.calls[0][1];
    const authCallback = vi.fn();
    options.auth(authCallback);

    expect(authCallback).toHaveBeenCalledWith({ token: "socket-test-token" });
  });

  it("requests trip subscription with an acknowledgement handler", () => {
    subscribeTripTracking("trip-1");

    expect(mockSocket.emit).toHaveBeenCalledWith(
      "subscribe_trip",
      "trip-1",
      expect.any(Function),
    );
  });

  it("disconnects the authenticated socket when logging out", async () => {
    connectSocket();
    localStorage.setItem("cargo_kenya_token", "socket-test-token");

    await logout();

    expect(mockSocket.disconnect).toHaveBeenCalledOnce();
    expect(localStorage.getItem("cargo_kenya_token")).toBeNull();
  });
});
