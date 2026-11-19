import { afterEach, describe, expect, it, vi } from "vitest";
import { apiGetBlob, getApiUrl } from "./api";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("getApiUrl", () => {
  it("resolves API paths against the configured backend origin", () => {
    expect(getApiUrl("/api/trips/trip-1/inspections/photos")).toBe(
      "http://localhost:4000/api/trips/trip-1/inspections/photos",
    );
  });

  it("does not send authenticated blob requests to another origin", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(apiGetBlob("https://example.invalid/photo.jpg")).rejects.toThrow(
      "Protected image requests must use the configured API origin.",
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
