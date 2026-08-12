"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { resetEnquiryFormSchema, type ResetEnquiryFormInput } from "@/domain/funnel/schemas";

/** Real, working Reset enquiry form — see docs/07-IntegrationContracts.md 7.9. No sales sequence, no automated suitability decision; a human (Jane/Adam) always reads and replies. */
export function ResetEnquiryForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error" | "rate_limited">("idle");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetEnquiryFormInput>({
    resolver: zodResolver(resetEnquiryFormSchema),
    defaultValues: { interest: "confidence_reset" },
  });

  async function onSubmit(data: ResetEnquiryFormInput) {
    setStatus("submitting");
    try {
      const response = await fetch("/api/forms/reset-enquiry", {
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
      reset({ interest: "confidence_reset" });
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="border-border bg-surface-sage mx-auto max-w-xl rounded-2xl border p-6 text-center sm:p-8">
        <h3 className="font-heading text-xl">Thank you — we&rsquo;ve got your note</h3>
        <p className="text-brand-sage-800 mt-1 text-sm">
          Jane or Adam will read this and get back to you personally.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-white mx-auto flex max-w-xl flex-col gap-4 rounded-2xl border p-6 sm:p-8"
      noValidate
    >
      <h3 className="font-heading text-xl">Not ready to book? Tell us about your situation</h3>

      <div>
        <Label htmlFor="reset-first-name">First name</Label>
        <Input
          id="reset-first-name"
          aria-invalid={!!errors.firstName}
          aria-describedby={errors.firstName ? "reset-first-name-error" : undefined}
          {...register("firstName")}
        />
        {errors.firstName && (
          <p id="reset-first-name-error" className="text-destructive mt-1 text-xs" role="alert">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="reset-email">Email address</Label>
        <Input
          id="reset-email"
          type="email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "reset-email-error" : undefined}
          {...register("email")}
        />
        {errors.email && (
          <p id="reset-email-error" className="text-destructive mt-1 text-xs" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Which are you interested in?</legend>
        <div className="mt-2 flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="confidence_reset" {...register("interest")} />
            The Confidence Reset
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="calm_reset" {...register("interest")} />
            The Calm Reset
          </label>
        </div>
      </fieldset>

      <div>
        <Label htmlFor="reset-message">A little about your situation</Label>
        <Textarea
          id="reset-message"
          rows={4}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "reset-message-error" : undefined}
          {...register("message")}
        />
        {errors.message && (
          <p id="reset-message-error" className="text-destructive mt-1 text-xs" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Honeypot */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
        {...register("honeypot")}
      />

      <Button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send"}
      </Button>

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
  );
}
