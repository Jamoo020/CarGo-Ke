import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "../app/App";
import TransportRequestDetailPage from "../pages/TransportRequestDetailPage";
import { clearToken } from "../lib/storage";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockGetCurrentUser = vi.fn();
const mockGetTransportRequests = vi.fn();
const mockCreateTransportRequest = vi.fn();
const mockGetTransportRequest = vi.fn();
const mockCancelTransportRequest = vi.fn();
const mockGetTransportRequestQuotes = vi.fn();
const mockSelectQuote = vi.fn();
const mockGetTrips = vi.fn();
const mockCreatePayment = vi.fn();
const mockConfirmPayment = vi.fn();
const mockGetTripPayment = vi.fn();
const mockCreateDispute = vi.fn();
const mockListTripInspections = vi.fn();

vi.mock("../components/map/Map", () => ({ default: () => null }));

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
    getTrips: (...args: Parameters<typeof actual.getTrips>) => mockGetTrips(...args),
    createPayment: (...args: Parameters<typeof actual.createPayment>) => mockCreatePayment(...args),
    confirmPayment: (...args: Parameters<typeof actual.confirmPayment>) => mockConfirmPayment(...args),
    getTripPayment: (...args: Parameters<typeof actual.getTripPayment>) => mockGetTripPayment(...args),
    createDispute: (...args: Parameters<typeof actual.createDispute>) => mockCreateDispute(...args),
  };
});

