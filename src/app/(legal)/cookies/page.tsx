import type { Metadata } from "next";
import { LegalPage } from "@/components/content/LegalPage";
import { brand } from "@/config/brand";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: `How ${brand.name} uses cookies.`,
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookies Policy" updatedAt="4 August 2026">
      <h2>What are cookies</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They help the
        site function correctly and, where you consent, help us understand how the site is used.
      </p>

      <h2>Cookies we use</h2>
      <p><strong>Essential cookies</strong>: always active, required for the site to function:</p>
      <ul>
        <li>Session and security cookies that keep the site working correctly</li>
        <li>Cookies required by Stripe to process payments securely</li>
      </ul>
      <p>
        <strong>Analytics cookies</strong>: only active where analytics are enabled and, where
        required, only after you consent:
      </p>
      <ul>
        <li>Google Analytics, to understand how visitors use the site</li>
        <li>Microsoft Clarity, to understand on-page behaviour</li>
      </ul>
      <p><strong>Marketing cookies</strong>: only active where enabled and consented to:</p>
      <ul>
        <li>Meta Pixel, to measure the effectiveness of any social advertising</li>
      </ul>

      <h2>Third-party embedded content</h2>
      <p>
        Some pages embed content from Stripe (checkout), Circle (community), and ScoreApp (the
        Reflection quiz). These providers may set their own cookies when their embedded content is
        active. Their use of cookies is governed by their own privacy and cookie policies.
      </p>

      <h2>Managing cookies</h2>
      <p>
        Where analytics or marketing cookies require consent, a cookie preference control will be
        provided on this site. You can also control or delete cookies at any time through your
        browser settings. Blocking essential cookies may affect the site&rsquo;s functionality,
        including checkout.
      </p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy as the cookies we use change. Check back periodically for updates.</p>
    </LegalPage>
  );
}
