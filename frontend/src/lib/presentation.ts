const STATUS_LABELS: Record<string, string> = {
  REQUESTED: "Requested",
  QUOTING: "Awaiting quotes",
  DRIVER_SELECTED: "Driver selected",
  PAYMENT_PENDING: "Payment pending",
  BOOKED: "Booked",
  PICKUP_PENDING: "Pickup pending",
  PICKUP_INSPECTION: "Pickup inspection",
  TRIP_START_PENDING: "Waiting for trip activation",
  TRIP_ACTIVE: "En route",
  IN_TRANSIT: "In transit",
  DELIVERY_PENDING: "Delivery pending",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  DISPUTED: "Disputed",
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  FAILED: "Failed",
  OPEN: "Open",
  UNDER_REVIEW: "Under review",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  ACTIVE: "Active",
  SUSPENDED: "Suspended",
  DEACTIVATED: "Deactivated",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PICKUP: "Pickup",
  DELIVERY: "Delivery",
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  ADMIN: "Administrator",
  CUSTOMER: "Customer",
  DRIVER: "Driver",
  AUTHORIZED_REPRESENTATIVE: "Authorized representative",
  FULL_REFUND: "Full refund",
  PARTIAL_REFUND: "Partial refund",
  DRIVER_PENALTY: "Driver penalty",
  NO_ACTION: "No action",
  VEHICLE_CONDITION: "Vehicle condition",
  DRIVER_CONDUCT: "Driver conduct",
  PAYMENT_RECEIVED: "Payment received",
  REFUND_OUT: "Refund issued",
  DRIVER_FIRST_RELEASE: "First driver-fee installment",
  DRIVER_FINAL_RELEASE: "Final driver-fee installment",
  DRIVER_REVERSAL: "Driver payment reversal",
  DRIVER_ADJUSTMENT: "Driver balance adjustment",
  ADJUSTMENT: "Balance adjustment",
};

export function formatStatus(value?: string | null): string {
  if (!value?.trim()) return "Not available";
  const normalized = value.trim().toUpperCase();
  return STATUS_LABELS[normalized]
    ?? normalized
      .toLowerCase()
      .split("_")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
}

export function formatReference(kind: "trip" | "request" | "payment" | "dispute" | "record", id?: string | null): string {
  if (!id) return `${kind.toUpperCase()}-UNAVAILABLE`;
  const compactId = id.replace(/-/g, "").toLowerCase();
  if (!/^[0-9a-f]{32}$/.test(compactId)) return `${kind.toUpperCase()}-REFERENCE`;

  return `${kind.toUpperCase()}-${BigInt(`0x${compactId}`).toString(36).toUpperCase().padStart(25, "0")}`;
}

export function formatLocation(
  label?: string | null,
  latitude?: number | null,
  longitude?: number | null,
): string {
  const readableLabel = label?.trim();
  if (readableLabel && !isCoordinatePair(readableLabel)) return readableLabel;
  if (typeof latitude === "number" && Number.isFinite(latitude)
    && typeof longitude === "number" && Number.isFinite(longitude)) {
    return `Coordinates: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  }
  if (readableLabel) return `Coordinates: ${readableLabel}`;
  return "Location details unavailable";
}

function isCoordinatePair(value: string): boolean {
  return /^\s*-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?\s*$/.test(value);
}

export function formatVehicle(
  vehicle?: { make?: string | null; model?: string | null; year?: number | null; vehicleType?: string | null } | null,
): string {
  if (!vehicle) return "Vehicle details not yet provided";
  const name = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ");
  return name || vehicle.vehicleType || "Vehicle details not yet provided";
}

export function formatDistance(distanceMeters?: number | null): string {
  if (typeof distanceMeters !== "number" || !Number.isFinite(distanceMeters) || distanceMeters < 0) {
    return "Distance not available";
  }
  if (distanceMeters >= 1000) return `${(distanceMeters / 1000).toFixed(1)} km`;
  return `${Math.round(distanceMeters)} m`;
}

export function formatDuration(durationSeconds?: number | null): string {
  if (typeof durationSeconds !== "number" || !Number.isFinite(durationSeconds) || durationSeconds < 0) {
    return "Duration not available";
  }
  const minutes = Math.round(durationSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} hr ${remainder} min` : `${hours} hr`;
}

export function formatDisplayName(name?: string | null, fallback = "Name not provided"): string {
  return name?.trim() || fallback;
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return "Date not provided";
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date not available"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}
