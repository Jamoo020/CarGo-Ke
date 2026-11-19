export type MapProvider = "development" | "google";

export function resolveMapProvider(
  configuredProvider: string | undefined,
  isDevelopmentBuild: boolean,
): MapProvider {
  if (configuredProvider === "development" || configuredProvider === "google") {
    if (configuredProvider === "development" && !isDevelopmentBuild) {
      throw new Error("The development map provider is available only in development builds.");
    }
    return configuredProvider;
  }

  if (configuredProvider) {
    throw new Error(`Unsupported VITE_MAP_PROVIDER value: ${configuredProvider}`);
  }

  return isDevelopmentBuild ? "development" : "google";
}

export const MAP_PROVIDER = resolveMapProvider(
  import.meta.env.VITE_MAP_PROVIDER,
  import.meta.env.DEV,
);
