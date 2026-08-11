import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { brand } from "@/config/brand";
import { membershipConfig } from "@/config/products";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply to using ${brand.name}.`,
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updatedAt="4 August 2026">
      <h2>1. Introduction</h2>
      <p>
        These terms apply when you use this website, take the Reflection, purchase the Parent
        Guide or any practical pack, or join Inside the Loop. By using the service, you agree to
        these terms.
      </p>

      <h2>2. What we provide</h2>
      <p>
        {brand.name} provides parent education and coaching content: the free Reflection, the
        Parent Guide, practical packs, the Inside the Loop membership community, and, for
        qualifying members, the Group Programme and 1:1 Resets accessed via a Pathway call.
      </p>

      <h2>3. Not medical or clinical advice</h2>
      <p>
        This service is parent education and coaching. It is not therapy, counselling, or
        assessment, and it is not a substitute for the advice of a GP, school, or qualified mental
        health professional. We do not diagnose, treat, or assess any condition. If your child is
        showing signs of significant or persistent distress, please speak to your GP or your
        child&rsquo;s school first.
      </p>

      <h2>4. Purchases and payment</h2>
      <p>
        All payments are processed securely through Stripe. Prices are shown in GBP and are
        correct at the time of purchase. We reserve the right to change prices for future
        purchases; your existing purchase or membership price is not affected retroactively.
      </p>

      <h2>5. The Parent Guide and included trial</h2>
      <p>
        Purchasing the Parent Guide includes a {membershipConfig.includedDays}-day trial of Inside
        the Loop membership. A payment card is required to start the trial. Unless you cancel
        before the {membershipConfig.includedDays} days end, your membership will automatically
        continue at {membershipConfig.priceMinor / 100}{" "}
        {membershipConfig.currency.toUpperCase()} per {membershipConfig.billingInterval}, billed
        to the same card. We will remind you before the trial ends so this is never a surprise.
      </p>

      <h2>6. Cancellation</h2>
      <p>
        You may cancel your Inside the Loop membership at any time. Cancellation takes effect
        immediately and access ends at the point of cancellation.
      </p>

      <h2>7. Refunds and disputes</h2>
      <p>
        Refund requests and payment disputes are reviewed individually. See our{" "}
        <a href="/refund-policy">Refund Policy</a> for details.
      </p>

      <h2>8. Community conduct</h2>
      <p>
        Inside the Loop is a supportive community for parents. We expect respectful conduct at all
        times. We may suspend or remove access for conduct that breaches community guidelines or
        these terms.
      </p>

      <h2>9. Ownership of content</h2>
      <p>
        The Parent Guide, practical packs, and all course materials remain the property of{" "}
        {brand.name}. Purchasing access does not transfer ownership or grant a right to
        redistribute, resell, or publicly share this content.
      </p>

      <h2>10. Guide ownership and re-entry</h2>
      <p>
        Once you have purchased the Parent Guide, that ownership is permanent. If your Inside the
        Loop membership lapses, you may rejoin at any time at the then-current membership price
        without repurchasing the Guide.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        We provide this service with reasonable care and skill. To the extent permitted by law, we
        are not liable for indirect or consequential losses arising from use of the service. Final
        liability terms will be confirmed with legal review.
      </p>

      <h2>12. Governing law</h2>
      <p>These terms are governed by the law of England and Wales.</p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the service after a change
        constitutes acceptance of the updated terms.
      </p>

      <h2>14. Contact us</h2>
      <p>For any question about these terms, contact us at the support address supplied once confirmed.</p>
    </LegalPage>
  );
}
