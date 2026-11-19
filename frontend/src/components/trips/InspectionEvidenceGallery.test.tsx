import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import InspectionEvidenceGallery from "./InspectionEvidenceGallery";

describe("InspectionEvidenceGallery", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    Reflect.deleteProperty(URL, "createObjectURL");
    Reflect.deleteProperty(URL, "revokeObjectURL");
    localStorage.clear();
  });

  it("loads protected inspection photos with the current auth token", async () => {
    localStorage.setItem("cargo_kenya_token", "customer-token");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(new Blob(["photo"], { type: "image/jpeg" })),
    });
    const createObjectURL = vi.fn(() => "blob:inspection-photo");
    vi.stubGlobal("fetch", fetchMock);
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: createObjectURL,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });

    render(
      <InspectionEvidenceGallery
        photoUrls={["/api/trips/trip-1/inspections/photos/photo.jpg"]}
        title="Pickup inspection"
      />,
    );

    const image = await screen.findByRole("img", { name: "Pickup inspection evidence 1" });
    expect(image).toHaveAttribute("src", "blob:inspection-photo");
    expect(screen.getByRole("link", { name: "View full size" })).toHaveAttribute(
      "href",
      "blob:inspection-photo",
    );
    expect(screen.getByRole("link", { name: "Download" })).toHaveAttribute(
      "download",
      "pickup-inspection-evidence-1.jpg",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4000/api/trips/trip-1/inspections/photos/photo.jpg",
      expect.objectContaining({ method: "GET" }),
    );
    const [, request] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new Headers(request.headers).get("Authorization")).toBe("Bearer customer-token");
  });
});