vi.mock("../lib/driver", async () => {
  const actual = await vi.importActual<typeof import("../lib/driver")>("../lib/driver");
  return {
    ...actual,
    listTripInspections: (...args: Parameters<typeof actual.listTripInspections>) =>
      mockListTripInspections(...args),
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
  mockGetTrips.mockReset();
  mockCreatePayment.mockReset();
  mockConfirmPayment.mockReset();
  mockGetTripPayment.mockReset();
  mockCreateDispute.mockReset();
  mockListTripInspections.mockReset();
  mockListTripInspections.mockResolvedValue({ data: [] });

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

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("customer foundation workflow", () => {
  it("renders a development-only payment simulation control for a pending payment", async () => {
    vi.stubEnv("DEV", true);
    localStorage.setItem("cargo_kenya_token", "stored-token");

    mockGetTransportRequest.mockResolvedValue({
      data: {
        id: "req-1",
        customerId: "cust-1",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        travelDateTime: "2024-01-02T09:00:00.000Z",
      },
    });

    mockGetTransportRequestQuotes.mockResolvedValue({
      data: [
        {
          id: "quote-1",
          status: "SELECTED",
          amount: 1500,
          createdAt: "2024-01-01T00:00:00.000Z",
          driver: { user: { fullName: "Driver Alpha" } },
        },
      ],
    });

    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-1",
          transportRequestId: "req-1",
          status: "PAYMENT_PENDING",
          bookingAmount: 1500,
          driverFee: 1200,
          refundAmount: 0,
          driverId: "driver-1",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          transportRequest: {
            id: "req-1",
            origin: "Nairobi",
            destination: "Mombasa",
          },
        },
      ],
    });

    mockGetTripPayment.mockResolvedValue({
      data: {
        id: "pay-1",
        tripId: "trip-1",
        amount: 1500,
        status: "PENDING",
      },
    });

    mockConfirmPayment.mockResolvedValue({
      data: {
        id: "pay-1",
        tripId: "trip-1",
        amount: 1500,
        status: "CONFIRMED",
      },
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-1"]}>
        <Routes>
          <Route path="/customer/requests/:requestId" element={<TransportRequestDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const simulationButton = await screen.findByRole("button", { name: /simulate successful payment/i });
    await userEvent.click(simulationButton);

    await waitFor(() => {
      expect(mockConfirmPayment).toHaveBeenCalledWith(
        "pay-1",
        expect.objectContaining({ providerCallbackReference: expect.stringMatching(/^dev-confirm-/) }),
      );
    });

    vi.unstubAllEnvs();
  });

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
      expect(screen.getByRole("heading", { name: /Good (morning|afternoon|evening).*Customer User/i })).toBeInTheDocument();
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
      expect(screen.getByText(/REQUEST-REFERENCE/)).toBeInTheDocument();
      expect(screen.getByText(/Awaiting quotes/)).toBeInTheDocument();
    });
  });

  it("validates route selection when creating a transport request", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");

    render(
      <MemoryRouter initialEntries={["/customer/requests/new"]}>
        <App />
      </MemoryRouter>,
    );

    const continueButton = await screen.findByRole("button", { name: /^Continue$/i });
    await userEvent.click(continueButton);

    await waitFor(() => {
      expect(screen.getByText(/Pickup and destination are required before continuing\./i)).toBeInTheDocument();
    });
  });

  it("validates destination selection when creating a transport request", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");

    render(
      <MemoryRouter initialEntries={["/customer/requests/new"]}>
        <App />
      </MemoryRouter>,
    );

    const pickupInput = await screen.findByPlaceholderText(/search pickup location/i);
    await userEvent.type(pickupInput, "Nairobi");
    await userEvent.click(await screen.findByText(/Nairobi/i));
    await userEvent.click(screen.getByRole("button", { name: /^Continue$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Pickup and destination are required before continuing\./i)).toBeInTheDocument();
    });
  });

  it("validates required vehicle metadata when creating a transport request", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");

    render(
      <MemoryRouter initialEntries={["/customer/requests/new"]}>
        <App />
      </MemoryRouter>,
    );

    await userEvent.type(await screen.findByPlaceholderText(/search pickup location/i), "Nairobi");
    await userEvent.click(await screen.findByText(/Nairobi/i));
    await userEvent.type(await screen.findByPlaceholderText(/search destination location/i), "Mombasa");
    await userEvent.click(await screen.findByText(/Mombasa/i));
    await userEvent.click(screen.getByRole("button", { name: /^Continue$/i }));
    await userEvent.click(screen.getByRole("button", { name: /^Continue$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Vehicle make, model, registration number, and year are required\./i)).toBeInTheDocument();
    });
  });

  it("creates a request through the backend contract using vehicle metadata", async () => {
    const user = userEvent.setup();
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockCreateTransportRequest.mockResolvedValue({
      data: {
        id: "req-2",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-99",
        origin: "Kisumu reference point, Kenya",
        destination: "Nakuru, Kenya",
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

    const pickupInput = await screen.findByPlaceholderText(/search pickup location/i);
    const destinationInput = await screen.findByPlaceholderText(/search destination location/i);

    fireEvent.change(pickupInput, { target: { value: "Kisumu" } });
    await user.click(await screen.findByRole("button", { name: /Use Kisumu reference point, Kenya/i }));
    fireEvent.change(destinationInput, { target: { value: "Nakuru" } });
    await user.click(await screen.findByRole("button", { name: /Use Nakuru reference point, Kenya/i }));
    await user.click(screen.getByRole("button", { name: /^Continue$/i }));

    const makeInput = screen.getByPlaceholderText(/e.g., Toyota/i);
    const modelInput = screen.getByPlaceholderText(/e.g., Hilux/i);
    const yearInput = screen.getByPlaceholderText(/e.g., 2022/i);
    const registrationInput = screen.getByPlaceholderText(/e.g., KAB 123A/i);

    await user.type(makeInput, "Toyota");
    await user.type(modelInput, "Hilux");
    await user.type(yearInput, "2022");
    await user.type(registrationInput, "KAB 123A");
    await user.click(screen.getByRole("button", { name: /^Continue$/i }));
    await user.click(screen.getByRole("button", { name: /^Continue$/i }));
    await user.click(screen.getByRole("button", { name: /^Submit Transport Request$/i }));

    await waitFor(() => {
      expect(mockCreateTransportRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          origin: "Kisumu reference point, Kenya",
          destination: "Nakuru reference point, Kenya",
          pickupAddress: "Kisumu reference point, Kenya",
          pickupLatitude: -0.1019,
          pickupLongitude: 34.7617,
          destinationAddress: "Nakuru reference point, Kenya",
          destinationLatitude: -0.3031,
          destinationLongitude: 36.0664,
          make: "Toyota",
          model: "Hilux",
          year: 2022,
          registrationNumber: "KAB 123A",
        }),
      );
      const payload = mockCreateTransportRequest.mock.calls[0][0];
      expect(payload).not.toHaveProperty("distanceMeters");
      expect(payload).not.toHaveProperty("estimatedDurationSeconds");
      expect(payload).not.toHaveProperty("routePolyline");
    });
  });

  it("shows error when request creation fails", async () => {
    const user = userEvent.setup();
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

    const pickupInput = await screen.findByPlaceholderText(/search pickup location/i);
    const destinationInput = await screen.findByPlaceholderText(/search destination location/i);

    fireEvent.change(pickupInput, { target: { value: "Kisumu" } });
    await user.click(await screen.findByRole("button", { name: /Use Kisumu reference point, Kenya/i }));
    fireEvent.change(destinationInput, { target: { value: "Nakuru" } });
    await user.click(await screen.findByRole("button", { name: /Use Nakuru reference point, Kenya/i }));
    await user.click(screen.getByRole("button", { name: /^Continue$/i }));

    await user.type(screen.getByPlaceholderText(/e.g., Toyota/i), "Toyota");
    await user.type(screen.getByPlaceholderText(/e.g., Hilux/i), "Hilux");
    await user.type(screen.getByPlaceholderText(/e.g., 2022/i), "2022");
    await user.type(screen.getByPlaceholderText(/e.g., KAB 123A/i), "MISSING-123");
    await user.click(screen.getByRole("button", { name: /^Continue$/i }));
    await user.click(screen.getByRole("button", { name: /^Continue$/i }));
    await user.click(screen.getByRole("button", { name: /^Submit Transport Request$/i }));

    await waitFor(() => {
      expect(screen.getByText(/Vehicle or resource not found\./i)).toBeInTheDocument();
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
      expect(screen.getByRole("heading", { name: /Nairobi\s*→\s*Mombasa/i })).toBeInTheDocument();
      expect(screen.getByText(/Available transport quotes/i)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Driver One/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Accept quote/i }));
    await userEvent.click(screen.getByRole("button", { name: /Confirm quote/i }));

    await waitFor(() => {
      expect(mockSelectQuote).toHaveBeenCalledWith("quote-1");
      expect(screen.getByText(/Quote accepted\./i)).toBeInTheDocument();
    });
  });

  it("loads the trip summary when a request is already DRIVER_SELECTED", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValueOnce({
      data: {
        id: "req-trip-1",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-1",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({ data: [] });
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-1",
          transportRequestId: "req-trip-1",
          bookingAmount: 5500,
          driverFee: 1500,
          fuelBudget: 300,
          carGoFee: 200,
          refundAmount: 0,
          status: "BOOKED",
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
          transportRequest: {
            id: "req-trip-1",
            origin: "Nairobi",
            destination: "Mombasa",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            customerId: "cust-1",
            authorizedRepresentativeId: null,
            vehicleDetailId: "veh-1",
            status: "DRIVER_SELECTED",
          },
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-trip-1"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Trip reference/i)).toBeInTheDocument();
      expect(screen.getByText(/^TRIP-REFERENCE$/)).toBeInTheDocument();
      expect(screen.getByText(/KSh 5500/i)).toBeInTheDocument();
    });
  });

  it("shows Pay Now when a trip is PAYMENT_PENDING and no payment exists yet", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValueOnce({
      data: {
        id: "req-pay-1",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-1",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({
      data: [
        {
          id: "quote-selected",
          transportRequestId: "req-pay-1",
          driverId: "drv-1",
          amount: 5500,
          message: "Ready to go",
          status: "SELECTED",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          driver: {
            id: "drv-1",
            user: { id: "user-drv-1", fullName: "Driver One", role: "DRIVER" },
          },
        },
      ],
    });
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-pay-1",
          transportRequestId: "req-pay-1",
          bookingAmount: 5500,
          driverFee: 1500,
          fuelBudget: 300,
          carGoFee: 200,
          refundAmount: 0,
          status: "PAYMENT_PENDING",
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
          transportRequest: {
            id: "req-pay-1",
            origin: "Nairobi",
            destination: "Mombasa",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            customerId: "cust-1",
            authorizedRepresentativeId: null,
            vehicleDetailId: "veh-1",
            status: "DRIVER_SELECTED",
          },
        },
      ],
    });
    mockGetTripPayment.mockRejectedValue({ status: "404", error: "Not found" });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-pay-1"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Pay KSh 5500/i })).toBeInTheDocument();
      expect(screen.getAllByText(/Payment pending/i).length).toBeGreaterThan(0);
    });
  });

  it("creates a payment when the customer clicks Pay Now and shows success", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValueOnce({
      data: {
        id: "req-pay-2",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-2",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({
      data: [
        {
          id: "quote-selected-2",
          transportRequestId: "req-pay-2",
          driverId: "drv-2",
          amount: 6500,
          message: "Available now",
          status: "SELECTED",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          driver: {
            id: "drv-2",
            user: { id: "user-drv-2", fullName: "Driver Two", role: "DRIVER" },
          },
        },
      ],
    });
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-pay-2",
          transportRequestId: "req-pay-2",
          bookingAmount: 6500,
          driverFee: 1500,
          fuelBudget: 350,
          carGoFee: 250,
          refundAmount: 0,
          status: "PAYMENT_PENDING",
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
          transportRequest: {
            id: "req-pay-2",
            origin: "Nairobi",
            destination: "Mombasa",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            customerId: "cust-1",
            authorizedRepresentativeId: null,
            vehicleDetailId: "veh-2",
            status: "DRIVER_SELECTED",
          },
        },
      ],
    });
    mockGetTripPayment.mockRejectedValue({ status: "404", error: "Not found" });
    mockCreatePayment.mockResolvedValue({
      data: {
        id: "payment-1",
        tripId: "trip-pay-2",
        customerId: "cust-1",
        amount: 6500,
        status: "PENDING",
        providerReference: null,
        providerCallbackReference: null,
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-pay-2"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Pay KSh 6500/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Pay KSh 6500/i }));
    await userEvent.click(screen.getByRole("button", { name: /^M-Pesa$/i }));
    await userEvent.type(screen.getByLabelText(/Phone Number/i), "0712345678");
    await userEvent.click(screen.getByRole("button", { name: /^Continue$/i }));

    await waitFor(() => {
      expect(mockCreatePayment).toHaveBeenCalledWith(
        "trip-pay-2",
        expect.objectContaining({
          providerReference: expect.stringMatching(/^mpesa_/),
        }),
      );
      expect(screen.getByText(/Payment record created/i)).toBeInTheDocument();
      expect(screen.getByText(/PAYMENT-REFERENCE/i)).toBeInTheDocument();
      const paymentHeading = screen.getByRole("heading", { name: /Payment/i, level: 3 });
      expect(paymentHeading).toBeInTheDocument();
      const paymentCard = paymentHeading.closest("div");
      expect(paymentCard).toBeTruthy();
      expect(within(paymentCard as HTMLElement).getByText(/PENDING/i)).toBeInTheDocument();
    });
  });

  it("keeps pending payments read-only while awaiting provider confirmation", async () => {
    vi.stubEnv("DEV", false);
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValueOnce({
      data: {
        id: "req-pay-confirm-1",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-1",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({
      data: [
        {
          id: "quote-confirm-1",
          transportRequestId: "req-pay-confirm-1",
          driverId: "drv-confirm-1",
          amount: 5500,
          message: "Ready to go",
          status: "SELECTED",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          driver: {
            id: "drv-confirm-1",
            user: { id: "user-drv-confirm-1", fullName: "Driver Confirm", role: "DRIVER" },
          },
        },
      ],
    });
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-pay-confirm-1",
          transportRequestId: "req-pay-confirm-1",
          bookingAmount: 5500,
          driverFee: 1500,
          fuelBudget: 300,
          carGoFee: 200,
          refundAmount: 0,
          status: "PAYMENT_PENDING",
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
          transportRequest: {
            id: "req-pay-confirm-1",
            origin: "Nairobi",
            destination: "Mombasa",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            customerId: "cust-1",
            authorizedRepresentativeId: null,
            vehicleDetailId: "veh-1",
            status: "DRIVER_SELECTED",
          },
        },
      ],
    });
    mockGetTripPayment.mockResolvedValue({
      data: {
        id: "payment-pending-1",
        tripId: "trip-pay-confirm-1",
        customerId: "cust-1",
        amount: 5500,
        status: "PENDING",
        providerReference: "mpesa-1",
        providerCallbackReference: null,
        createdAt: "2024-01-02T00:00:00.000Z",
        updatedAt: "2024-01-02T00:00:00.000Z",
      },
    });
    render(
      <MemoryRouter initialEntries={["/customer/requests/req-pay-confirm-1"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Waiting for trusted provider confirmation/i)).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /Confirm payment/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Simulate Successful Payment/i })).not.toBeInTheDocument();
    expect(mockConfirmPayment).not.toHaveBeenCalled();
  });

  it("shows the dispute form when a trip is booked and no dispute exists", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValueOnce({
      data: {
        id: "req-dispute-1",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-1",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({
      data: [
        {
          id: "quote-selected-3",
          transportRequestId: "req-dispute-1",
          driverId: "drv-3",
          amount: 7000,
          message: "Ready to go",
          status: "SELECTED",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          driver: {
            id: "drv-3",
            user: { id: "user-drv-3", fullName: "Driver Three", role: "DRIVER" },
          },
        },
      ],
    });
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-booked-1",
          transportRequestId: "req-dispute-1",
          bookingAmount: 7000,
          driverFee: 1800,
          fuelBudget: 400,
          carGoFee: 250,
          refundAmount: 0,
          status: "BOOKED",
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
          transportRequest: {
            id: "req-dispute-1",
            origin: "Nairobi",
            destination: "Mombasa",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            customerId: "cust-1",
            authorizedRepresentativeId: null,
            vehicleDetailId: "veh-1",
            status: "DRIVER_SELECTED",
          },
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-dispute-1"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Open dispute/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });
    expect(mockListTripInspections).toHaveBeenCalledWith("trip-booked-1");
  });

  it("opens a dispute and shows dispute details", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValueOnce({
      data: {
        id: "req-dispute-2",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-1",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({
      data: [
        {
          id: "quote-selected-4",
          transportRequestId: "req-dispute-2",
          driverId: "drv-4",
          amount: 7200,
          message: "Ready to go",
          status: "SELECTED",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          driver: {
            id: "drv-4",
            user: { id: "user-drv-4", fullName: "Driver Four", role: "DRIVER" },
          },
        },
      ],
    });
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-booked-2",
          transportRequestId: "req-dispute-2",
          bookingAmount: 7200,
          driverFee: 1800,
          fuelBudget: 420,
          carGoFee: 250,
          refundAmount: 0,
          status: "BOOKED",
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
          transportRequest: {
            id: "req-dispute-2",
            origin: "Nairobi",
            destination: "Mombasa",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            customerId: "cust-1",
            authorizedRepresentativeId: null,
            vehicleDetailId: "veh-1",
            status: "DRIVER_SELECTED",
          },
        },
      ],
    });
    mockCreateDispute.mockResolvedValue({
      data: {
        id: "dispute-1",
        tripId: "trip-booked-2",
        customerId: "cust-1",
        raisedById: "cust-1",
        raisedByRole: "CUSTOMER",
        description: "Driver arrived late",
        category: "DRIVER_CONDUCT",
        priority: "NORMAL",
        status: "OPEN",
        resolutionType: null,
        resolutionAmount: null,
        resolutionSummary: null,
        resolvedAt: null,
        createdAt: "2024-01-02T01:00:00.000Z",
        updatedAt: "2024-01-02T01:00:00.000Z",
      },
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-dispute-2"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Open dispute/i })).toBeInTheDocument();
    });

    await userEvent.type(screen.getByLabelText(/Description/i), "Driver arrived late");
    await userEvent.click(screen.getByRole("button", { name: /Open dispute/i }));

    await waitFor(() => {
      expect(mockCreateDispute).toHaveBeenCalledWith("trip-booked-2", {
        description: "Driver arrived late",
        category: "PAYMENT",
        priority: "NORMAL",
      });
      expect(screen.getByText(/Dispute opened successfully/i)).toBeInTheDocument();
      expect(screen.getByText(/DISPUTE-REFERENCE/i)).toBeInTheDocument();
      expect(screen.getByText(/^Open$/)).toBeInTheDocument();
    });
  });

  it("shows a validation error when dispute description is blank", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValueOnce({
      data: {
        id: "req-dispute-3",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-1",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValue({
      data: [
        {
          id: "quote-selected-5",
          transportRequestId: "req-dispute-3",
          driverId: "drv-5",
          amount: 7300,
          message: "Ready to go",
          status: "SELECTED",
          createdAt: "2024-01-01T00:00:00.000Z",
          updatedAt: "2024-01-01T00:00:00.000Z",
          driver: {
            id: "drv-5",
            user: { id: "user-drv-5", fullName: "Driver Five", role: "DRIVER" },
          },
        },
      ],
    });
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-booked-3",
          transportRequestId: "req-dispute-3",
          bookingAmount: 7300,
          driverFee: 1800,
          fuelBudget: 420,
          carGoFee: 250,
          refundAmount: 0,
          status: "BOOKED",
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
          transportRequest: {
            id: "req-dispute-3",
            origin: "Nairobi",
            destination: "Mombasa",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            customerId: "cust-1",
            authorizedRepresentativeId: null,
            vehicleDetailId: "veh-1",
            status: "DRIVER_SELECTED",
          },
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-dispute-3"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Open dispute/i })).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Open dispute/i }));

    await waitFor(() => {
      expect(screen.getByText(/Description is required to open a dispute/i)).toBeInTheDocument();
      expect(mockCreateDispute).not.toHaveBeenCalled();
    });
  });

  it("discovers the trip after selecting a quote", async () => {
    localStorage.setItem("cargo_kenya_token", "stored-token");
    mockGetTransportRequest.mockResolvedValueOnce({
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
    mockGetTransportRequest.mockResolvedValueOnce({
      data: {
        id: "req-3",
        customerId: "cust-1",
        authorizedRepresentativeId: null,
        vehicleDetailId: "veh-3",
        origin: "Nairobi",
        destination: "Mombasa",
        status: "DRIVER_SELECTED",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      },
    });
    mockGetTransportRequestQuotes.mockResolvedValueOnce({
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
    mockGetTransportRequestQuotes.mockResolvedValueOnce({
      data: [
        {
          id: "quote-1",
          transportRequestId: "req-3",
          driverId: "drv-1",
          amount: 2500,
          message: "Available today",
          status: "SELECTED",
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
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-2",
          transportRequestId: "req-3",
          bookingAmount: 5500,
          driverFee: 1500,
          fuelBudget: 300,
          carGoFee: 200,
          refundAmount: 0,
          status: "BOOKED",
          createdAt: "2024-01-02T00:00:00.000Z",
          updatedAt: "2024-01-02T00:00:00.000Z",
          transportRequest: {
            id: "req-3",
            origin: "Nairobi",
            destination: "Mombasa",
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            customerId: "cust-1",
            authorizedRepresentativeId: null,
            vehicleDetailId: "veh-3",
            status: "DRIVER_SELECTED",
          },
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/customer/requests/req-3"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Compare driver offers/i)).toBeInTheDocument();
    });

    await userEvent.click(screen.getByRole("button", { name: /Accept quote/i }));
    await userEvent.click(screen.getByRole("button", { name: /Confirm quote/i }));

    await waitFor(() => {
      expect(mockSelectQuote).toHaveBeenCalledWith("quote-1");
      expect(screen.getByText(/Trip reference/i)).toBeInTheDocument();
      expect(screen.getByText(/TRIP-REFERENCE/i)).toBeInTheDocument();
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

    await waitFor(() => {
      expect(document.querySelector(".quote-market-loading")).toBeInTheDocument();
    });
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
      expect(screen.getByText(/In transit/)).toBeInTheDocument();
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
      expect(screen.getByText(/Cancelled/)).toBeInTheDocument();
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
    expect(screen.getByText(/Requested/)).toBeInTheDocument();
    expect(screen.queryByText(/Cancelled/)).not.toBeInTheDocument();
  });
});
