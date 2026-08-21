import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getSessionContactId } from "@/lib/session";
import { isGuideOwner, hasActiveMembership } from "@/domain/access/gates";
import { db } from "@/db/client";
import { PUBLIC_ROUTES, FOUNDERS_CLOSE_DATE } from "@/config/canon";
import { products, formatMinorAsGbp } from "@/config/products";
import { BookPathwayCallButton } from "@/components/content/BookPathwayCallButton";

export const metadata: Metadata = {
  title: "Book your Pathway call",
  robots: { index: false, follow: false },
};

/**
 * Pathway booking page (Phase 11, Annexe A route 3) — the page Annexe C's
 * Fit Check result links to on the Pathway Call outcome. Gated the same
 * way as /pathway itself. Price is never hand-typed here — it's read
 * from the same founders/full switch used by the checkout route
 * (FOUNDERS_CLOSE_DATE), so the page can never show a stale price. No
 * struck-through comparison price, matching the same legal rule
 * (Annexe B §12A) already applied to the Guide's founders pricing.
 */
export default async function PathwayBookPage() {
  const contactId = await getSessionContactId();
  if (!contactId) {
    redirect(PUBLIC_ROUTES.login);
  }
  if (!(await isGuideOwner(db, contactId))) {
    redirect(`${PUBLIC_ROUTES.accessPending}?reason=not_guide_owner`);
  }
  if (!(await hasActiveMembership(db, contactId))) {
    redirect(`${PUBLIC_ROUTES.accessPending}?reason=not_active_member`);
  }

  const isFoundersWindowOpen = new Date() < FOUNDERS_CLOSE_DATE;
  const priceMinor = isFoundersWindowOpen
    ? products.pathway.founderPriceMinor
    : products.pathway.fullPriceMinor;

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="mx-auto flex max-w-2xl flex-col gap-8 text-center">
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-3xl sm:text-4xl">Book your Pathway call</h1>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              Thirty minutes with Jane, our Pathway Coordinator. She&apos;ll ask about your actual
              evenings, and at the end tell you plainly what she thinks is right for your family —
              including when the answer is that we&apos;re not the right service for you at the
              moment.
            </p>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              Jane replies within three working days of your call being booked.
            </p>
          </div>

          <div className="border-border bg-surface rounded-2xl border p-6 sm:p-8">
            <p className="text-brand-navy-950 font-heading text-3xl">
              {priceMinor !== null ? formatMinorAsGbp(priceMinor) : "Price unavailable"}
            </p>
            <p className="text-brand-navy-700 mt-1 text-sm">One-off payment, not recurring.</p>
            <div className="mt-6">
              <BookPathwayCallButton />
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
