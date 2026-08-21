import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createSignedLink, verifySignedLinkToken, SignedLinkError } from "@/lib/signedLinks";

describe("signed links (jwt sign/verify)", () => {
  it("creates and verifies a valid token round-trip", async () => {
    const contactId = randomUUID();
    const created = await createSignedLink(contactId, "reentry", 60);

    const verified = await verifySignedLinkToken(created.token, "reentry");

    expect(verified.contactId).toBe(contactId);
    expect(verified.kind).toBe("reentry");
    expect(verified.jti).toBe(created.jti);
  });

  it("rejects a token that has already expired", async () => {
    const contactId = randomUUID();
    const created = await createSignedLink(contactId, "continuation", -10);

    await expect(verifySignedLinkToken(created.token, "continuation")).rejects.toMatchObject({
      code: "expired",
    });
  });

  it("rejects a token used for the wrong purpose", async () => {
    const contactId = randomUUID();
    const created = await createSignedLink(contactId, "continuation", 60);

    await expect(verifySignedLinkToken(created.token, "reentry")).rejects.toMatchObject({
      code: "wrong_purpose",
    });
  });

  it("rejects a tampered token", async () => {
    const contactId = randomUUID();
    const created = await createSignedLink(contactId, "reentry", 60);
    const tampered = created.token.slice(0, -4) + "abcd";

    await expect(verifySignedLinkToken(tampered, "reentry")).rejects.toBeInstanceOf(SignedLinkError);
  });

  it("creates and verifies a login-kind token round-trip (Phase 3)", async () => {
    const contactId = randomUUID();
    const created = await createSignedLink(contactId, "login", 60);

    const verified = await verifySignedLinkToken(created.token, "login");

    expect(verified.contactId).toBe(contactId);
    expect(verified.kind).toBe("login");
  });

  it("rejects a token signed with a different secret", async () => {
    // Simulate a forged token by mangling the payload segment.
    const contactId = randomUUID();
    const created = await createSignedLink(contactId, "reentry", 60);
    const parts = created.token.split(".");
    const forgedPayload = Buffer.from(JSON.stringify({ contactId: "someone-else", kind: "reentry" })).toString(
      "base64url",
    );
    const forged = `${parts[0]}.${forgedPayload}.${parts[2]}`;

    await expect(verifySignedLinkToken(forged, "reentry")).rejects.toBeInstanceOf(SignedLinkError);
  });
});
