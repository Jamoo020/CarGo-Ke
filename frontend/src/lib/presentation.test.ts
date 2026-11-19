import { describe, expect, it } from "vitest";
import {
  formatDateTime,
  formatDisplayName,
  formatDistance,
  formatDuration,
  formatLocation,
  formatReference,
  formatStatus,
  formatVehicle,
} from "./presentation";

describe("human-readable presentation formatters", () => {
  it("formats known and unknown statuses safely", () => {
    expect(formatStatus("DELIVERY_PENDING")).toBe("Delivery pending");
    expect(formatStatus("IN_PROGRESS")).toBe("In Progress");
    expect(formatStatus("")).toBe("Not available");
  });

  it("returns a stable, compact, unique reference for canonical UUIDs", () => {
    expect(formatReference("trip", "5738b245-b913-4863-b571-c79b10674576")).toBe(
      formatReference("trip", "5738b245-b913-4863-b571-c79b10674576"),
    );
    expect(formatReference("trip", "5738b245-b913-4863-b571-c79b10674576"))
      .not.toContain("5738b245-b913-4863-b571-c79b10674576");
    expect(formatReference("trip", "5738b245-b913-4863-b571-c79b10674576"))
      .not.toBe(formatReference("trip", "5738b245-b913-4863-b571-c79b10674577"));
  });

  it("uses saved locations first and labels coordinate-only values as coordinates", () => {
    expect(formatLocation("Nairobi CBD", -1.2921, 36.8219)).toBe("Nairobi CBD");
    expect(formatLocation("51.5074, -0.1277")).toBe("Coordinates: 51.5074, -0.1277");
    expect(formatLocation(null, null, null)).toBe("Location details unavailable");
  });

  it("provides clear missing-data and date fallbacks", () => {
    expect(formatDisplayName("Alex Driver")).toBe("Alex Driver");
    expect(formatDisplayName(null, "Driver name not provided")).toBe("Driver name not provided");
    expect(formatVehicle({ year: 2020, make: "Toyota", model: "Corolla" })).toBe("2020 Toyota Corolla");
    expect(formatDistance(120000)).toBe("120.0 km");
    expect(formatDuration(7200)).toBe("2 hr");
    expect(formatVehicle(null)).toBe("Vehicle details not yet provided");
    expect(formatDistance(null)).toBe("Distance not available");
    expect(formatDuration(null)).toBe("Duration not available");
    expect(formatDateTime(null)).toBe("Date not provided");
    expect(formatDateTime("bad-date")).toBe("Date not available");
  });
});
