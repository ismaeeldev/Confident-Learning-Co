import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PurchaseConsentForm } from "@/components/content/PurchaseConsentForm";

export const metadata: Metadata = {
  title: "Before you continue",
  robots: { index: false, follow: false },
};

/**
 * Phase 6 checkout consent page for the Guide — shown before the Stripe
 * button, per the client's explicit requirement that this cannot sit on
 * the Stripe element itself. See PurchaseConsentForm.tsx for the exact
 * copy and the immediate-delivery/14-day-hold logic.
 */
export default function GuideConsentPage() {
  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          <div>
            <h1 className="font-heading text-3xl">Before you continue</h1>
            <p className="text-brand-navy-800 mt-2 text-sm leading-relaxed">
              Just a couple of quick confirmations before payment.
            </p>
          </div>
          <PurchaseConsentForm productKey="guide" />
        </div>
      </Container>
    </Section>
  );
}
