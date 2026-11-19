import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Map from "./Map";

const { mockLoadGoogleMaps } = vi.hoisted(() => ({
  mockLoadGoogleMaps: vi.fn(),
}));

vi.mock("../../lib/google", () => ({
  loadGoogleMaps: mockLoadGoogleMaps,
}));

describe("free development map", () => {
  it("plots and selects fixed locations without requesting Google Maps or returning route metrics", async () => {
    const onMarkerClick = vi.fn();
    const onRouteResult = vi.fn();
    const kisumu = {
      lat: -0.1019,
      lng: 34.7617,
      title: "Kisumu reference point, Kenya",
      address: "Kisumu reference point, Kenya",
      label: "K",
    };

    render(
      <Map
        route={{ origin: { lat: -0.1019, lng: 34.7617 }, destination: { lat: -0.3031, lng: 36.0664 } }}
        selectableMarkers={[kisumu]}
        onMarkerClick={onMarkerClick}
        onRouteResult={onRouteResult}
      />,
    );

    expect(screen.getByText(/Free local development coordinate plot/)).toBeInTheDocument();
    expect(screen.getByText(/road routes, distance and duration are not calculated/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Select Kisumu reference point, Kenya" }));
    await waitFor(() => expect(onMarkerClick).toHaveBeenCalledWith(kisumu));
    await waitFor(() => expect(onRouteResult).toHaveBeenCalledWith(null));
    expect(onRouteResult.mock.calls.some(([result]) => result !== null)).toBe(false);
    expect(mockLoadGoogleMaps).not.toHaveBeenCalled();
  });
});
