import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { signSessionToken, verifySessionToken } from "@/lib/session";

describe("session token sign/verify (Phase 3)", () => {
  it("creates and verifies a valid session token round-trip", async () => {
    const contactId = randomUUID();
    const token = await signSessionToken(contactId);

    const verified = await verifySessionToken(token);

    expect(verified).toBe(contactId);
  });

  it("returns null for a missing token, never throws", async () => {
    expect(await verifySessionToken(undefined)).toBeNull();
    expect(await verifySessionToken(null)).toBeNull();
    expect(await verifySessionToken("")).toBeNull();
  });

  it("returns null for a tampered token, never throws", async () => {
    const token = await signSessionToken(randomUUID());
    const tampered = token.slice(0, -4) + "abcd";

    expect(await verifySessionToken(tampered)).toBeNull();
  });

  it("returns null for a garbage string, never throws", async () => {
    expect(await verifySessionToken("not-a-jwt-at-all")).toBeNull();
  });
});
