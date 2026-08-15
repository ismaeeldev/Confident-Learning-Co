import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${brand.name} collects, uses, and protects your data.`,
  robots: { index: false, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="4 August 2026">
      <h2>Who we are</h2>
      <p>
        {brand.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) operates this website and the Inside the
        Loop community for parents of children aged 6 to 16. Our registered business details and
        data-controller contact information will be added here once supplied by the client.
      </p>

      <h2>What information we collect</h2>
      <p>We collect only what is needed to deliver the service, process payment, and provide support:</p>
      <ul>
        <li>Your name and email address, when you take the Reflection, subscribe to our newsletter, or make a purchase</li>
        <li>Your child&rsquo;s school year band (a broad age range, not a birthdate or name), used to tailor content</li>
        <li>Marketing consent status and the date it was given, if you opt in</li>
        <li>Purchase, membership, and community access records</li>
        <li>Support and enquiry messages you send us</li>
      </ul>
      <p>
        We do not store your child&rsquo;s full Reflection quiz answers, open-text responses, detailed
        personal circumstances, or any clinical or diagnostic information. We do not require your
        child&rsquo;s name to provide the service.
      </p>

      <h2>How we use your information</h2>
      <p>We use your information to:</p>
      <ul>
        <li>Deliver the Parent Guide and any packs you purchase</li>
        <li>Provision and manage your access to the Inside the Loop community</li>
        <li>Send you Reflection results and, only with your separate consent, our nurture email sequence</li>
        <li>Process payments securely and manage your membership</li>
        <li>Respond to support requests and enquiries</li>
        <li>Maintain records required for accounting, fraud prevention, and legal compliance</li>
      </ul>

      <h2>Consent and marketing</h2>
      <p>
        Receiving your Reflection result never requires marketing consent. The marketing consent
        checkbox is separate, optional, and unticked by default. You can withdraw consent at any
        time using the unsubscribe link in any email we send. Purchasing the Parent Guide does not
        automatically enrol you in marketing emails.
      </p>

      <h2>Who we share information with</h2>
      <p>We use the following third-party services to operate the platform. Each processes only the data necessary for its function:</p>
      <ul>
        <li><strong>Stripe</strong>: payment processing. We never see or store your full card details.</li>
        <li><strong>Kit</strong>: email delivery, subscriber tags, and nurture sequences.</li>
        <li><strong>Circle</strong>: hosting the private Inside the Loop community.</li>
        <li><strong>ScoreApp</strong>: hosting and scoring the Reflection quiz.</li>
        <li><strong>Neon</strong>: secure database hosting for operational records.</li>
        <li><strong>Vercel</strong>: website hosting and delivery.</li>
      </ul>
      <p>We do not sell your personal information to any third party.</p>

      <h2>Cookies</h2>
      <p>
        See our <a href="/cookies">Cookies Policy</a> for details of the cookies used on this site
        and how to manage them.
      </p>

      <h2>Data retention</h2>
      <p>
        We keep your data for as long as your account or membership is active, and for a limited
        period afterward to meet our accounting and legal obligations. Exact retention periods per
        data category will be confirmed and added here.
      </p>

      <h2>Your rights</h2>
      <p>Under UK data protection law, you have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Ask us to correct inaccurate data</li>
        <li>Ask us to delete your data, subject to our legal obligations</li>
        <li>Restrict or object to certain processing</li>
        <li>Request a copy of your data in a portable format</li>
        <li>Withdraw consent at any time where we rely on consent</li>
        <li>Complain to the Information Commissioner&rsquo;s Office (ICO) if you believe we have mishandled your data</li>
      </ul>

      <h2>Children&rsquo;s data</h2>
      <p>
        This service is provided to parents and carers, not directly to children. We collect only
        your child&rsquo;s broad school-year band from you, the parent, and do not knowingly
        collect personal data directly from children.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;last updated&rdquo; date at the
        top of this page will reflect the most recent revision.
      </p>

      <h2>Contact us</h2>
      <p>
        For any question about this policy or to exercise your data rights, contact us at the
        support address supplied once confirmed.
      </p>
    </LegalPage>
  );
}
