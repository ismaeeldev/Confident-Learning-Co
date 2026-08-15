import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { brand } from "@/config/brand";
import { membershipConfig } from "@/config/products";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: `Our refund and cancellation policy at ${brand.name}.`,
  robots: { index: false, follow: true },
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updatedAt="4 August 2026">
      <h2>The Learning Confidence Parent Guide</h2>
      <p>
        The Parent Guide is a digital product delivered immediately on purchase. Refund requests
        are reviewed individually, on a case-by-case basis. Contact us with your order details and
        the reason for your request.
      </p>

      <h2>Inside the Loop membership</h2>
      <p>
        The included {membershipConfig.includedDays}-day trial that comes with the Parent Guide
        can be cancelled at any time before it ends at no charge. Once the trial ends and your
        first membership payment has been taken, that payment is not refundable, but you may
        cancel at any time to stop future billing. Cancellation takes effect immediately.
      </p>

      <h2>Practical packs</h2>
      <p>
        Practical packs are digital products delivered immediately on purchase. As with the Guide,
        refund requests are reviewed individually.
      </p>

      <h2>Group Programme and 1:1 Resets</h2>
      <p>
        Refund terms for the Group Programme and 1:1 Resets will be confirmed at the time of
        booking, following your Pathway call.
      </p>

      <h2>Payment disputes</h2>
      <p>
        If you believe you have been charged in error, please contact us before raising a dispute
        with your bank or card provider; we can usually resolve this faster directly. All
        disputes and chargebacks are reviewed manually.
      </p>

      <h2>How to request a refund</h2>
      <p>
        Contact us at the support address supplied once confirmed, with your order or membership
        details and the reason for your request. We aim to respond within a reasonable timeframe.
      </p>

      <h2>Your statutory rights</h2>
      <p>
        This policy sits alongside, and does not affect, your statutory consumer rights under UK
        law.
      </p>
    </LegalPage>
  );
}
