import { describe, expect, it } from "vitest";
import { resolveMapProvider } from "./mapProvider";

describe("map provider selection", () => {
  it("defaults to the free local provider in development and Google in production", () => {
    expect(resolveMapProvider(undefined, true)).toBe("development");
    expect(resolveMapProvider(undefined, false)).toBe("google");
  });

  it("honors an explicit Google provider in development", () => {
    expect(resolveMapProvider("google", true)).toBe("google");
  });

  it("rejects invalid provider settings and production simulation", () => {
    expect(() => resolveMapProvider("other", true)).toThrow("Unsupported VITE_MAP_PROVIDER");
    expect(() => resolveMapProvider("development", false)).toThrow("only in development builds");
  });
});
