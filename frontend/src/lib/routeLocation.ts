import type { Location } from "../components/map/LocationPicker";

const KENYA_BOUNDS = {
  minLatitude: -5.2,
  maxLatitude: 5.2,
  minLongitude: 33.5,
  maxLongitude: 42.5,
};

export function isKenyanCoordinate(latitude: number, longitude: number): boolean {
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= KENYA_BOUNDS.minLatitude
    && latitude <= KENYA_BOUNDS.maxLatitude
    && longitude >= KENYA_BOUNDS.minLongitude
    && longitude <= KENYA_BOUNDS.maxLongitude;
}

export function getRouteLocationIssue(
  pickup: Pick<Location, "latitude" | "longitude">,
  destination: Pick<Location, "latitude" | "longitude">,
): string | null {
  if (!isKenyanCoordinate(pickup.latitude, pickup.longitude)
    || !isKenyanCoordinate(destination.latitude, destination.longitude)) {
    return "Pickup and destination must be valid locations in Kenya.";
  }

  const latDifference = (pickup.latitude - destination.latitude) * 111_320;
  const meanLatitude = (pickup.latitude + destination.latitude) / 2;
  const lngDifference = (pickup.longitude - destination.longitude) * 111_320 * Math.cos(meanLatitude * Math.PI / 180);
  if (Math.hypot(latDifference, lngDifference) < 20) {
    return "Pickup and destination must be different locations at least 20 metres apart.";
  }

  return null;
}

export function isCoordinateOnlyLocation(value?: string | null): boolean {
  return Boolean(value?.trim().match(/^(?:coordinates:\s*)?-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/i));
}

export function getStoredRouteLocationIssue(request?: {
  origin?: string | null;
  destination?: string | null;
  pickupLatitude?: number | null;
  pickupLongitude?: number | null;
  destinationLatitude?: number | null;
  destinationLongitude?: number | null;
} | null): string | null {
  if (!request) return "Trip locations are unavailable.";

  const pickup = parseStoredCoordinates(request.origin, request.pickupLatitude, request.pickupLongitude);
  const destination = parseStoredCoordinates(request.destination, request.destinationLatitude, request.destinationLongitude);
  if (!pickup || !destination) {
    const coordinateLabels = isCoordinateOnlyLocation(request.origin) || isCoordinateOnlyLocation(request.destination);
    return coordinateLabels
      ? "This trip uses coordinate-only location labels and has incomplete verified location data. Ask the customer to correct the pickup and destination before continuing."
      : "This trip has no verified pickup and destination coordinates. Ask the customer to correct the locations before continuing.";
  }
  return getRouteLocationIssue(pickup, destination);
}

function parseStoredCoordinates(
  label: string | null | undefined,
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): MapCoordinates | null {
  if (typeof latitude === "number" && typeof longitude === "number") return { latitude, longitude };
  const match = label?.trim().match(/^(?:coordinates:\s*)?(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/i);
  return match ? { latitude: Number(match[1]), longitude: Number(match[2]) } : null;
}

interface MapCoordinates {
  latitude: number;
  longitude: number;
}
