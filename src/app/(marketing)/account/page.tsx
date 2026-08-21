import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getSessionContactId } from "@/lib/session";
import { db } from "@/db/client";
import { contacts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { getDueCheckIn } from "@/domain/checkin/checkInStatus";
import { MemberCheckInForm } from "@/components/content/MemberCheckInForm";
import { getPendingDownload } from "@/domain/checkout/pendingDownload";
import { PendingDownloadCard } from "@/components/content/PendingDownloadCard";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

/**
 * Member home page (Phase 3, Annexe B section 5.3). Section order is
 * exact and load-bearing per the client's document: Inside the Loop,
 * Your Guide, Member packs, Talk it through, Workshops.
 *
 * Honest gap, not silently worked around: only Inside the Loop has a real
 * destination right now (Circle, once CIRCLE_COMMUNITY_URL is set and SSO
 * lands in Phase 5). Guide delivery, the packs pages, the Pathway route,
 * and Workshops don't exist yet in this codebase (later phases) — those
 * four render as "coming soon" rather than a broken or wrong link.
 */
export default async function AccountPage() {
  const contactId = await getSessionContactId();
  if (!contactId) {
    redirect(PUBLIC_ROUTES.login);
  }

  const [contact] = await db
    .select({ firstName: contacts.firstName })
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);

  const firstName = contact?.firstName ?? "there";
  const dueCheckIn = await getDueCheckIn(db, contactId);
  const pendingDownload = await getPendingDownload(db, contactId);

  const sections = [
    {
      label: "Inside the Loop",
      body: "Your space for live sessions, the Confidence Library, and small wins from other parents.",
      href: env.CIRCLE_COMMUNITY_URL || null,
    },
    {
      label: "Your Guide",
      body: "Read it again, or pick up where you left off.",
      href: null,
    },
    {
      label: "Member packs",
      body: "Extra support for the harder stretches.",
      href: null,
    },
    {
      label: "Talk it through",
      body: "Work out whether the deeper work is right for your family.",
      href: PUBLIC_ROUTES.pathway,
    },
    {
      label: "Workshops",
      body: "Live sessions you can join and ask questions in.",
      href: null,
    },
  ] as const;

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl">Welcome back, {firstName}.</h1>
            <p className="text-brand-navy-800 mt-2 text-lg">Everything you have access to is here.</p>
          </div>

          {pendingDownload && (
            <PendingDownloadCard
              releaseDate={pendingDownload.releaseDate.toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "Europe/London",
              })}
            />
          )}

          {dueCheckIn.dueDay && (
            <MemberCheckInForm day={dueCheckIn.dueDay} />
          )}

          <div className="flex flex-col gap-4">
            {sections.map((section) => (
              <div
                key={section.label}
                className="border-border bg-surface flex items-center justify-between gap-4 rounded-2xl border p-5"
              >
                <div>
                  <h2 className="font-heading text-lg">{section.label}</h2>
                  <p className="text-brand-navy-800 mt-1 text-sm">{section.body}</p>
                </div>
                {section.href ? (
                  <Link
                    href={section.href}
                    className="text-brand-sage-800 hover:text-brand-navy-900 inline-flex shrink-0 items-center gap-1 text-sm font-semibold"
                  >
                    Open
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </Link>
                ) : (
                  <span className="text-muted-foreground shrink-0 text-xs whitespace-nowrap">
                    Coming soon
                  </span>
                )}
              </div>
            ))}
          </div>

          <form action="/api/auth/logout" method="POST" className="mt-4">
            <button
              type="submit"
              className="text-brand-sage-800 hover:text-brand-navy-900 text-sm underline underline-offset-4"
            >
              Sign out
            </button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
