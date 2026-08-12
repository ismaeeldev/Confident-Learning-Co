import { describe, expect, it } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns ok status with a working database connection", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe("ok");
    expect(body.database).toBe("ok");
    expect(typeof body.timestamp).toBe("string");
    expect(typeof body.durationMs).toBe("number");
  });

  it("never leaks a connection string or secret value in the response", async () => {
    const response = await GET();
    const bodyText = JSON.stringify(await response.json());

    expect(bodyText).not.toContain("postgresql://");
    expect(bodyText).not.toContain("neon.tech");
  });
});
