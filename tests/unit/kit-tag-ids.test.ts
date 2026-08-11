import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("verifyKitTagMapping", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports a tag as missing when its ID env var is unset", async () => {
    vi.stubEnv("KIT_TAG_LEAD_SOURCE_REFLECTION_ID", "");
    const { verifyKitTagMapping } = await import("@/config/kitTagIds");

    const report = verifyKitTagMapping(["lead-source-reflection"]);

    expect(report.ok).toBe(false);
    expect(report.missing).toEqual(["lead-source-reflection"]);
    expect(report.configured).toEqual([]);
  });

  it("reports a tag as configured once its ID env var is set", async () => {
    vi.stubEnv("KIT_TAG_LEAD_SOURCE_REFLECTION_ID", "12345");
    const { verifyKitTagMapping } = await import("@/config/kitTagIds");

    const report = verifyKitTagMapping(["lead-source-reflection"]);

    expect(report.ok).toBe(true);
    expect(report.configured).toEqual(["lead-source-reflection"]);
    expect(report.missing).toEqual([]);
  });

  it("reports ok: false when only some of the required tags are configured", async () => {
    vi.stubEnv("KIT_TAG_LEAD_SOURCE_REFLECTION_ID", "12345");
    vi.stubEnv("KIT_TAG_MARKETING_CONSENT_ID", "");
    const { verifyKitTagMapping } = await import("@/config/kitTagIds");

    const report = verifyKitTagMapping(["lead-source-reflection", "marketing-consent"]);

    expect(report.ok).toBe(false);
    expect(report.configured).toEqual(["lead-source-reflection"]);
    expect(report.missing).toEqual(["marketing-consent"]);
  });
});

describe("requireKitTagId", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns the configured ID for a mapped tag", async () => {
    vi.stubEnv("KIT_TAG_ARCHETYPE_PRESSURE_ID", "tag_999");
    const { requireKitTagId } = await import("@/config/kitTagIds");

    expect(requireKitTagId("archetype-pressure")).toBe("tag_999");
  });

  it("throws for an unmapped tag rather than returning undefined", async () => {
    vi.stubEnv("KIT_TAG_ARCHETYPE_PRESSURE_ID", "");
    const { requireKitTagId } = await import("@/config/kitTagIds");

    expect(() => requireKitTagId("archetype-pressure")).toThrow(/no kit tag id configured/i);
  });
});
