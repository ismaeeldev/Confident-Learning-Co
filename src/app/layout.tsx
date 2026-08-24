import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { JsonLd } from "@/components/content/JsonLd";
import { ServiceWorkerRegistration } from "@/components/ServiceWorkerRegistration";
import { brand } from "@/config/brand";
import { organizationJsonLd } from "@/lib/structuredData";
import { env } from "@/lib/env";
import "./globals.css";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Newsreader({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: {
    default: `${brand.name}: ${brand.tagline}`,
    template: `%s: ${brand.name}`,
  },
  description:
    "Parent education and coaching for rebuilding a child's confidence in learning, ages 6 to 16.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <JsonLd data={organizationJsonLd()} />
        <TooltipProvider>
          <a
            href="#main-content"
            className="bg-primary text-primary-foreground focus:ring-focus-ring sr-only rounded-md px-4 py-2 font-semibold focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:ring-3"
          >
            Skip to content
          </a>
          {children}
          <Toaster />
          <ServiceWorkerRegistration />
        </TooltipProvider>
        {/*
          Client instruction (24 Aug 2026): use Vercel Web Analytics only,
          remove Microsoft Clarity and the cookie consent banner entirely.
          Vercel Web Analytics is cookieless — it does not use cookies or
          any persistent client-side identifier, so there is nothing here
          for a visitor to consent to under PECR, and no consent banner is
          required for it. This replaces the previous GA4/Clarity/Meta
          Pixel consent-gated setup (src/components/analytics/AnalyticsLoader.tsx,
          ConsentBanner.tsx), both removed — none of those were ever
          actually configured with a live ID, so nothing observable
          changes for a visitor except the banner disappearing.
        */}
        <Analytics />
      </body>
    </html>
  );
}
