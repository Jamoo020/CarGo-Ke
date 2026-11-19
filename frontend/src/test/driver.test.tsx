import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../app/App";
import { clearToken } from "../lib/storage";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockListTrips = vi.fn();
const mockListMyQuotes = vi.fn();
const mockListAvailableRequests = vi.fn();
const mockCreateQuote = vi.fn();
const mockGetTrip = vi.fn();
const mockTransitionTrip = vi.fn();
const mockUploadTripInspectionPhoto = vi.fn();

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
    listAvailableRequests: (...args: Parameters<typeof actual.listAvailableRequests>) => mockListAvailableRequests(...args),
    createQuote: (...args: Parameters<typeof actual.createQuote>) => mockCreateQuote(...args),
    getTrip: (...args: Parameters<typeof actual.getTrip>) => mockGetTrip(...args),
    transitionTrip: (...args: Parameters<typeof actual.transitionTrip>) => mockTransitionTrip(...args),
    uploadTripInspectionPhoto: (...args: Parameters<typeof actual.uploadTripInspectionPhoto>) =>
      mockUploadTripInspectionPhoto(...args),
  };
});

beforeEach(() => {
  clearToken();
  localStorage.clear();
  mockListTrips.mockReset();
  mockListMyQuotes.mockReset();
  mockListAvailableRequests.mockReset();
  mockCreateQuote.mockReset();
  mockGetTrip.mockReset();
  mockTransitionTrip.mockReset();
  mockUploadTripInspectionPhoto.mockReset();
});

