import { afterEach, describe, expect, it, vi } from "vitest";
import { uploadTripInspectionPhoto } from "./driver";

describe("uploadTripInspectionPhoto", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it("sends an authenticated multipart upload to the configured backend", async () => {
    localStorage.setItem("cargo_kenya_token", "test-token");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: () =>
        Promise.resolve(
          JSON.stringify({ data: [{ url: "/api/trips/trip-1/inspections/photos/photo.jpg" }] }),
        ),
    });
    vi.stubGlobal("fetch", fetchMock);

    const file = new File(["photo"], "pickup.jpg", { type: "image/jpeg" });
    const result = await uploadTripInspectionPhoto("trip-1", file);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("http://localhost:4000/api/trips/trip-1/inspections/photos");
    expect(request.method).toBe("POST");
    expect(new Headers(request.headers).get("Authorization")).toBe("Bearer test-token");
    expect(new Headers(request.headers).has("Content-Type")).toBe(false);
    expect(request.body).toBeInstanceOf(FormData);
    expect((request.body as FormData).get("files")).toBe(file);
    expect(result.data[0].url).toBe("/api/trips/trip-1/inspections/photos/photo.jpg");
  });
});
