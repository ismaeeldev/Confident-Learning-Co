import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { mswServer } from "../mocks/server";
import { KIT_TEST_BASE_URL } from "../mocks/kit-handlers";

/**
 * Contract tests for src/integrations/kit/client.ts against sanitized MSW
 * fixtures (tests/mocks/kit-handlers.ts) — no real Kit account is touched.
 * Uses vi.resetModules() + dynamic import so each test can control the
 * KIT_TAG_*_ID env vars the module reads at import time (see
 * src/config/kitTagIds.ts).
 */
describe("KitApiClient contract", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("KIT_TAG_ARCHETYPE_PRESSURE_ID", "tag_pressure_123");
    vi.stubEnv("KIT_TAG_CLIENT_GUIDE_ID", "tag_guide_456");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("upserts a subscriber and returns its id/email", async () => {
    const { createKitApiClient } = await import("@/integrations/kit/client");
    const client = createKitApiClient({ apiSecret: "test-secret", baseUrl: KIT_TEST_BASE_URL });

    const subscriber = await client.upsertSubscriber({
      email: "parent@example.invalid",
      firstName: "Adam",
      fields: { archetype: "Pressure" },
    });

    expect(subscriber).toEqual({ id: "42", email: "parent@example.invalid" });
  });

  it("applies a tag by resolving its canonical name to a Kit tag ID", async () => {
    const { createKitApiClient } = await import("@/integrations/kit/client");
    const client = createKitApiClient({ apiSecret: "test-secret", baseUrl: KIT_TEST_BASE_URL });

    await expect(
      client.applyTag({ subscriberId: "42", tag: "archetype-pressure" }),
    ).resolves.toBeUndefined();
  });

  it("throws before any network call when the tag has no configured ID", async () => {
    // Explicitly cleared, in case .env.local has a real ID for this tag —
    // this test only cares that an *unmapped* tag throws, regardless of
    // what happens to be configured in the local dev environment.
    vi.stubEnv("KIT_TAG_ARCHETYPE_THINKING_ID", "");
    const { createKitApiClient } = await import("@/integrations/kit/client");
    const client = createKitApiClient({ apiSecret: "test-secret", baseUrl: KIT_TEST_BASE_URL });

    await expect(
      client.applyTag({ subscriberId: "42", tag: "archetype-thinking" }),
    ).rejects.toThrow(/no kit tag id configured/i);
  });

  it("refuses to remove the permanent client-guide tag, even with a valid tag ID", async () => {
    const { createKitApiClient } = await import("@/integrations/kit/client");
    const client = createKitApiClient({ apiSecret: "test-secret", baseUrl: KIT_TEST_BASE_URL });

    await expect(
      client.removeTag({ subscriberId: "42", tag: "client-guide" }),
    ).rejects.toThrow(/permanent/i);
  });

  it("removes a non-permanent tag successfully", async () => {
    vi.stubEnv("KIT_TAG_IL_30DAY_ACTIVE_ID", "tag_il30_789");
    const { createKitApiClient } = await import("@/integrations/kit/client");
    const client = createKitApiClient({ apiSecret: "test-secret", baseUrl: KIT_TEST_BASE_URL });

    await expect(
      client.removeTag({ subscriberId: "42", tag: "il-30day-active" }),
    ).resolves.toBeUndefined();
  });

  it("retries a 503 twice then succeeds on the third attempt", async () => {
    let callCount = 0;
    mswServer.use(
      http.post(`${KIT_TEST_BASE_URL}/tags/:tagId/subscribers`, () => {
        callCount += 1;
        if (callCount < 3) {
          return HttpResponse.json({ error: "temporarily unavailable" }, { status: 503 });
        }
        return HttpResponse.json({ subscriber: { id: 42 } }, { status: 200 });
      }),
    );

    const { createKitApiClient } = await import("@/integrations/kit/client");
    const client = createKitApiClient({ apiSecret: "test-secret", baseUrl: KIT_TEST_BASE_URL });

    await expect(
      client.applyTag({ subscriberId: "42", tag: "archetype-pressure" }),
    ).resolves.toBeUndefined();
    expect(callCount).toBe(3);
  }, 10_000);

  it("throws a KitApiError after exhausting all retries on a persistent 503", async () => {
    mswServer.use(
      http.post(`${KIT_TEST_BASE_URL}/tags/:tagId/subscribers`, () => {
        return HttpResponse.json({ error: "temporarily unavailable" }, { status: 503 });
      }),
    );

    const { createKitApiClient, KitApiError } = await import("@/integrations/kit/client");
    const client = createKitApiClient({ apiSecret: "test-secret", baseUrl: KIT_TEST_BASE_URL });

    await expect(
      client.applyTag({ subscriberId: "42", tag: "archetype-pressure" }),
    ).rejects.toBeInstanceOf(KitApiError);
  }, 10_000);

  it("does not retry a non-retryable 401 and fails fast", async () => {
    mswServer.use(
      http.post(`${KIT_TEST_BASE_URL}/subscribers`, () => {
        return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
      }),
    );

    const { createKitApiClient } = await import("@/integrations/kit/client");
    const client = createKitApiClient({ apiSecret: "bad-secret", baseUrl: KIT_TEST_BASE_URL });

    await expect(
      client.upsertSubscriber({ email: "parent@example.invalid" }),
    ).rejects.toThrow(/401/);
  });
});
