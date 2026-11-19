/** Fixed reference points for manual testing in free development map mode. */

export interface DevGeocodeResult {
  address: string;
  latitude: number;
  longitude: number;
}

export const KENYAN_LOCATION_PRESETS: Record<string, DevGeocodeResult> = {
  nairobi: { address: "Nairobi reference point, Kenya", latitude: -1.2921, longitude: 36.8219 },
  mombasa: { address: "Mombasa reference point, Kenya", latitude: -4.0435, longitude: 39.6682 },
  kisumu: { address: "Kisumu reference point, Kenya", latitude: -0.1019, longitude: 34.7617 },
  nakuru: { address: "Nakuru reference point, Kenya", latitude: -0.3031, longitude: 36.0664 },
  eldoret: { address: "Eldoret reference point, Kenya", latitude: 0.5143, longitude: 35.2799 },
  malindi: { address: "Malindi reference point, Kenya", latitude: -3.2167, longitude: 40.1167 },
  kilifi: { address: "Kilifi reference point, Kenya", latitude: -3.6347, longitude: 39.8494 },
  diani: { address: "Diani reference point, Kenya", latitude: -4.3369, longitude: 39.5833 },
  lamu: { address: "Lamu reference point, Kenya", latitude: -2.2625, longitude: 40.9017 },
  thika: { address: "Thika reference point, Kenya", latitude: -1.0333, longitude: 37.0833 },
  machakos: { address: "Machakos reference point, Kenya", latitude: -2.7167, longitude: 37.2667 },
  nyeri: { address: "Nyeri reference point, Kenya", latitude: -0.4167, longitude: 36.95 },
  naivasha: { address: "Naivasha reference point, Kenya", latitude: -0.7167, longitude: 36.4333 },
  kitale: { address: "Kitale reference point, Kenya", latitude: 1.0167, longitude: 35 },
  garissa: { address: "Garissa reference point, Kenya", latitude: -0.4528, longitude: 39.6455 },
  kakamega: { address: "Kakamega reference point, Kenya", latitude: 0.2833, longitude: 34.75 },
  kericho: { address: "Kericho reference point, Kenya", latitude: -0.3667, longitude: 35.2833 },
  iten: { address: "Iten reference point, Kenya", latitude: 0.65, longitude: 35.2833 },
  nairobi_cbd: { address: "Nairobi CBD reference point, Kenya", latitude: -1.2864, longitude: 36.8172 },
};

/**
 * Match a user-entered query to a fixed, named Kenyan development reference point.
 * 
 * @param input - Location name (e.g., "Mombasa", "mombasa", "Mombasa, Kenya")
 * @returns A selected preset candidate with its canonical label and coordinates, or null
 * 
 * @example
 * ```typescript
 * const loc = geocodeDevLocation("Mombasa");
 * // Returns the fixed Mombasa reference point and its coordinates.
 * ```
 */
export function geocodeDevLocation(input: string): DevGeocodeResult | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  // Normalize: trim, lowercase, remove "kenya"
  const normalized = input
    .trim()
    .toLowerCase()
    .replace(/(?:\s+reference point)?(?:,\s*kenya)?\s*$/, "")
    .replace(/,\s*ke\s*$/, "")
    .trim()
    .replace(/\s+/g, "_");

  const match = Object.entries(KENYAN_LOCATION_PRESETS).find(([key]) => key === normalized)
    ?? Object.entries(KENYAN_LOCATION_PRESETS).find(([key]) => key.startsWith(normalized));
  return match?.[1] ?? null;
}

/**
 * Check if development geocoder recognizes a location.
 * Useful for UI validation.
 */
export function isLocationSupported(input: string): boolean {
  return geocodeDevLocation(input) !== null;
}

/**
 * Get list of supported Kenyan locations for autocomplete/help.
 */
export function getSupportedLocations(): string[] {
  return Object.keys(KENYAN_LOCATION_PRESETS)
    .map((key) => KENYAN_LOCATION_PRESETS[key].address)
    .sort();
}

export function getDevelopmentLocationMarkers() {
  return Object.entries(KENYAN_LOCATION_PRESETS).map(([key, location]) => ({
    lat: location.latitude,
    lng: location.longitude,
    title: location.address,
    address: location.address,
    label: key === "nairobi_cbd" ? "CBD" : key.slice(0, 1).toUpperCase(),
  }));
}
