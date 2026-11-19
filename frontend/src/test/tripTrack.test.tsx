import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import TripTrackPage from "../pages/TripTrackPage";

const { mockGetTrips, mockListTripInspections } = vi.hoisted(() => ({
  mockGetTrips: vi.fn(),
  mockListTripInspections: vi.fn(),
}));

vi.mock("../lib/customer", async () => {
  const actual = await vi.importActual<typeof import("../lib/customer")>("../lib/customer");
  return { ...actual, getTrips: mockGetTrips };
});

vi.mock("../lib/driver", async () => {
  const actual = await vi.importActual<typeof import("../lib/driver")>("../lib/driver");
  return { ...actual, listTripInspections: mockListTripInspections };
});

vi.mock("../lib/socket", () => ({
  onDriverLocationUpdate: () => () => {},
  subscribeTripTracking: vi.fn(),
  unsubscribeTripTracking: vi.fn(),
}));

vi.mock("../components/map/Map", () => ({ default: () => null }));

describe("TripTrackPage inspection archive", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("shows saved pickup and delivery inspections after the trip is completed", async () => {
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-completed",
          status: "COMPLETED",
          transportRequest: { origin: "Nairobi", destination: "Mombasa" },
        },
      ],
    });
    mockListTripInspections.mockResolvedValue({
      data: [
        {
          id: "pickup-1",
          type: "PICKUP",
          odometer: 12000,
          vehicleCondition: "Good",
          photoUrls: [],
        },
        {
          id: "delivery-1",
          type: "DELIVERY",
          odometer: 12500,
          vehicleCondition: "Delivered",
          photoUrls: [],
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/customer/trips/trip-completed"]}>
        <Routes>
          <Route path="/customer/trips/:tripId" element={<TripTrackPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Inspection records")).toBeInTheDocument();
    expect(await screen.findByText("Pickup inspection")).toBeInTheDocument();
    expect(await screen.findByText("Delivery inspection")).toBeInTheDocument();
    expect(screen.getByText("12000")).toBeInTheDocument();
    expect(screen.getByText("12500")).toBeInTheDocument();
    await waitFor(() => expect(mockListTripInspections).toHaveBeenCalledWith("trip-completed"));
  });

  it("keeps the pickup inspection available during delivery review", async () => {
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: "trip-delivery-pending",
          status: "DELIVERY_PENDING",
          transportRequest: { origin: "Nairobi", destination: "Mombasa" },
        },
      ],
    });
    mockListTripInspections.mockResolvedValue({
      data: [
        {
          id: "pickup-1",
          type: "PICKUP",
          odometer: 12000,
          vehicleCondition: "Good",
          photoUrls: [],
        },
        {
          id: "delivery-1",
          type: "DELIVERY",
          odometer: 12500,
          vehicleCondition: "Delivered",
          photoUrls: [],
        },
      ],
    });

    render(
      <MemoryRouter initialEntries={["/customer/trips/trip-delivery-pending"]}>
        <Routes>
          <Route path="/customer/trips/:tripId" element={<TripTrackPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Inspection records")).toBeInTheDocument();
    expect(await screen.findByText("Pickup inspection")).toBeInTheDocument();
    expect(screen.getByText("12000")).toBeInTheDocument();
    expect(screen.getByText("Delivery inspection review")).toBeInTheDocument();
  });

  it("shows readable trip details without rendering the internal trip UUID", async () => {
    const tripId = "5738b245-b913-4863-b571-c79b10674576";
    mockGetTrips.mockResolvedValue({
      data: [
        {
          id: tripId,
          status: "IN_TRANSIT",
          createdAt: "2026-01-15T10:30:00.000Z",
          driver: { user: { fullName: "Alex Driver" } },
          transportRequest: {
            origin: "51.5074, -0.1277",
            destination: "Mombasa Port",
            pickupAddress: "Nairobi CBD",
            pickupLatitude: -1.2921,
            pickupLongitude: 36.8219,
            destinationLatitude: -4.0435,
            destinationLongitude: 39.6682,
            distanceMeters: 120000,
            estimatedDurationSeconds: 7200,
            vehicleDetail: { year: 2020, make: "Toyota", model: "Corolla" },
          },
        },
      ],
    });
    mockListTripInspections.mockResolvedValue({ data: [] });

    render(
      <MemoryRouter initialEntries={[`/customer/trips/${tripId}`]}>
        <Routes>
          <Route path="/customer/trips/:tripId" element={<TripTrackPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Alex Driver")).toBeInTheDocument();
    expect(screen.getAllByText("Nairobi CBD").length).toBeGreaterThan(1);
    expect(screen.getAllByText("Mombasa Port").length).toBeGreaterThan(1);
    expect(screen.getAllByText("In transit").length).toBeGreaterThan(0);
    expect(screen.getByText("2020 Toyota Corolla")).toBeInTheDocument();
    expect(screen.getAllByText("Driving distance unavailable").length).toBeGreaterThan(0);
    expect(screen.queryByText(tripId)).not.toBeInTheDocument();
  });
});
