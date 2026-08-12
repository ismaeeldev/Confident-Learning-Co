import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "This link isn't working",
  robots: { index: false, follow: false },
};

const REASON_COPY: Record<string, { heading: string; body: string }> = {
  expired: {
    heading: "This link has expired",
    body: "Links like this one are only valid for a couple of weeks for your security. Reach out and we'll send you a fresh one.",
  },
  already_used: {
    heading: "This link has already been used",
    body: "Each link only works once. If you didn't use it yourself, get in touch and we'll help.",
  },
  not_guide_owner: {
    heading: "We couldn't confirm this",
    body: "This link is for parents who already own the Learning Confidence Parent Guide. If that's you and something looks wrong, get in touch and we'll sort it.",
  },
  invalid: {
    heading: "This link isn't working",
    body: "It may have been copied incorrectly, or it's no longer valid. Get in touch and we'll send you a working one.",
  },
};

interface LinkInvalidPageProps {
  searchParams: Promise<{ reason?: string }>;
}

/** Friendly landing page for expired/invalid/already-used/non-owner signed links (Step 10). */
export default async function LinkInvalidPage({ searchParams }: LinkInvalidPageProps) {
  const { reason } = await searchParams;
  const copy = REASON_COPY[reason ?? ""] ?? REASON_COPY.invalid;

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl">{copy.heading}</h1>
          <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">{copy.body}</p>
          <PrimaryCTA href={PUBLIC_ROUTES.home}>Back to the homepage</PrimaryCTA>
        </div>
      </Container>
    </Section>
  );
}
