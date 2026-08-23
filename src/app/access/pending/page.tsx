import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { PUBLIC_ROUTES } from "@/config/canon";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "Access needed",
  robots: { index: false, follow: false },
};

interface AccessPendingPageProps {
  searchParams: Promise<{ reason?: string }>;
}

/**
 * Shared "fail closed with a clear message" landing page for Phase 4's
 * gates — never a blank page or a 500 when membership state is
 * insufficient or undetermined.
 */
export default async function AccessPendingPage({ searchParams }: AccessPendingPageProps) {
  const { reason } = await searchParams;

  // R5.3 (Build Addendum A v2.8): continuation is sold through Circle's
  // own native paywall, not a website checkout — the old website-driven
  // /checkout/membership-join flow is withdrawn. Computed per-request
  // (not a module-level constant) so it reads env.ts safely as a server
  // component. Client-owed URL, not yet supplied — safely falls back to
  // a contact link rather than a broken or guessed address.
  const membershipCtaHref = env.CIRCLE_MEMBERSHIP_PAYWALL_URL ?? "mailto:adam@theconfidentlearningco.org";
  const membershipCtaLabel = env.CIRCLE_MEMBERSHIP_PAYWALL_URL ? "Continue your membership" : "Contact us to continue";

  const reasonCopy: Record<string, { heading: string; body: string; ctaLabel: string; ctaHref: string }> = {
    signed_out: {
      heading: "Sign in to continue",
      body: "You'll need to sign in first.",
      ctaLabel: "Sign in",
      ctaHref: PUBLIC_ROUTES.login,
    },
    not_guide_owner: {
      heading: "This is for Guide owners",
      body: "This part of the site is only available to parents who own the Learning Confidence Parent Guide.",
      ctaLabel: "Get the Guide",
      ctaHref: PUBLIC_ROUTES.parentGuide,
    },
    not_active_member: {
      heading: "This is for Inside the Loop members",
      body: "This part of the site is only available to parents with active Inside the Loop membership.",
      ctaLabel: membershipCtaLabel,
      ctaHref: membershipCtaHref,
    },
  };
  const copy = reasonCopy[reason ?? ""] ?? reasonCopy.signed_out;

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl">{copy.heading}</h1>
          <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">{copy.body}</p>
          <PrimaryCTA href={copy.ctaHref}>{copy.ctaLabel}</PrimaryCTA>
        </div>
      </Container>
    </Section>
  );
}
