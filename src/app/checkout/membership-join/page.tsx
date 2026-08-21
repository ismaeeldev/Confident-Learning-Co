import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { getSessionContactId } from "@/lib/session";
import { db } from "@/db/client";
import { isGuideOwner } from "@/domain/access/gates";
import { MembershipJoinForm } from "@/components/content/MembershipJoinForm";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Continue your membership",
  robots: { index: false, follow: false },
};

/**
 * Membership join route (Phase 3 build note, added by the client's 20 Aug
 * 2026 answer). Where an already-signed-in-via-old-link parent lands to
 * confirm consent before being handed to Circle's own native paywall
 * checkout — see recordMembershipJoinConsent.ts for the confirmed design:
 * consent is recorded here, Circle's billing itself is unchanged.
 *
 * Requires a session — this route never signs anyone in itself, only the
 * login flow (Phase 3) does that.
 *
 * Gated (Phase 4): membership can only be joined by an existing Guide
 * owner — the Guide is the site's single public paid entry point
 * (IMMUTABLE_RULES.singlePublicPaidEntryPoint), and joining without owning
 * it would create membership access with no Guide purchase behind it.
 * Deliberately not gated on *active membership* — the whole point of this
 * route is for a Guide owner who is not yet (or no longer) an active
 * member to become one.
 */
export default async function MembershipJoinPage() {
  const contactId = await getSessionContactId();
  if (!contactId) {
    redirect(PUBLIC_ROUTES.login);
  }

  if (!(await isGuideOwner(db, contactId))) {
    redirect(`${PUBLIC_ROUTES.accessPending}?reason=not_guide_owner`);
  }

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          <div>
            <h1 className="font-heading text-3xl">Continue your membership</h1>
            <p className="text-brand-navy-800 mt-2 text-sm leading-relaxed">
              Just a couple of quick confirmations before we take you through to payment.
            </p>
          </div>
          <MembershipJoinForm />
        </div>
      </Container>
    </Section>
  );
}
