import { describe, expect, it } from "vitest";
import { newsletterFormSchema, scoreAppCompletionSchema } from "@/domain/funnel/schemas";

describe("scoreAppCompletionSchema", () => {
  it("accepts a valid completion payload", () => {
    const result = scoreAppCompletionSchema.safeParse({
      firstName: "Sam",
      email: "sam@example.com",
      childBand: "middle",
      archetype: "archetype-pressure",
      marketingConsent: true,
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid child band", () => {
    const result = scoreAppCompletionSchema.safeParse({
      firstName: "Sam",
      email: "sam@example.com",
      childBand: "toddler",
      archetype: "archetype-pressure",
      marketingConsent: true,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid archetype key", () => {
    const result = scoreAppCompletionSchema.safeParse({
      firstName: "Sam",
      email: "sam@example.com",
      childBand: "middle",
      archetype: "archetype-unknown",
      marketingConsent: true,
    });
    expect(result.success).toBe(false);
  });
});

describe("newsletterFormSchema", () => {
  it("rejects submissions where the honeypot field is filled", () => {
    const result = newsletterFormSchema.safeParse({
      email: "parent@example.com",
      consentTextVersion: "v1",
      honeypot: "bot-filled-this",
    });
    expect(result.success).toBe(false);
  });
});
