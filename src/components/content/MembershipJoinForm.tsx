"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  membershipJoinConsentSchema,
  MEMBERSHIP_JOIN_CONSENT_COPY,
  type MembershipJoinConsentInput,
} from "@/domain/checkout/membershipJoinSchemas";

/**
 * Membership join consent form. Copy and required fields are exact per
 * Build Addendum A v2.2, R1/R2 — the client's standing instruction for
 * this document is "used exactly as written," so MEMBERSHIP_JOIN_CONSENT_COPY
 * is rendered verbatim rather than paraphrased.
 */
export function MembershipJoinForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MembershipJoinConsentInput>({
    resolver: zodResolver(membershipJoinConsentSchema),
  });

  async function onSubmit(data: MembershipJoinConsentInput) {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/checkout/membership-join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body: { redirectUrl?: string; error?: string } = await response.json();
      if (!response.ok || !body.redirectUrl) {
        setStatus("error");
        setErrorMessage(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      window.location.assign(body.redirectUrl);
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-surface w-full rounded-2xl border p-6 text-left sm:p-8"
      noValidate
    >
      <div className="flex flex-col gap-4">
        <div>
          <Label htmlFor="join-full-legal-name">Full legal name</Label>
          <Input id="join-full-legal-name" type="text" {...register("fullLegalName")} />
          {errors.fullLegalName && (
            <p className="text-destructive mt-1 text-xs" role="alert">
              {errors.fullLegalName.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="join-postal-address">Postal address</Label>
          <Input id="join-postal-address" type="text" {...register("postalAddress")} />
          {errors.postalAddress && (
            <p className="text-destructive mt-1 text-xs" role="alert">
              {errors.postalAddress.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="join-telephone">Telephone number</Label>
          <Input id="join-telephone" type="tel" {...register("telephoneNumber")} />
          {errors.telephoneNumber && (
            <p className="text-destructive mt-1 text-xs" role="alert">
              {errors.telephoneNumber.message}
            </p>
          )}
        </div>

        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 size-4 shrink-0" {...register("ageConfirmed")} />
          <span className="text-brand-navy-800">{MEMBERSHIP_JOIN_CONSENT_COPY.ageConfirmed}</span>
        </label>
        {errors.ageConfirmed && (
          <p className="text-destructive -mt-2 text-xs" role="alert">
            You must confirm this to continue.
          </p>
        )}

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0"
            {...register("rulesAndPrivacyAgreed")}
          />
          <span className="text-brand-navy-800">
            {MEMBERSHIP_JOIN_CONSENT_COPY.rulesAndPrivacyAgreed}
          </span>
        </label>
        {errors.rulesAndPrivacyAgreed && (
          <p className="text-destructive -mt-2 text-xs" role="alert">
            You must agree to continue.
          </p>
        )}

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0"
            {...register("immediateAccessWaiver")}
          />
          <span className="text-brand-navy-800">
            {MEMBERSHIP_JOIN_CONSENT_COPY.immediateAccessWaiver}
          </span>
        </label>
        {errors.immediateAccessWaiver && (
          <p className="text-destructive -mt-2 text-xs" role="alert">
            You must agree to continue.
          </p>
        )}

        {/* Honeypot — hidden from real users via CSS, not display:none. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 overflow-hidden opacity-0"
          {...register("honeypot")}
        />

        <Button type="submit" disabled={status === "submitting"} className="mt-2">
          {status === "submitting" ? "Continuing…" : "Continue to payment"}
        </Button>

        {status === "error" && errorMessage && (
          <p className="text-destructive text-xs" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}
