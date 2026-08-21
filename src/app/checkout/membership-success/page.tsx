import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { db } from "@/db/client";
import { purchases, accessGrants } from "@/db/schema";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Welcome to Inside the Loop",
  robots: { index: false, follow: false },
};

interface MembershipSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

/**
 * R3 rebuild's payment-succeeds/invitation-window screen (client-confirmed
 * 20 Aug 2026, answering Adam's point 2): the member has definitely paid
 * by the time they land here, so this must never show anything resembling
 * an error, even if the Circle invitation genuinely failed to issue and is
 * mid-retry. "pending"/"failed" access-grant states both render the same
 * copy — the distinction exists for us (via the immediate admin alert +
 * exception list in processMembershipCheckout.ts), never for the member.
 *
 * Copy corrected 20 Aug 2026 to the client's exact wording
 * (source-files/Annexe_B_Copy_and_Context_Pack_v1-4.docx §10, "Payment
 * succeeded but access could not be granted") — an earlier paraphrase was
 * replaced; do not reword this again. Note the doc's own "email me within
 * twelve hours" line predates R3's 5-minute alert requirement — the
 * *parent-facing* wording stays as written below; the *internal* alert
 * timing is governed by R3, not this section.
 */
export default async function MembershipSuccessPage({ searchParams }: MembershipSuccessPageProps) {
  const { session_id: sessionId } = await searchParams;

  const result = sessionId
    ? (
        await db
          .select({ purchaseStatus: purchases.status, grantStatus: accessGrants.status })
          .from(purchases)
          .leftJoin(accessGrants, eq(accessGrants.purchaseId, purchases.id))
          .where(eq(purchases.stripeCheckoutSessionId, sessionId))
          .limit(1)
      )[0]
    : undefined;

  const isConfirmingPayment = !result;
  const isActive = result?.purchaseStatus === "paid" && result?.grantStatus === "active";

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="flex flex-col items-center gap-6 text-center">
          {isConfirmingPayment ? (
            <>
              <h1 className="font-heading text-3xl sm:text-4xl">Confirming your payment</h1>
              <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">
                This usually takes just a few seconds. Refresh this page in a moment, or check
                your email — your confirmation will arrive either way.
              </p>
            </>
          ) : isActive ? (
            <>
              <h1 className="font-heading text-3xl sm:text-4xl">You&apos;re in</h1>
              <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">
                Welcome to Inside the Loop. Check your email for your private invitation to the
                community — it should arrive within a few minutes.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-heading text-3xl sm:text-4xl">
                Your payment went through. We are setting up your access.
              </h1>
              <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">
                This usually takes a moment. If you have not heard from us within twelve hours,
                email adam@theconfidentlearningco.org and I will sort it out personally.
              </p>
            </>
          )}
          <PrimaryCTA href={PUBLIC_ROUTES.memberHome}>Go to your account</PrimaryCTA>
        </div>
      </Container>
    </Section>
  );
}
