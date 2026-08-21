import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { getSessionContactId } from "@/lib/session";
import { isGuideOwner, hasActiveMembership } from "@/domain/access/gates";
import { db } from "@/db/client";
import { contacts } from "@/db/schema";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Talk it through",
  robots: { index: false, follow: false },
};

/**
 * Fit Check page (Phase 11, Annexe A/B §8/§13.1). Active members only —
 * gated on both Guide ownership and active membership (Phase 4's gates),
 * per Annexe A: "Everybody else gets whatever the site already does for a
 * members-only page." The quiz itself lives entirely in ScoreApp; this
 * page only explains the call, shows the versioned processing notice, and
 * captures the one required acknowledgement tick before building the
 * server-side link (see the POST route below).
 */
export default async function PathwayPage() {
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

  const [contact] = await db
    .select({ firstName: contacts.firstName, email: contacts.email })
    .from(contacts)
    .where(eq(contacts.id, contactId))
    .limit(1);

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <div className="flex flex-col gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl">Talk it through</h1>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              Some families need something more involved than the everyday work. Working out
              whether yours is one of them is not something you should have to guess at, and it
              is not something we will guess at either.
            </p>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              A Pathway call is thirty minutes with Jane Roser, our Pathway Coordinator. She will
              ask about where things are at home, what you have already tried, and what you are
              hoping changes. Then she will tell you plainly whether the deeper work is right for
              your family, including when the answer is no.
            </p>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              Jane is not there to sell you anything. She is there to work out the truth of it
              with you, and she is the only person here who can.
            </p>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              Before you book, we ask you to answer a few questions. It takes about four minutes.
              It exists so that nobody pays to be told in the first five minutes that we are not
              the right service.
            </p>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              Jane replies within three working days of your call being booked.
            </p>
          </div>

          <div className="border-border bg-surface rounded-2xl border p-6 sm:p-8">
            <p className="text-brand-navy-800 text-sm leading-relaxed">
              Your answers are read by Adam and by Jane, our Pathway Coordinator, and by nobody
              else.
            </p>
            <p className="text-brand-navy-800 mt-3 text-sm leading-relaxed">
              We use the result to decide what we send you next, and if you book a call, to
              prepare for it. Your answers are never shared outside The Confident Learning Co. and
              they are deleted within four months. You can ask us to delete them sooner by
              emailing privacy@theconfidentlearningco.org.
            </p>

            <form
              action="/api/pathway/acknowledge"
              method="POST"
              className="mt-6 flex flex-col gap-4"
            >
              <label className="flex items-start gap-3 text-sm">
                <input type="checkbox" required className="mt-0.5 size-4 shrink-0" name="acknowledged" />
                <span className="text-brand-navy-800">
                  I have read the above and I am ready to answer a few questions about how things
                  are at home.
                </span>
              </label>

              <Button type="submit" size="lg" className="w-full">
                Continue
              </Button>
            </form>
          </div>

          {!contact?.email && (
            <p className="text-destructive text-center text-sm" role="alert">
              We couldn&apos;t find your account details. Please sign in again.
            </p>
          )}
        </div>
      </Container>
    </Section>
  );
}
