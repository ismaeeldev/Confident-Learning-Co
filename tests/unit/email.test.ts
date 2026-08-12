import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("sendAdminNotificationEmail", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("safely no-ops (does not call fetch) when RESEND_API_KEY is not set", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("ADMIN_ALERT_EMAIL", "adam@example.invalid");
    const fetchSpy = vi.spyOn(global, "fetch");

    const { sendAdminNotificationEmail } = await import("@/lib/email");
    await sendAdminNotificationEmail({ subject: "Test", text: "Test body" });

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("safely no-ops when ADMIN_ALERT_EMAIL is not set, even with a Resend key", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("ADMIN_ALERT_EMAIL", "");
    const fetchSpy = vi.spyOn(global, "fetch");

    const { sendAdminNotificationEmail } = await import("@/lib/email");
    await sendAdminNotificationEmail({ subject: "Test", text: "Test body" });

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("calls Resend's API when both are configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("ADMIN_ALERT_EMAIL", "adam@example.invalid");
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

    const { sendAdminNotificationEmail } = await import("@/lib/email");
    await sendAdminNotificationEmail({ subject: "Test", text: "Test body" });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://api.resend.com/emails",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("throws when Resend's API returns a non-ok response", async () => {
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
    vi.stubEnv("ADMIN_ALERT_EMAIL", "adam@example.invalid");
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("bad request", { status: 400 }));

    const { sendAdminNotificationEmail } = await import("@/lib/email");
    await expect(sendAdminNotificationEmail({ subject: "Test", text: "Test body" })).rejects.toThrow();
  });
});
