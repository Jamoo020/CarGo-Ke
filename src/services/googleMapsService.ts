import { config } from "../config";
import { AppError } from "../errors/AppError";

interface RouteCalculationInput {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
}

export interface RouteCalculationResult {
  distanceMeters: number;
  estimatedDurationSeconds: number;
  routePolyline?: string;
}

interface GoogleRoutesResponse {
  routes?: Array<{
    distanceMeters: number;
    duration: string;
    polyline?: {
      encodedPolyline?: string;
    };
  }>;
}

/**
 * Calculate a driving route using Google Routes API. Never return straight-line
 * distance or estimated duration as a substitute for a driving route.
 */
export async function calculateRoute(input: RouteCalculationInput): Promise<RouteCalculationResult> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    throw new AppError("Google Routes API is not configured", 503);
  }

  console.log("[Google Routes] Calculating route using Google Routes API");

  const payload = {
    origin: {
      location: {
        latLng: {
          latitude: input.origin.latitude,
          longitude: input.origin.longitude,
        },
      },
    },
    destination: {
      location: {
        latLng: {
          latitude: input.destination.latitude,
          longitude: input.destination.longitude,
        },
      },
    },
    travelMode: "DRIVE",
  };

  try {
    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Google Routes API error: ${response.status} ${errorBody}`);
      throw new AppError("Unable to calculate route. Please try again later.", 503);
    }

    const data: GoogleRoutesResponse = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new AppError("No route found between these locations", 400);
    }

    const route = data.routes[0];
    const durationMs = parseDuration(route.duration);
    if (
      !Number.isFinite(route.distanceMeters)
      || route.distanceMeters <= 0
      || !Number.isFinite(durationMs)
      || durationMs <= 0
      || !route.polyline?.encodedPolyline
    ) {
      throw new AppError("Google Routes API returned incomplete route details", 503);
    }

    console.log(
      `[Google Routes] Route calculated: ${route.distanceMeters}m, ` +
      `${Math.round(durationMs / 1000)}s`
    );

    return {
      distanceMeters: route.distanceMeters,
      estimatedDurationSeconds: Math.round(durationMs / 1000),
      routePolyline: route.polyline?.encodedPolyline,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error("Google Routes API error:", error);
    throw new AppError("Failed to calculate route. Please try again later.", 503);
  }
}

function parseDuration(duration: string): number {
  // Google returns duration like "123.456s"
  const match = duration.match(/^(\d+(?:\.\d+)?)s$/);
  if (!match) {
    return 0;
  }
  return parseFloat(match[1]) * 1000; // convert to milliseconds
}
