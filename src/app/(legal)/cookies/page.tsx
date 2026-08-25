import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { AnalyticsToggle } from "@/components/content/AnalyticsToggle";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: `How ${brand.name} uses cookies.`,
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookies Policy" updatedAt="24 August 2026">
      <h2>What are cookies</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website, used to help
        the site function correctly or to remember information about your visit.
      </p>

      <h2>Cookies we use</h2>
      <p><strong>Essential cookies</strong>: always active, required for the site to function:</p>
      <ul>
        <li>Session and security cookies that keep the site working correctly</li>
        <li>Cookies required by Stripe to process payments securely</li>
      </ul>

      <h2>Analytics — no cookies used</h2>
      <p>
        We use Vercel Web Analytics to understand how visitors use the site. It does not use
        cookies or any other persistent identifier on your device — it works by processing page
        view data anonymously, without tracking you individually across visits or across other
        websites.
      </p>
      <p>
        We do not use Google Analytics, Microsoft Clarity, Meta Pixel, or any other cookie-based
        analytics or advertising tool.
      </p>
      <p>Analytics is on by default. You can switch it off for your browser below.</p>
      <AnalyticsToggle />

      <h2>Third-party embedded content</h2>
      <p>
        Some pages embed content from Stripe (checkout), Circle (community), and ScoreApp (the
        Reflection quiz). These providers may set their own cookies when their embedded content is
        active. Their use of cookies is governed by their own privacy and cookie policies.
      </p>

      <h2>Managing cookies</h2>
      <p>
        You can control or delete cookies at any time through your browser settings. Blocking
        essential cookies may affect the site&rsquo;s functionality, including checkout.
      </p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy as the cookies we use change. Check back periodically for updates.</p>
    </LegalPage>
  );
}
