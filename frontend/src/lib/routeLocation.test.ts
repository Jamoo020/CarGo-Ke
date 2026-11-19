import { describe, expect, it } from "vitest";
import {
  getRouteLocationIssue,
  getStoredRouteLocationIssue,
  isKenyanCoordinate,
} from "./routeLocation";

describe("route location validation", () => {
  it("accepts separated Kenyan endpoints", () => {
    expect(getRouteLocationIssue(
      { latitude: -1.2921, longitude: 36.8219 },
      { latitude: -4.0435, longitude: 39.6682 },
    )).toBeNull();
  });

  it("rejects London and coincident endpoints", () => {
    expect(isKenyanCoordinate(51.5074, -0.1277)).toBe(false);
    expect(getRouteLocationIssue(
      { latitude: -1.2921, longitude: 36.8219 },
      { latitude: -1.2921, longitude: 36.8219 },
    )).toContain("at least 20 metres apart");
  });

  it("flags legacy requests with placeholder locations or missing coordinates", () => {
    expect(getStoredRouteLocationIssue({
      origin: "51.5074, -0.1277",
      destination: "51.5074, -0.1277",
    })).toContain("valid locations in Kenya");
    expect(getStoredRouteLocationIssue({
      origin: "Nairobi",
      destination: "Mombasa",
    })).toContain("no verified pickup and destination coordinates");
  });
});
