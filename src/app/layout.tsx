import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { JsonLd } from "@/components/content/JsonLd";
import { AnalyticsGate } from "@/components/analytics/AnalyticsGate";
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
          Client instruction (24 Aug 2026, refined 25 Aug 2026): Vercel
          Web Analytics only, Microsoft Clarity removed. Cookieless
          doesn't remove the UK consent requirement on its own, so this
          isn't a banner — it's a persistent "Cookies and tracking" link
          in the footer leading to a single on/off toggle, defaulting to
          on (see AnalyticsToggle.tsx on /cookies). AnalyticsGate reads
          that stored choice and renders (or withholds) Analytics
          accordingly.
        */}
        <AnalyticsGate />
      </body>
    </html>
  );
}
