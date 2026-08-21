import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LoginForm } from "@/components/content/LoginForm";
import { PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ reason?: string; notice?: string }>;
}

/**
 * Draft copy, not yet client-confirmed — flag for review. The client's
 * documents don't supply exact wording for "you clicked an old
 * continue-membership/re-entry email link", since that scenario is new
 * as of the 20 Aug 2026 redesign. This is a plain, non-legal transitional
 * notice, not consent copy, so a reasonable draft is used here rather
 * than leaving the page blank — but it should be confirmed, not assumed.
 */
const OLD_LINK_NOTICE: Record<string, string> = {
  "continue-membership":
    "We've changed how this link works. Sign in below and we'll take you to the right place to continue your membership.",
  "re-entry":
    "We've changed how this link works. Sign in below and we'll take you to the right place to rejoin.",
};

/**
 * Passwordless sign-in (Phase 3, Annexe B section 5.1/5.2). Copy is exact
 * per the client's document, with one reconciled judgement call: Annexe B
 * gives two slightly different "after submit" messages (one naming the
 * email address, one carefully non-committal about whether the account
 * exists) but its own instruction is "show the same message either way" —
 * so LoginForm always shows the non-committal phrasing, which is the only
 * one of the two that stays true regardless of whether the email is
 * registered. Flag to the client if they'd rather phrase it differently.
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { reason, notice } = await searchParams;
  const expiredOrInvalid = reason === "expired" || reason === "invalid";
  const oldLinkNotice = notice ? OLD_LINK_NOTICE[notice] : undefined;
  // Old continuation/re-entry links land here to sign in, then must
  // continue to the membership join route, not the ordinary member home.
  const next =
    notice === "continue-membership" || notice === "re-entry"
      ? PUBLIC_ROUTES.checkoutMembershipJoin
      : undefined;

  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          {expiredOrInvalid && (
            <div className="border-border bg-surface w-full rounded-2xl border p-5 text-left">
              <h2 className="font-heading text-lg">That link has expired</h2>
              <p className="text-brand-navy-800 mt-1 text-sm leading-relaxed">
                Sign-in links last fifteen minutes for security. Enter your email below and we
                will send a fresh one.
              </p>
            </div>
          )}
          {oldLinkNotice && (
            <div className="border-border bg-surface w-full rounded-2xl border p-5 text-left">
              <p className="text-brand-navy-800 text-sm leading-relaxed">{oldLinkNotice}</p>
            </div>
          )}
          <LoginForm next={next} />
        </div>
      </Container>
    </Section>
  );
}
