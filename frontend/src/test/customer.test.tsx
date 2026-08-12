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

  it("shows loading state while fetching requests", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequests.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
    );

    render(
      <MemoryRouter initialEntries={["/customer/requests"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/My Transport Requests/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Loading requests/i)).toBeInTheDocument();
  });

  it("displays error when request list fails to load", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequests.mockRejectedValue({
      error: "Network error",
      status: "500",
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it("displays request cards with full details", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequests.mockResolvedValue({
      data: [
        {
          id: "req-123",
          customerId: "cust-1",
          authorizedRepresentativeId: null,
          vehicleDetailId: "veh-99",
          origin: "Nairobi CBD",
          destination: "Mombasa Port",
          status: "QUOTING",
          createdAt: "2024-01-15T10:30:00.000Z",
          updatedAt: "2024-01-15T10:30:00.000Z",
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Nairobi CBD/)).toBeInTheDocument();
      expect(screen.getByText(/Mombasa Port/)).toBeInTheDocument();
      expect(screen.getByText(/req-123/)).toBeInTheDocument();
      expect(screen.getByText(/QUOTING/)).toBeInTheDocument();
    });
  });

  it("validates origin field when creating a transport request", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");

    render(
      <MemoryRouter initialEntries={["/customer/requests/new"]}>
        <App />
      </MemoryRouter>,
    );

    const submitButton = await screen.findByRole("button", { name: /create request/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Origin is required/i)).toBeInTheDocument();
    });
  });

  it("validates destination field when creating a transport request", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");

    render(
      <MemoryRouter initialEntries={["/customer/requests/new"]}>
        <App />
      </MemoryRouter>,
    );

    const originInput = await screen.findByLabelText(/origin/i);
    await userEvent.type(originInput, "Nairobi");
    await userEvent.click(screen.getByRole("button", { name: /create request/i }));

    await waitFor(() => {
      expect(screen.getByText(/Destination is required/i)).toBeInTheDocument();
    });
  });

  it("validates vehicleDetailId field when creating a transport request", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");

    render(
      <MemoryRouter initialEntries={["/customer/requests/new"]}>
        <App />
      </MemoryRouter>,
    );

    const originInput = await screen.findByLabelText(/origin/i);
    const destinationInput = await screen.findByLabelText(/destination/i);

    await userEvent.type(originInput, "Nairobi");
    await userEvent.type(destinationInput, "Mombasa");
    await userEvent.click(screen.getByRole("button", { name: /create request/i }));

    await waitFor(() => {
      expect(screen.getByText(/Vehicle Detail ID is required/i)).toBeInTheDocument();
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

  it("shows error when request creation fails", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockCreateTransportRequest.mockRejectedValue({
      error: "Vehicle not found",
      status: "404",
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
    await userEvent.type(vehicleInput, "veh-missing");
    await userEvent.click(screen.getByRole("button", { name: /create request/i }));

    await waitFor(() => {
      expect(screen.getByText(/Vehicle or resource not found/i)).toBeInTheDocument();
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

  it("shows loading state when fetching request details", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
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
              }),
            100
          )
        )
    );
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-3"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Loading request/i)).toBeInTheDocument();
  });

  it("displays error when request detail fails to load", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockRejectedValue({
      error: "Request not found",
      status: "404",
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-missing"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Request not found/i)).toBeInTheDocument();
    });
  });

  it("renders the actual backend status for request", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-4",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-4",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "IN_TRANSIT",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-4"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/IN_TRANSIT/)).toBeInTheDocument();
    });
  });

  it("shows cancel button for REQUESTED status", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-5",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-5",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "REQUESTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-5"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /cancel request/i })).toBeInTheDocument();
    });
  });

  it("shows cancel button for QUOTING status", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-6",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-6",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "QUOTING",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-6"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /cancel request/i })).toBeInTheDocument();
    });
  });

  it("hides cancel button for DRIVER_SELECTED status", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-7",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-7",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-7"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /cancel request/i })
      ).not.toBeInTheDocument();
    });
  });

  it("hides cancel button for BOOKED status", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-8",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-8",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "BOOKED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-8"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /cancel request/i })
      ).not.toBeInTheDocument();
    });
  });

  it("hides cancel button for IN_TRANSIT status", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-9",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-9",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "IN_TRANSIT",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-9"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /cancel request/i })
      ).not.toBeInTheDocument();
    });
  });

  it("hides cancel button for COMPLETED status", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-10",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-10",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "COMPLETED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-10"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /cancel request/i })
      ).not.toBeInTheDocument();
    });
  });

  it("hides cancel button for CANCELLED status", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-11",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-11",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "CANCELLED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-11"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /cancel request/i })
      ).not.toBeInTheDocument();
    });
  });

  it("successfully cancels a request", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-12",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-12",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "REQUESTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });
    mockCancelTransportRequest.mockResolvedValue({
      data: {
        id: "req-12",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-12",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "CANCELLED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-12"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole("button", { name: /cancel request/i });
    
    // Mock window.confirm
    vi.spyOn(window, "confirm").mockReturnValue(true);

    await userEvent.click(screen.getByRole("button", { name: /cancel request/i }));

    await waitFor(() => {
      expect(mockCancelTransportRequest).toHaveBeenCalledWith("req-12");
    });

    // Verify the status is now CANCELLED
    await waitFor(() => {
      expect(screen.getByText(/CANCELLED/)).toBeInTheDocument();
    });
  });

  it("shows error when cancellation fails", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-13",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-13",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "REQUESTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });
    mockCancelTransportRequest.mockRejectedValue({
      error: "Cannot cancel at this time",
      status: "400",
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-13"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole("button", { name: /cancel request/i });

    vi.spyOn(window, "confirm").mockReturnValue(true);

    await userEvent.click(screen.getByRole("button", { name: /cancel request/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Cannot cancel this request at its current status/i)
      ).toBeInTheDocument();
    });
  });

  it("does not change status when backend rejects cancellation", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    const requestedStatus = {
      id: "req-14",
      customerId: "cust-1",
      authorizedRepresentativeId: null,
      vehicleDetailId: "veh-14",
      origin: "Nairobi",
      destination: "Mombasa",
      status: "REQUESTED",
      createdAt: "2024-01-01T00:00:00.000Z",
      updatedAt: "2024-01-01T00:00:00.000Z",
    };

    mockGetTransportRequest.mockResolvedValue({ data: requestedStatus });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });
    mockCancelTransportRequest.mockRejectedValue({
      error: "Server error",
      status: "500",
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-14"]}>
        <App />
      </MemoryRouter>,
    );

    await screen.findByRole("button", { name: /cancel request/i });

    vi.spyOn(window, "confirm").mockReturnValue(true);

    await userEvent.click(screen.getByRole("button", { name: /cancel request/i }));

    await waitFor(() => {
      expect(screen.getByText(/Server error/i)).toBeInTheDocument();
    });

    // Status should still be REQUESTED
    expect(screen.getByText(/REQUESTED/)).toBeInTheDocument();
    expect(screen.queryByText(/CANCELLED/)).not.toBeInTheDocument();
  });
});
