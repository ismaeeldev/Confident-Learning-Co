import { describe, expect, it } from "vitest";
import { isHoneypotTripped, createRateLimiter } from "@/lib/security";

describe("isHoneypotTripped", () => {
  it("is false for empty/undefined honeypot", () => {
    expect(isHoneypotTripped(undefined)).toBe(false);
    expect(isHoneypotTripped("")).toBe(false);
  });

  it("is true when a bot fills the honeypot", () => {
    expect(isHoneypotTripped("bot-value")).toBe(true);
  });
});

describe("createRateLimiter", () => {
  it("allows requests under the limit and blocks over it", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 60_000 });
    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip1").allowed).toBe(false);
  });

  it("tracks separate keys independently", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 60_000 });
    expect(limiter.check("ip1").allowed).toBe(true);
    expect(limiter.check("ip2").allowed).toBe(true);
  });
});
