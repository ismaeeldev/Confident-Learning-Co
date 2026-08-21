"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { loginRequestSchema, type LoginRequestInput } from "@/domain/auth/schemas";

interface LoginFormProps {
  /** Allowlisted path to continue to after the magic link is verified — e.g. the membership join route for old continuation/re-entry link visitors. Omit for the ordinary member-home destination. */
  next?: string;
}

/** Passwordless sign-in form (Phase 3). Copy exact per Annexe B section 5.1. */
export function LoginForm({ next }: LoginFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequestInput>({
    resolver: zodResolver(loginRequestSchema),
  });

  async function onSubmit(data: LoginRequestInput) {
    setStatus("submitting");
    try {
      const response = await fetch("/api/auth/request-login-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, next }),
      });
      if (!response.ok) {
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border-border bg-surface-sage w-full rounded-2xl border p-6 sm:p-8">
        <h1 className="font-heading text-2xl">Check your email.</h1>
        <p className="text-brand-sage-800 mt-2 text-sm leading-relaxed">
          If that email address is registered with us, a sign-in link is on its way. It works for
          the next fifteen minutes. If it does not arrive, check your spam folder before trying
          again.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border bg-surface w-full rounded-2xl border p-6 sm:p-8">
      <h1 className="font-heading text-2xl">Sign in</h1>
      <p className="text-brand-navy-800 mt-2 text-sm leading-relaxed">
        Enter the email address you used when you bought your Guide and we will send you a link
        to sign in. No password to remember.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-3" noValidate>
        <div className="text-left">
          <Label htmlFor="login-email" className="sr-only">
            Email address
          </Label>
          <Input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            {...register("email")}
          />
          {errors.email && (
            <p id="login-email-error" className="text-destructive mt-1 text-xs" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Honeypot — hidden from real users via CSS, not display:none. */}
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute h-0 w-0 overflow-hidden opacity-0"
          {...register("honeypot")}
        />

        <Button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send me a link"}
        </Button>

        {status === "error" && (
          <p className="text-destructive text-xs" role="alert">
            Something went wrong. Please try again in a moment.
          </p>
        )}
      </form>
    </div>
  );
}
