import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import { mswServer } from "../mocks/server";
import { CIRCLE_TEST_BASE_URL } from "../mocks/circle-handlers";
import { createCircleApiClient } from "@/integrations/circle/client";

/**
 * Contract tests for src/integrations/circle/client.ts against sanitized
 * MSW fixtures — no real Circle account is touched.
 */
describe("CircleApiClient contract", () => {
  function client() {
    return createCircleApiClient({ apiToken: "test-token", baseUrl: CIRCLE_TEST_BASE_URL });
  }

  it("finds a known member by email", async () => {
    const member = await client().findMemberByEmail("known@example.invalid");
    expect(member).toEqual({ id: "7", email: "known@example.invalid" });
  });

  it("returns null for an unknown email rather than throwing", async () => {
    const member = await client().findMemberByEmail("nobody@example.invalid");
    expect(member).toBeNull();
  });

  it("invites a new member", async () => {
    const member = await client().inviteMember({
      email: "new@example.invalid",
      firstName: "Adam",
      spaceGroupId: "sg_1",
    });
    expect(member).toEqual({ id: "99", email: "new@example.invalid" });
  });

  it("grants and revokes access without throwing", async () => {
    await expect(client().grantAccess({ memberId: "7", spaceGroupId: "sg_1" })).resolves.toBeUndefined();
    await expect(client().revokeAccess({ memberId: "7", spaceGroupId: "sg_1" })).resolves.toBeUndefined();
  });

  it("inspects access correctly for a member with and without access", async () => {
    const withAccess = await client().inspectAccess({ memberId: "7", spaceGroupId: "sg_1" });
    expect(withAccess.hasAccess).toBe(true);

    const withoutAccess = await client().inspectAccess({ memberId: "999", spaceGroupId: "sg_1" });
    expect(withoutAccess.hasAccess).toBe(false);
  });

  it("lists every member of a space group", async () => {
    const members = await client().listSpaceGroupMembers("sg_1");
    expect(members).toEqual([
      { id: "7", email: "known@example.invalid" },
      { id: "8", email: "unexpected@example.invalid" },
    ]);
  });

  it("retries a 503 twice then succeeds", async () => {
    let callCount = 0;
    mswServer.use(
      http.get(`${CIRCLE_TEST_BASE_URL}/community_members`, () => {
        callCount += 1;
        if (callCount < 3) {
          return HttpResponse.json({ error: "unavailable" }, { status: 503 });
        }
        return HttpResponse.json({ community_members: [] });
      }),
    );

    await expect(client().findMemberByEmail("anyone@example.invalid")).resolves.toBeNull();
    expect(callCount).toBe(3);
  }, 10_000);

  it("does not retry a non-retryable 401 and fails fast", async () => {
    mswServer.use(
      http.get(`${CIRCLE_TEST_BASE_URL}/community_members`, () => {
        return HttpResponse.json({ error: "unauthorized" }, { status: 401 });
      }),
    );

    await expect(client().findMemberByEmail("anyone@example.invalid")).rejects.toThrow(/401/);
  });
});
