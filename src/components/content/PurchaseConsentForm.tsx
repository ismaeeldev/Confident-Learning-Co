"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  purchaseConsentSchema,
  PURCHASE_CONSENT_COPY,
  type PurchaseConsentInput,
} from "@/domain/checkout/purchaseConsentSchema";
import { DELIVERY_HOLD_DAYS, PUBLIC_ROUTES, type ProductKey } from "@/config/canon";

interface PurchaseConsentFormProps {
  productKey: ProductKey;
}

/**
 * R1 checkout consent (Build Addendum A v2.8, rewritten 22 Aug 2026) —
 * four boxes, not two. Copy is exact per PURCHASE_CONSENT_COPY, not
 * paraphrased. Boxes 1–2 (age, terms) are required; boxes 3–4 (immediate
 * delivery, cancellation-right acknowledgement) are genuinely optional and
 * must never block submission on their own — declining either or both
 * just changes what happens next (14-day delivery hold), never whether
 * checkout proceeds. Immediate release only happens when *both* optional
 * boxes are ticked.
 */
export function PurchaseConsentForm({ productKey }: PurchaseConsentFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<PurchaseConsentInput>({
    resolver: zodResolver(purchaseConsentSchema),
    defaultValues: { productKey, immediateDeliveryConsent: false, cancellationRightAcknowledged: false },
  });

  // Live release-date line (Build Change Request 01): computed client-side
  // from today, same DELIVERY_HOLD_DAYS the server actually uses, so it's
  // never allowed to drift out of sync with the real hold logic. useWatch
  // (not form.watch) is the React Compiler-safe subscription API. R1.1:
  // release only happens once BOTH optional boxes are ticked, so the
  // "held" message shows unless both are true.
  const immediateDeliveryConsentTicked = useWatch({ control, name: "immediateDeliveryConsent" });
  const cancellationRightAcknowledgedTicked = useWatch({ control, name: "cancellationRightAcknowledged" });
  const willReleaseImmediately = immediateDeliveryConsentTicked && cancellationRightAcknowledgedTicked;
  // Lazy useState initializer, not a plain render-time call — Date.now()
  // is impure and React Compiler rejects calling it directly in the
  // render body; this runs exactly once, on mount, which is what's wanted
  // here anyway (the date shouldn't shift mid-session on a re-render).
  const [releaseDate] = useState(() =>
    new Date(Date.now() + DELIVERY_HOLD_DAYS * 24 * 60 * 60 * 1000).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );

  async function onSubmit(data: PurchaseConsentInput) {
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const response = await fetch("/api/checkout/guide/consent", {
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
      <input type="hidden" value={productKey} {...register("productKey")} />

      <div className="flex flex-col gap-4">
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 size-4 shrink-0" {...register("ageConfirmed")} />
          <span className="text-brand-navy-800">{PURCHASE_CONSENT_COPY.ageConfirmed}</span>
        </label>
        {errors.ageConfirmed && (
          <p className="text-destructive -mt-2 text-xs" role="alert">
            You must confirm you are 18 or over to continue.
          </p>
        )}

        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" className="mt-0.5 size-4 shrink-0" {...register("termsAgreed")} />
          {/* R13.3: each of the three document names in this box is a link
              to its current page, opening in a new tab, so reading them
              never navigates the buyer away from checkout or loses
              anything already entered. Wording is otherwise verbatim from
              PURCHASE_CONSENT_COPY.termsAgreed — only the three document
              names become links, nothing else changes. */}
          <span className="text-brand-navy-800">
            I have read and agree to the{" "}
            <a
              href={PUBLIC_ROUTES.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Terms and Conditions of Sale
            </a>
            , the{" "}
            <a
              href={PUBLIC_ROUTES.communityTerms}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Community Terms of Use
            </a>{" "}
            and the{" "}
            <a
              href={PUBLIC_ROUTES.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              Privacy Notice
            </a>
            .
          </span>
        </label>
        {errors.termsAgreed && (
          <p className="text-destructive -mt-2 text-xs" role="alert">
            You must agree to continue.
          </p>
        )}

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0"
            {...register("immediateDeliveryConsent")}
          />
          <span className="text-brand-navy-800">{PURCHASE_CONSENT_COPY.immediateDeliveryConsent}</span>
        </label>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 size-4 shrink-0"
            {...register("cancellationRightAcknowledged")}
          />
          <span className="text-brand-navy-800">{PURCHASE_CONSENT_COPY.cancellationRightAcknowledged}</span>
        </label>

        {!willReleaseImmediately && (
          <p className="text-muted-foreground -mt-2 pl-7 text-xs leading-relaxed">
            Leave either of these unticked and we will hold your download until {releaseDate}, so
            you keep your right to change your mind. You can release it earlier from your account
            at any time.
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

        <p className="text-muted-foreground text-center text-xs">
          Read our{" "}
          <a href="/refund-policy" className="underline underline-offset-2">
            refunds and cancellations
          </a>{" "}
          before you continue.
        </p>

        {status === "error" && errorMessage && (
          <p className="text-destructive text-xs" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}
