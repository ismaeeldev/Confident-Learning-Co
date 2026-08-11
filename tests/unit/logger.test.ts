import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logger } from "@/lib/logger";

describe("logger redaction", () => {
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  it("redacts sensitive keys before logging", () => {
    logger.info("test event", {
      apiKey: "sk_live_super_secret",
      childName: "Riley",
      status: "ok",
    } as never);

    const loggedArg = logSpy.mock.calls[0]?.[0] as string;
    expect(loggedArg).toContain("[redacted]");
    expect(loggedArg).not.toContain("sk_live_super_secret");
    expect(loggedArg).not.toContain("Riley");
    expect(loggedArg).toContain("ok");
  });
});
