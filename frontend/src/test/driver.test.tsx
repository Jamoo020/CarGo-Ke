import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../app/App";
import { clearToken } from "../lib/storage";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockListTrips = vi.fn();
const mockListMyQuotes = vi.fn();
const mockCreateQuote = vi.fn();
const mockGetTrip = vi.fn();
const mockTransitionTrip = vi.fn();

vi.mock("../lib/auth", async () => {
  const actual = await vi.importActual<typeof import("../lib/auth")>("../lib/auth");
  return {
    ...actual,
    getCurrentUser: () => Promise.resolve({ data: { id: "drv-1", role: "DRIVER", fullName: "Driver One" } }),
  };
});

vi.mock("../lib/driver", async () => {
  const actual = await vi.importActual<typeof import("../lib/driver")>("../lib/driver");
  return {
    ...actual,
    listTrips: (...args: Parameters<typeof actual.listTrips>) => mockListTrips(...args),
    listMyQuotes: (...args: Parameters<typeof actual.listMyQuotes>) => mockListMyQuotes(...args),
    createQuote: (...args: Parameters<typeof actual.createQuote>) => mockCreateQuote(...args),
    getTrip: (...args: Parameters<typeof actual.getTrip>) => mockGetTrip(...args),
    transitionTrip: (...args: Parameters<typeof actual.transitionTrip>) => mockTransitionTrip(...args),
  };
});

beforeEach(() => {
  clearToken();
  localStorage.clear();
  mockListTrips.mockReset();
  mockListMyQuotes.mockReset();
  mockCreateQuote.mockReset();
  mockGetTrip.mockReset();
  mockTransitionTrip.mockReset();
});

describe("driver frontend workflows", () => {
  it("renders the driver dashboard", async () => {
    localStorage.setItem("cargo_kenya_token", "token");
    mockListTrips.mockResolvedValue({ data: [] });
    mockListMyQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/driver"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Driver Dashboard/i)).toBeInTheDocument();
    });
  });

  it("lists assigned trips", async () => {
    localStorage.setItem("cargo_kenya_token", "token");
    mockListTrips.mockResolvedValue({ data: [ { id: "trip-1", status: "BOOKED", transportRequest: { origin: "Nairobi", destination: "Mombasa" } } ] });

    render(
      <MemoryRouter initialEntries={["/driver/trips"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Assigned Trips/i)).toBeInTheDocument();
    });

    expect(await screen.findByText(/Nairobi/)).toBeInTheDocument();
  });

  it("shows empty state when no assigned trips", async () => {
    localStorage.setItem("cargo_kenya_token", "token");
    mockListTrips.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/driver/trips"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/No assigned trips/i)).toBeInTheDocument();
    });
  });

  it("submits a quote from the driver requests page", async () => {
    localStorage.setItem("cargo_kenya_token", "token");
    mockListMyQuotes.mockResolvedValue({ data: [] });
    mockCreateQuote.mockResolvedValue({ data: { id: "quote-1", transportRequestId: "req-1", amount: 3000 } });

    render(
      <MemoryRouter initialEntries={["/driver/requests"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/My Quotes/i)).toBeInTheDocument();
    });

    const idInput = screen.getByLabelText(/Transport Request ID/i);
    const amountInput = screen.getByLabelText(/Amount/i);
    const submit = screen.getByRole("button", { name: /submit quote/i });

    await userEvent.type(idInput, "req-1");
    await userEvent.type(amountInput, "3000");
    await userEvent.click(submit);

    await waitFor(() => {
      expect(mockCreateQuote).toHaveBeenCalledWith("req-1", { amount: 3000, message: "Driver quote" });
      expect(screen.getByText(/Quote submitted/i)).toBeInTheDocument();
    });
  });

  it("shows allowed driver actions on trip detail and performs a transition", async () => {
    localStorage.setItem("cargo_kenya_token", "token");
    mockGetTrip.mockResolvedValue({ data: { id: "trip-abc", status: "BOOKED", driverFee: 1500, transportRequest: { origin: "A", destination: "B" } } });
    mockTransitionTrip.mockResolvedValue({ data: { id: "trip-abc", status: "PICKUP_PENDING", driverFee: 1500, transportRequest: { origin: "A", destination: "B" } } });

    render(
      <MemoryRouter initialEntries={["/driver/trips/trip-abc"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Trip trip-abc/i)).toBeInTheDocument();
    });

    // Begin Pickup should be available for BOOKED
    const beginBtn = screen.getByRole("button", { name: /Begin Pickup/i });
    await userEvent.click(beginBtn);

    await waitFor(() => {
      expect(mockTransitionTrip).toHaveBeenCalledWith("trip-abc", "beginPickup");
      expect(screen.getByText(/PICKUP_PENDING/i)).toBeInTheDocument();
    });
  });
});
