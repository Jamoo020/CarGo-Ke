import { describe, expect, it } from "vitest";
import { geocodeDevLocation, getDevelopmentLocationMarkers } from "./devGeocoder";

describe("development location presets", () => {
  it("returns a canonical fixed Kenyan reference point for a selected query", () => {
    expect(geocodeDevLocation("Kisumu")).toEqual({
      address: "Kisumu reference point, Kenya",
      latitude: -0.1019,
      longitude: 34.7617,
    });
    expect(geocodeDevLocation("Nakuru, Kenya")?.address).toBe("Nakuru reference point, Kenya");
  });

  it("does not create a location for an unsupported free-text address", () => {
    expect(geocodeDevLocation("Unknown place")).toBeNull();
  });

  it("exposes the fixed presets as selectable map points", () => {
    const markers = getDevelopmentLocationMarkers();
    expect(markers.some((marker) => marker.address === "Nairobi reference point, Kenya")).toBe(true);
    expect(markers.every((marker) =>
      marker.lat >= -5.2 && marker.lat <= 5.2 && marker.lng >= 33.5 && marker.lng <= 42.5,
    )).toBe(true);
  });
});
