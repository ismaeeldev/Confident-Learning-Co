import { describe, expect, it } from "vitest";
import { GET as reEntryGet } from "@/app/checkout/re-entry/[token]/route";
import { GET as membershipGet } from "@/app/checkout/membership/[token]/route";

/**
 * As of the 20 Aug 2026 redesign (see top-level §2 of
 * V2-BUILD-REQUIREMENTS-IMPLEMENTATION-GUIDE.md), these routes must never
 * charge or redirect to Circle checkout again, under any circumstance —
 * every visit lands on /login. The routes deliberately no longer parse
 * the token at all, so there's nothing left to test about token validity
 * here; these tests exist to lock in that the routes never regress back
 * to the old behaviour.
 */
describe("signed link routes — old links resolve to login, never charge", () => {
  it("re-entry route always redirects to login, never to Circle checkout or an error page", async () => {
    const response = await reEntryGet();

    expect(response.status).toBe(303);
    const location = response.headers.get("location") ?? "";
    expect(location).toContain("/login");
    expect(location).not.toContain("/checkout/inside-the-loop");
    expect(location).not.toContain("/checkout/link-invalid");
  });

  it("membership (continuation) route always redirects to login, never to Circle checkout or an error page", async () => {
    const response = await membershipGet();

    expect(response.status).toBe(303);
    const location = response.headers.get("location") ?? "";
    expect(location).toContain("/login");
    expect(location).not.toContain("/checkout/inside-the-loop");
    expect(location).not.toContain("/checkout/link-invalid");
  });
});
