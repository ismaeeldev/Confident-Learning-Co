import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { db } from "@/db/client";
import { purchases } from "@/db/schema";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Your Pathway call",
  robots: { index: false, follow: false },
};

interface PathwayBookedPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Confirmation page (Phase 11, Annexe A route 4). Deliberately does not
 * state a date/time — "at this point there is not one" — and never
 * leaves a placeholder where one would go. Handles a visitor landing here
 * without a completed payment gracefully, per Annexe A's explicit
 * instruction, rather than a broken page.
 *
 * The booking page itself (/pathway/book) isn't built yet — blocked on
 * the client's unconfirmed Pathway price (top-level §10 item 3) — so this
 * page currently has nothing to link to it in practice. Built now anyway,
 * ready for when that page exists, since the lookup logic (purchases,
 * kind "pathway") already has its home in the schema.
 */
export default async function PathwayBookedPage({ searchParams }: PathwayBookedPageProps) {
  const { session_id: sessionId } = await searchParams;

  const purchase = sessionId
    ? (
        await db
          .select({ status: purchases.status, kind: purchases.kind })
          .from(purchases)
          .where(eq(purchases.stripeCheckoutSessionId, sessionId))
          .limit(1)
      )[0]
    : undefined;

  const isPaid = purchase?.kind === "pathway" && purchase?.status === "paid";

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="flex flex-col items-center gap-6 text-center">
          {isPaid ? (
            <>
              <h1 className="font-heading text-3xl sm:text-4xl">Your call is booked</h1>
              <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">
                Jane will be in touch within three working days to arrange a time.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl sm:text-4xl">Confirming your payment</h1>
              <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">
                We couldn&apos;t find a completed booking for this page yet. If you&apos;ve just
                paid, refresh this page in a moment — your confirmation will arrive by email
                either way.
              </p>
            </>
          )}
          <PrimaryCTA href={PUBLIC_ROUTES.memberHome}>Go to your account</PrimaryCTA>
        </div>
      </Container>
    </Section>
  );
}
