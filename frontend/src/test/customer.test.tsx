import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../app/App";
import { clearToken } from "../lib/storage";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGetCurrentUser = vi.fn();
const mockGetTransportRequests = vi.fn();
const mockCreateTransportRequest = vi.fn();
const mockGetTransportRequest = vi.fn();
const mockCancelTransportRequest = vi.fn();
const mockGetTransportRequestQuotes = vi.fn();
const mockSelectQuote = vi.fn();

vi.mock("../lib/auth", async () => {
  const actual = await vi.importActual<typeof import("../lib/auth")>("../lib/auth");
  return {
    ...actual,
    getCurrentUser: (...args: Parameters<typeof actual.getCurrentUser>) => mockGetCurrentUser(...args),
  };
});

vi.mock("../lib/customer", async () => {
  const actual = await vi.importActual<typeof import("../lib/customer")>("../lib/customer");
  return {
    ...actual,
    getTransportRequests: (...args: Parameters<typeof actual.getTransportRequests>) => mockGetTransportRequests(...args),
    createTransportRequest: (...args: Parameters<typeof actual.createTransportRequest>) => mockCreateTransportRequest(...args),
    getTransportRequest: (...args: Parameters<typeof actual.getTransportRequest>) => mockGetTransportRequest(...args),
    cancelTransportRequest: (...args: Parameters<typeof actual.cancelTransportRequest>) => mockCancelTransportRequest(...args),
    getTransportRequestQuotes: (...args: Parameters<typeof actual.getTransportRequestQuotes>) => mockGetTransportRequestQuotes(...args),
    selectQuote: (...args: Parameters<typeof actual.selectQuote>) => mockSelectQuote(...args),
  };
});

beforeEach(() => {
  clearToken();
  localStorage.clear();
  mockGetCurrentUser.mockReset();
  mockGetTransportRequests.mockReset();
  mockCreateTransportRequest.mockReset();
  mockGetTransportRequest.mockReset();
  mockCancelTransportRequest.mockReset();
  mockGetTransportRequestQuotes.mockReset();
  mockSelectQuote.mockReset();

  mockGetCurrentUser.mockResolvedValue({
    data: {
      id: "cust-1",
      email: "customer@example.com",
      fullName: "Customer User",
      role: "CUSTOMER",
      accountStatus: "ACTIVE",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    },
  });
});

describe("customer foundation workflow", () => {
  it("renders the customer dashboard for an authenticated customer", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequests.mockResolvedValue({
      data: [],
    });

    render(
      <MemoryRouter initialEntries={["/customer"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Customer Dashboard/i)).toBeInTheDocument();
    });
  });

  it("loads the customer's transport requests list", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequests.mockResolvedValue({
      data: [
        {
          id: "req-1",
          customerId: "cust-1",
          authorizedRepresentativeId: null,
          vehicleDetailId: "veh-1",
          origin: "Nairobi",
          destination: "Mombasa",
          status: "REQUESTED",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/My Transport Requests/i)).toBeInTheDocument();
    });

    expect(await screen.findByText("Nairobi")).toBeInTheDocument();
  });

  it("shows an empty state when a customer has no requests", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequests.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/No transport requests yet/i)).toBeInTheDocument();
    });
  });

  it("validates required fields when creating a transport request", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetCurrentUser.mockResolvedValue({
      data: {
        id: "cust-1",
        email: "customer@example.com",
        fullName: "Customer User",
        role: "CUSTOMER",
        accountStatus: "ACTIVE",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/new"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole("button", { name: /create request/i });
    await userEvent.click(screen.getByRole("button", { name: /create request/i }));

    await waitFor(() => {
      expect(screen.getByText(/Origin is required/i)).toBeInTheDocument();
    });
  });

  it("creates a request through the existing backend contract", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockCreateTransportRequest.mockResolvedValue({
      data: {
        id: "req-2",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-99",
        origin: "Kisumu",
        destination: "Nakuru",
        status: "REQUESTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/new"]}>
        <App />
      </MemoryRouter>,
    );

    const originInput = await screen.findByLabelText(/origin/i);
    const destinationInput = await screen.findByLabelText(/destination/i);
    const vehicleInput = await screen.findByLabelText(/vehicle detail id/i);

    await userEvent.type(originInput, "Kisumu");
    await userEvent.type(destinationInput, "Nakuru");
    await userEvent.type(vehicleInput, "veh-99");
    await userEvent.click(screen.getByRole("button", { name: /create request/i }));

    await waitFor(() => {
      expect(mockCreateTransportRequest).toHaveBeenCalledWith({
        origin: "Kisumu",
        destination: "Nakuru",
        vehicleDetailId: "veh-99",
      });
    });
  });

  it("loads request details and quotes, and allows a customer to select a quote", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-3",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-3",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "QUOTING",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({
      data: [
        {
          id: "quote-1",
          transportRequestId: "req-3",
          driverId: "drv-1",
          amount: 2500,
          message: "Available today",
          status: "PENDING",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          driver: {
            id: "drv-1",
            user: { id: "user-drv-1", fullName: "Driver One", role: "DRIVER" },
          },
        },
      ],
    });
    mockSelectQuote.mockResolvedValue({
      data: {
        id: "quote-1",
        transportRequestId: "req-3",
        driverId: "drv-1",
        amount: 2500,
        message: "Available today",
        status: "SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-3"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Nairobi/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /select quote/i }));

    await waitFor(() => {
      expect(mockSelectQuote).toHaveBeenCalledWith("quote-1");
    });
  });
});
