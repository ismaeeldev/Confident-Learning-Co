import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { db } from "@/db/client";
import { purchases } from "@/db/schema";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Your Guide is on its way",
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * Never trusts the Stripe redirect itself as proof of payment — the
 * webhook is the source of truth. This page looks up the purchase row by
 * Checkout Session id and shows a "processing" state if the webhook
 * hasn't landed yet (which can happen within the first few seconds), or a
 * "ready" state once it has. See docs/00-ApplicationFlow.md 0.6.
 */
export default async function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  const purchase = sessionId
    ? (
        await db
          .select({ status: purchases.status })
          .from(purchases)
          .where(eq(purchases.stripeCheckoutSessionId, sessionId))
          .limit(1)
      )[0]
    : undefined;

  const isReady = purchase?.status === "paid";

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="flex flex-col items-center gap-6 text-center">
          {isReady ? (
            <>
              <h1 className="font-heading text-3xl sm:text-4xl">Your Guide is here</h1>
              <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">
                Check your email for the Guide and your private invitation to Inside the Loop.
                It should arrive within a few minutes.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl sm:text-4xl">Confirming your payment</h1>
              <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">
                This usually takes just a few seconds. Refresh this page in a moment, or check
                your email — your confirmation will arrive either way.
              </p>
            </>
          )}
          <PrimaryCTA href={PUBLIC_ROUTES.home}>Back to the homepage</PrimaryCTA>
        </div>
      </Container>
    </Section>
  );
}
