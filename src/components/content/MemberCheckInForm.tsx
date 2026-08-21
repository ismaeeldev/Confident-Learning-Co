"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { checkInSchema, type CheckInInput } from "@/domain/checkin/checkInSchema";
import type { CheckInDay } from "@/domain/checkin/checkInDays";

interface MemberCheckInFormProps {
  day: CheckInDay;
}

/**
 * Phase 12 check-in form. Copy below is a draft — the client hasn't
 * supplied exact wording for this item (unlike the consent/tick-box copy
 * elsewhere), flag before launch. Deliberately: no scoring shown back, no
 * clinical language, a plain 1-5 self-report that's stored but never
 * turned into a result the member sees.
 */
export function MemberCheckInForm({ day }: MemberCheckInFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckInInput>({
    resolver: zodResolver(checkInSchema),
    defaultValues: { day },
  });

  async function onSubmit(data: CheckInInput) {
    setStatus("submitting");
    try {
      const response = await fetch("/api/account/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="border-border bg-surface-sage rounded-2xl border p-6 text-center">
        <p className="text-brand-sage-800 text-sm">Thanks — that&apos;s noted.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-surface rounded-2xl border p-6 sm:p-8"
      noValidate
    >
      <input type="hidden" value={day} {...register("day", { valueAsNumber: true })} />
      <h2 className="font-heading text-xl">
        {day === 14 ? "Two weeks in — how's it going?" : "One month in — a quick check-in"}
      </h2>

      <div className="mt-5">
        <Label htmlFor="checkin-notes">How are things going at home?</Label>
        <textarea
          id="checkin-notes"
          rows={4}
          className="border-border bg-background mt-1 w-full rounded-xl border p-3 text-sm"
          {...register("howAreThingsGoing")}
        />
        {errors.howAreThingsGoing && (
          <p className="text-destructive mt-1 text-xs" role="alert">
            Let us know a little about how things are going.
          </p>
        )}
      </div>

      <div className="mt-5">
        <Label htmlFor="checkin-scale">
          On a scale of 1 to 5, how confident are you feeling about the changes you&apos;re making?
        </Label>
        <select
          id="checkin-scale"
          defaultValue=""
          className="border-border bg-background mt-1 w-full rounded-xl border p-3 text-sm"
          {...register("confidenceScale", { valueAsNumber: true })}
        >
          <option value="" disabled>
            Choose a number
          </option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        {errors.confidenceScale && (
          <p className="text-destructive mt-1 text-xs" role="alert">
            Pick a number from 1 to 5.
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

      <Button type="submit" disabled={status === "submitting"} className="mt-5">
        {status === "submitting" ? "Sending…" : "Send check-in"}
      </Button>

      {status === "error" && (
        <p className="text-destructive mt-3 text-xs" role="alert">
          Something went wrong. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
