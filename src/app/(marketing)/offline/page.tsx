import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

/**
 * Offline fallback page. Precached by the service worker (public/sw.js) and
 * shown only when a navigation request fails with no network connection.
 * Not indexed, not linked from navigation — it's a fallback, not a page.
 */
export default function OfflinePage() {
  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="font-heading text-3xl sm:text-4xl">You&apos;re offline</h1>
          <p className="text-brand-navy-800 max-w-xl text-lg leading-relaxed">
            It looks like your connection has dropped. Take a breath, check your Wi-Fi or signal,
            and try again when you&apos;re back online.
          </p>
          <PrimaryCTA href={PUBLIC_ROUTES.home}>Back to the homepage</PrimaryCTA>
        </div>
      </Container>
    </Section>
  );
}
