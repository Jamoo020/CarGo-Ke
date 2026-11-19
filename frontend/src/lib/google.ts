import { MAP_PROVIDER } from "./mapProvider";

/**
 * Google Maps JS API loader utility
 * Loads Google Maps library once with browser API key
 */

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_BROWSER_KEY;
export interface GoogleMapsLibraries {
  google?: {
    maps?: {
      Map: any;
      LatLng: any;
      LatLngBounds: any;
      Marker: any;
      InfoWindow: any;
      Polyline: any;
      places?: {
        AutocompleteService: any;
        PlacesService: any;
        AutocompleteSessionToken: any;
      };
    };
  };
}

export interface LoadGoogleMapsResult {
  google?: any;
  isAvailable: boolean;
  isDevelopmentMode: boolean;
  error?: string;
}

let loadPromise: Promise<LoadGoogleMapsResult> | null = null;

/**
 * Load Google Maps API when available.
 * Returns a result object indicating availability.
 * 
 * In development mode with missing API key:
 * - Does not crash
 * - Returns isAvailable: false
 * - Allows application to use development fallbacks
 * 
 * In production mode with missing API key:
 * - Returns error information
 */
export async function loadGoogleMaps(): Promise<LoadGoogleMapsResult> {
  if (MAP_PROVIDER === "development") {
    return {
      isAvailable: false,
      isDevelopmentMode: true,
      error: "The free development map provider is selected",
    };
  }

  // Return cached promise if already loaded or loading
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve) => {
    // Check if API key is configured
    if (!GOOGLE_MAPS_API_KEY) {
      resolve({
        isAvailable: false,
        isDevelopmentMode: false,
        error: "Google Maps mode requires VITE_GOOGLE_MAPS_BROWSER_KEY",
      });
      return;
    }

    // Check if already loaded globally
    if ((window as any).google?.maps) {
      console.log("[Google Maps] Using cached Google Maps instance");
      resolve({
        google: (window as any).google,
        isAvailable: true,
        isDevelopmentMode: false,
      });
      return;
    }

    // Create script tag to load Google Maps
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("[Google Maps] Google Maps API loaded successfully");
      resolve({
        google: (window as any).google,
        isAvailable: true,
        isDevelopmentMode: false,
      });
    };

    script.onerror = () => {
      console.error("[Google Maps] Failed to load Google Maps API script");
      resolve({
        isAvailable: false,
        isDevelopmentMode: false,
        error: "Failed to load Google Maps API script",
      });
    };

    document.head.appendChild(script);
  });

  return loadPromise;
}