describe("driver frontend workflows", () => {
  it("renders the driver dashboard", async () => {
    localStorage.setItem("cargo_kenya_token", "token");
    mockListAvailableRequests.mockResolvedValue({ data: [] });
    mockListMyQuotes.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/driver"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(
      () => {
        expect(screen.getByRole("heading", { name: /available transport jobs/i })).toBeInTheDocument();
      },
      { timeout: 3000 },
    );
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

  it("shows open customer requests and allows a driver to quote one", async () => {
    const user = userEvent.setup();
    localStorage.setItem("cargo_kenya_token", "token");
    const requestId = "5738b245-b913-4863-b571-c79b10674576";
    mockListAvailableRequests.mockResolvedValue({
      data: [
        { id: requestId, origin: "Nairobi", destination: "Mombasa", status: "REQUESTED", createdAt: "2026-01-01T00:00:00Z", vehicleDetail: { make: "Toyota", model: "Hiace", year: 2024, color: "Silver" } },
        { id: "req-2", origin: "Kisumu", destination: "Nakuru", status: "QUOTING", createdAt: "2026-01-02T00:00:00Z", vehicleDetail: { make: "Isuzu", model: "NQR", year: 2020 } },
      ],
    });
    mockListMyQuotes.mockResolvedValue({ data: [] });
    mockCreateQuote.mockResolvedValue({ data: { id: "quote-1", transportRequestId: requestId, amount: 3000 } });

    render(
      <MemoryRouter initialEntries={["/driver/requests"]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Open jobs/i)).toBeInTheDocument();
    });

    expect((await screen.findAllByText(/Nairobi/)).length).toBeGreaterThan(0);
    expect((await screen.findAllByText(/Mombasa/)).length).toBeGreaterThan(0);
    expect((await screen.findAllByText(/Toyota Hiace/i)).length).toBeGreaterThan(0);

    const requestButton = screen.getAllByRole("button", { name: /View request/i })[0];
    await user.click(requestButton);

    const idInput = screen.getByLabelText(/Transport Request ID/i);
    const amountInput = screen.getByLabelText(/Amount/i);
    const submit = screen.getAllByRole("button", { name: /submit quote/i }).at(-1)!;

    expect(idInput).toHaveValue("REQUEST-55W6MBA96IGQ4S7XJUCM23R06");
    await user.clear(amountInput);
    await user.type(amountInput, "3000");
    await user.click(submit);

    await waitFor(() => {
      expect(mockCreateQuote).toHaveBeenCalledWith(requestId, { amount: 3000, fuelBudget: 0, message: "Driver quote" });
      expect(screen.getByText(/^Quote submitted for REQUEST-[A-Z0-9]{25}$/i)).toBeInTheDocument();
    });
  });

  it("shows allowed driver actions on trip detail and performs a transition", async () => {
    localStorage.setItem("cargo_kenya_token", "token");
    const tripId = "5738b245-b913-4863-b571-c79b10674576";
    mockGetTrip.mockResolvedValue({ data: { id: tripId, status: "BOOKED", driverFee: 1500, transportRequest: { origin: "A", destination: "B" } } });
    mockTransitionTrip.mockResolvedValue({ data: { id: tripId, status: "PICKUP_PENDING", driverFee: 1500, transportRequest: { origin: "A", destination: "B" } } });

    render(
      <MemoryRouter initialEntries={[`/driver/trips/${tripId}`]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/^TRIP-[A-Z0-9]{25} · Active trip$/)).toBeInTheDocument();
    });

    const beginBtn = screen.getByRole("button", { name: /Begin Pickup/i });
    await userEvent.click(beginBtn);

    await waitFor(() => {
      expect(mockTransitionTrip).toHaveBeenCalledWith(tripId, "beginPickup");
      expect(screen.getAllByText(/Pickup pending/i).length).toBeGreaterThan(0);
    });
  });

  it("requires submitting a pickup inspection instead of offering the internal transition action", async () => {
    localStorage.setItem("cargo_kenya_token", "token");
    mockGetTrip.mockResolvedValue({
      data: {
        id: "trip-pickup",
        status: "PICKUP_PENDING",
        driverFee: 1500,
        transportRequest: { origin: "A", destination: "B" },
      },
    });

    render(
      <MemoryRouter initialEntries={["/driver/trips/trip-pickup"]}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("button", { name: /submit pickup inspection/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /complete pickup inspection/i })).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/choose at least one photo/i);
    expect(mockTransitionTrip).not.toHaveBeenCalled();
  });

  it("uploads selected inspection photos automatically and enables submission when complete", async () => {
    const user = userEvent.setup();
    const file = new File(["photo"], "pickup.jpg", { type: "image/jpeg" });
    localStorage.setItem("cargo_kenya_token", "token");
    mockGetTrip.mockResolvedValue({
      data: {
        id: "trip-pickup",
        status: "PICKUP_PENDING",
        driverFee: 1500,
        transportRequest: { origin: "A", destination: "B" },
      },
    });
    mockUploadTripInspectionPhoto.mockResolvedValue({
      data: [{ url: "/api/trips/trip-pickup/inspections/photos/photo.jpg" }],
    });
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:inspection-photo"),
    });
    const clickInput = vi.spyOn(HTMLInputElement.prototype, "click").mockImplementation(function (this: HTMLInputElement) {
      Object.defineProperty(this, "files", { configurable: true, value: [file] });
      this.dispatchEvent(new Event("change", { bubbles: true }));
    });

    render(
      <MemoryRouter initialEntries={["/driver/trips/trip-pickup"]}>
        <App />
      </MemoryRouter>,
    );

    await user.click(await screen.findByText(/choose from device/i));
    await waitFor(() => {
      expect(mockUploadTripInspectionPhoto).toHaveBeenCalledWith("trip-pickup", file);
      expect(screen.getByText("1 of 1 uploaded")).toBeInTheDocument();
    });

    await user.type(screen.getAllByRole("spinbutton")[0], "12000");
    await user.type(screen.getByPlaceholderText(/Good \/ minor scratches/i), "Good");
    expect(screen.getByRole("button", { name: /submit pickup inspection/i })).toBeEnabled();
    clickInput.mockRestore();
    Reflect.deleteProperty(URL, "createObjectURL");
  });
});
