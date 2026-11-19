import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import TripDetailPage from "../pages/admin/TripDetailPage";

const { mockGetTrip, mockListTripInspections } = vi.hoisted(() => ({
  mockGetTrip: vi.fn(),
  mockListTripInspections: vi.fn(),
}));

vi.mock("../lib/admin", () => ({
  getTrip: mockGetTrip,
}));

vi.mock("../lib/driver", () => ({
  listTripInspections: mockListTripInspections,
}));

describe("admin trip detail", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads and displays trip inspection records in the admin detail view", async () => {
    mockGetTrip.mockResolvedValue({
      data: {
        id: "trip-admin",
        status: "COMPLETED",
        customerId: "customer-1",
        driverId: "driver-1",
        bookingAmount: 1000,
        driverFee: 800,
        driverAmountReleased: 800,
        driverAmountRemaining: 0,
        tripWallet: {
          driverCompensationReleased: 800,
          driverCompensationRemaining: 0,
          releaseAccountingVersion: 2,
          fuelAccountingStatus: "RESTRICTED",
        },
        refundAmount: 0,
        createdAt: "2026-10-12T00:00:00.000Z",
        updatedAt: "2026-10-12T00:00:00.000Z",
      },
    });
    mockListTripInspections.mockResolvedValue({
      data: [
        {
          id: "inspection-1",
          type: "PICKUP",
          odometer: 12000,
          vehicleCondition: "Good",
          photoUrls: [],
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/admin/trips/trip-admin"]}>
        <Routes>
          <Route path="/admin/trips/:tripId" element={<TripDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Inspection records")).toBeInTheDocument();
    expect(screen.getByText("Pickup inspection")).toBeInTheDocument();
    expect(screen.getByText("12000")).toBeInTheDocument();
    expect(screen.getByText("Driver compensation released: KSh 800")).toBeInTheDocument();
    expect(screen.queryByText(/Legacy wallet — reconciliation required/)).not.toBeInTheDocument();
    expect(mockListTripInspections).toHaveBeenCalledWith("trip-admin");
  });

  it("warns that historical release totals are not verified compensation for legacy wallets", async () => {
    mockGetTrip.mockResolvedValue({
      data: {
        id: "trip-legacy",
        status: "COMPLETED",
        bookingAmount: 1000,
        driverFee: 800,
        driverAmountReleased: 500,
        driverAmountRemaining: 300,
        tripWallet: {
          driverCompensationReleased: 0,
          driverCompensationRemaining: 0,
          releaseAccountingVersion: 1,
          fuelAccountingStatus: "LEGACY_UNRECONCILED",
        },
        refundAmount: 0,
        createdAt: "2026-10-12T00:00:00.000Z",
        updatedAt: "2026-10-12T00:00:00.000Z",
      },
    });
    mockListTripInspections.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/admin/trips/trip-legacy"]}>
        <Routes>
          <Route path="/admin/trips/:tripId" element={<TripDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Legacy wallet — reconciliation required/)).toBeInTheDocument();
    expect(screen.getByText("Historical driver amount released: KSh 500")).toBeInTheDocument();
    expect(screen.getByText("Historical driver amount remaining: KSh 300")).toBeInTheDocument();
    expect(screen.getByText(/may include fuel allocation and must not be interpreted as verified driver compensation/i)).toBeInTheDocument();
    expect(screen.queryByText(/Driver compensation released:/)).not.toBeInTheDocument();
  });

  it("does not infer legacy status from zero releases for reconciled wallets", async () => {
    mockGetTrip.mockResolvedValue({
      data: {
        id: "trip-reconciled-zero",
        status: "BOOKED",
        bookingAmount: 1000,
        driverFee: 800,
        driverAmountReleased: 0,
        driverAmountRemaining: 800,
        tripWallet: {
          driverCompensationReleased: 0,
          driverCompensationRemaining: 800,
          releaseAccountingVersion: 2,
          fuelAccountingStatus: "RESTRICTED",
        },
        refundAmount: 0,
        createdAt: "2026-10-12T00:00:00.000Z",
        updatedAt: "2026-10-12T00:00:00.000Z",
      },
    });
    mockListTripInspections.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={["/admin/trips/trip-reconciled-zero"]}>
        <Routes>
          <Route path="/admin/trips/:tripId" element={<TripDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Driver compensation released: KSh 0")).toBeInTheDocument();
    expect(screen.getByText("Driver compensation remaining: KSh 800")).toBeInTheDocument();
    expect(screen.queryByText(/Legacy wallet — reconciliation required/)).not.toBeInTheDocument();
  });
});
