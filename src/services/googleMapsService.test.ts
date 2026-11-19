import { AppError } from "../errors/AppError";
import { calculateRoute } from "./googleMapsService";

describe("calculateRoute", () => {
  const input = {
    origin: { latitude: -1.2921, longitude: 36.8219 },
    destination: { latitude: -4.0435, longitude: 39.6682 },
  };
  const originalApiKey = process.env.GOOGLE_MAPS_API_KEY;
  const originalFetch = global.fetch;

  afterEach(() => {
    if (originalApiKey === undefined) delete process.env.GOOGLE_MAPS_API_KEY;
    else process.env.GOOGLE_MAPS_API_KEY = originalApiKey;
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("does not estimate routes when Google Routes API is not configured", async () => {
    delete process.env.GOOGLE_MAPS_API_KEY;
    await expect(calculateRoute(input)).rejects.toMatchObject({
      message: "Google Routes API is not configured",
      statusCode: 503,
    });
  });

  it("returns only complete driving routes from Google", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        routes: [{
          distanceMeters: 500_000,
          duration: "3600s",
          polyline: { encodedPolyline: "encoded-route" },
        }],
      }),
    }) as jest.Mock;

    await expect(calculateRoute(input)).resolves.toEqual({
      distanceMeters: 500_000,
      estimatedDurationSeconds: 3600,
      routePolyline: "encoded-route",
    });
  });

  it("rejects incomplete Google route data", async () => {
    process.env.GOOGLE_MAPS_API_KEY = "test-key";
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        routes: [{ distanceMeters: 500_000, duration: "3600s" }],
      }),
    }) as jest.Mock;

    await expect(calculateRoute(input)).rejects.toBeInstanceOf(AppError);
  });
});
