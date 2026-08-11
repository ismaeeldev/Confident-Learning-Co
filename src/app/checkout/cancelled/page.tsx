import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default function CheckoutCancelledPage() {
  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl">No charge was made</h1>
          <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">
            Your checkout was cancelled and nothing was charged. If that was a mistake, you can
            head back to the Guide whenever you are ready.
          </p>
          <PrimaryCTA href={PUBLIC_ROUTES.parentGuide}>Back to the Parent Guide</PrimaryCTA>
        </div>
      </Container>
    </Section>
  );
}
