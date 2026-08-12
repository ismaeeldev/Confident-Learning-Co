import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/cron/reconcile/route";

describe("GET /api/cron/reconcile", () => {
  function request(secret: string | null) {
    return new Request("https://example.invalid/api/cron/reconcile", {
      headers: secret ? { authorization: `Bearer ${secret}` } : {},
    });
  }

  it("rejects a request with a missing/wrong secret", async () => {
    const response = await GET(request("wrong-secret"));
    expect(response.status).toBe(401);
  });

  it("rejects a request with no authorization header at all", async () => {
    const response = await GET(request(null));
    expect(response.status).toBe(401);
  });

  it("runs successfully with the correct secret and returns a report shape", async () => {
    const response = await GET(request(process.env.CRON_SECRET ?? "test-cron-secret"));
    expect(response.status).toBe(200);

    const body = (await response.json()) as { checked: number; findings: unknown[] };
    expect(typeof body.checked).toBe("number");
    expect(Array.isArray(body.findings)).toBe(true);
  });
});
