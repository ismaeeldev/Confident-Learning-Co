"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { newsletterFormSchema, type NewsletterFormInput } from "@/domain/funnel/schemas";

/**
 * Newsletter consent checkbox copy — DRAFT, not yet approved by the
 * client. Follows the same "pending review" convention as the legal
 * pages (docs/09-SecurityPrivacyCompliance.md) rather than inventing
 * final wording silently. Flag for review before launch.
 */
const CONSENT_TEXT_VERSION = "v1-draft-2026-08-12";
const CONSENT_LABEL =
  "I'd like occasional emails about new articles. I can unsubscribe at any time.";

/** Real, working newsletter signup form — see docs/07-IntegrationContracts.md 7.8. */
export function NewsletterFormSlot() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "rate_limited">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormInput>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { consentTextVersion: CONSENT_TEXT_VERSION },
  });

  async function onSubmit(data: NewsletterFormInput) {
    setStatus("submitting");
    try {
      const response = await fetch("/api/forms/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.status === 429) {
        setStatus("rate_limited");
        return;
      }
      if (!response.ok) {
        setStatus("error");
        return;
      }
      setStatus("success");
      reset({ email: "", firstName: "", consentTextVersion: CONSENT_TEXT_VERSION });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-border bg-surface-sage rounded-2xl border p-6 sm:p-8">
        <h2 className="font-heading text-xl">You&rsquo;re on the list</h2>
        <p className="text-brand-sage-800 mt-1 text-sm">
          Look out for new articles landing in your inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface-sage rounded-2xl border p-6 sm:p-8">
      <h2 className="font-heading text-xl">Get new articles by email</h2>
      <p className="text-brand-sage-800 mt-1 text-sm">
        Occasional, age-relevant, no spam. Unsubscribe any time.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex flex-col gap-3" noValidate>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <Label htmlFor="newsletter-email" className="sr-only">
              Email address
            </Label>
            <Input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "newsletter-email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="newsletter-email-error" className="text-destructive mt-1 text-xs" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? "Subscribing…" : "Subscribe"}
          </Button>
        </div>

        <label className="text-brand-sage-800 flex items-start gap-2 text-xs">
          <input type="checkbox" required className="mt-0.5" aria-label={CONSENT_LABEL} />
          <span>{CONSENT_LABEL}</span>
        </label>

        {/* Honeypot — hidden from real users via CSS, not display:none (some screen readers/bots ignore that), and never focusable. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 overflow-hidden opacity-0"
          {...register("honeypot")}
        />

        {status === "error" && (
          <p className="text-destructive text-xs" role="alert">
            Something went wrong. Please try again in a moment.
          </p>
        )}
        {status === "rate_limited" && (
          <p className="text-destructive text-xs" role="alert">
            Please wait a moment before trying again.
          </p>
        )}
      </form>
    </div>
  );
}
