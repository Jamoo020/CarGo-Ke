import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../app/App";
import { clearToken } from "../lib/storage";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetCurrentUser = vi.fn();
const mockListUsers = vi.fn();
const mockListDrivers = vi.fn();
const mockListTrips = vi.fn();
const mockListPayments = vi.fn();
const mockListConfig = vi.fn();
const mockListAuditLogs = vi.fn();

vi.mock("../lib/auth", async () => {
  const actual = await vi.importActual<typeof import("../lib/auth")>("../lib/auth");
  return {
    ...actual,
    getCurrentUser: (...args: Parameters<typeof actual.getCurrentUser>) => mockGetCurrentUser(...args),
  };
});

vi.mock("../lib/admin", async () => {
  const actual = await vi.importActual<typeof import("../lib/admin")>("../lib/admin");
  return {
    ...actual,
    listUsers: (...args: Parameters<typeof actual.listUsers>) => mockListUsers(...args),
    listDrivers: (...args: Parameters<typeof actual.listDrivers>) => mockListDrivers(...args),
    listTrips: (...args: Parameters<typeof actual.listTrips>) => mockListTrips(...args),
    listPayments: (...args: Parameters<typeof actual.listPayments>) => mockListPayments(...args),
    listConfig: (...args: Parameters<typeof actual.listConfig>) => mockListConfig(...args),
    listAuditLogs: (...args: Parameters<typeof actual.listAuditLogs>) => mockListAuditLogs(...args),
  };
});

beforeEach(() => {
  clearToken();
  localStorage.clear();
  mockGetCurrentUser.mockReset();
  mockListUsers.mockReset();
  mockListDrivers.mockReset();
  mockListTrips.mockReset();
  mockListPayments.mockReset();
  mockListConfig.mockReset();
  mockListAuditLogs.mockReset();

  mockGetCurrentUser.mockResolvedValue({
    data: {
      id: "admin-1",
      email: "admin@example.com",
      fullName: "System Admin",
      role: "ADMIN",
      accountStatus: "ACTIVE",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  });
});

describe("admin frontend integration flows", () => {
  it("renders the admin dashboard and provides role navigation links", async () => {
    localStorage.setItem("cargo_kenya_token", "token-123");

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Admin Dashboard/i })).toBeInTheDocument();
    });

    expect(screen.getAllByRole("link", { name: /Users/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Drivers/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /Trips/i }).length).toBeGreaterThan(0);
  });

  it("loads the users list through the admin routes and allows navigation to the page", async () => {
    localStorage.setItem("cargo_kenya_token", "token-123");
    mockListUsers.mockResolvedValue({
      data: [
        {
          id: "user-1",
          email: "tenant@example.com",
          fullName: "Tenant User",
          role: "CUSTOMER",
          accountStatus: "ACTIVE",
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/admin/users"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Users/i })).toBeInTheDocument();
    });

    expect(await screen.findByText(/tenant@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /tenant@example.com/i })).toBeInTheDocument();
  });

  it("navigates from the admin dashboard to the trips page and loads trip rows", async () => {
    localStorage.setItem("cargo_kenya_token", "token-123");
    mockListTrips.mockResolvedValue({
      data: [
        {
          id: "trip-42",
          status: "BOOKED",
          transportRequest: { origin: "Nairobi", destination: "Mombasa" },
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Admin Dashboard/i)).toBeInTheDocument();
    });

    const tripLinks = screen.getAllByRole("link", { name: /Trips/i });
    await userEvent.click(tripLinks[0]);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Trips/i })).toBeInTheDocument();
    });

    expect(await screen.findByText(/trip-42/i)).toBeInTheDocument();
    expect(screen.getByText(/Nairobi/i)).toBeInTheDocument();
  });
});
