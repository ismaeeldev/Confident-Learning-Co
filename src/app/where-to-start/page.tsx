import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";

/**
 * Where to Start (Phase 11, Annexe A/B §9). Fixed content, reachable
 * without signing in — linked only from the Fit Check's Signpost
 * outcomes inside ScoreApp. Not linked from nav/footer and excluded from
 * the sitemap (src/app/sitemap.ts), same "unlisted, not publicly
 * discoverable" treatment already proven on /work-with-us. No forms, no
 * email capture, no personal data, no price anywhere — this page is
 * reachable by a signed-out visitor, so the no-public-pricing rule
 * applies to it in full.
 */
export const metadata: Metadata = {
  title: "Where to start",
  robots: { index: false, follow: false },
};

export default function WhereToStartPage() {
  return (
    <Section background="cream" className="py-16 sm:py-24">
      <Container width="reading">
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-3xl sm:text-4xl">Where to start</h1>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              Sometimes the most useful thing we can tell you is that somebody else should go
              first.
            </p>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              That is not a brush-off and it is not the end of anything. Your membership carries
              on exactly as it was. It means there is a door that opens more usefully than ours
              right now, and we would rather point at it than take your money to tell you the
              same thing on a call.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-heading text-xl">If your child is missing school</h2>
              <p className="text-brand-navy-800 mt-2 leading-relaxed">
                Start with the school, and ask specifically for a meeting about attendance rather
                than about behaviour. Ask what support is available for a child who is finding it
                hard to get in, and ask for it in writing. Then speak to your GP. Mornings that
                have become impossible are worth a conversation with someone medical, even if
                nothing obvious is wrong.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl">
                If something has been noticed and nobody has looked at it yet
              </h2>
              <p className="text-brand-navy-800 mt-2 leading-relaxed">
                Two conversations, in this order. The school&apos;s SENCO, which stands for
                special educational needs coordinator, and every school has one. Ask what they
                have observed, ask what is already being tried, and ask what would need to happen
                for a formal look. Then your GP, who can refer on where a school cannot.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl">
                If an assessment or a plan application is already underway
              </h2>
              <p className="text-brand-navy-800 mt-2 leading-relaxed">
                The people who help most with this are the ones who do it every day. SENDIASS is
                a free, impartial advice service run in every local authority, and you can find
                yours by searching for your council&apos;s name alongside SENDIASS. IPSEA is a
                national charity offering free legal advice on special educational needs, at{" "}
                <a
                  href="https://www.ipsea.org.uk"
                  className="text-brand-sage-800 underline underline-offset-2"
                >
                  ipsea.org.uk
                </a>
                . Both know the process, the deadlines and the wording far better than we do.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl">
                If you are worried about how your child is coping
              </h2>
              <p className="text-brand-navy-800 mt-2 leading-relaxed">
                Speak to your GP. If you are worried about your child&apos;s safety right now,
                call 999 or go to A and E. For urgent NHS mental health support, call 111 and
                choose the mental health option. The YoungMinds Parents Helpline, 0808 802 5544,
                offers advice for parents who are worried about their child.
              </p>
            </div>

            <div>
              <h2 className="font-heading text-xl">When you come back</h2>
              <p className="text-brand-navy-800 mt-2 leading-relaxed">
                Take the Fit Check again after thirty days, or sooner if things change. The
                everyday side of this, what happens at your kitchen table on a Tuesday evening,
                stays ours. It just works better once the right people are around the table.
              </p>
            </div>
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            We provide parent education and coaching. Adam and Michela do not diagnose, treat, or
            assess any condition. This work supports parents. It does not replace clinical care.
          </p>
        </div>
      </Container>
    </Section>
  );
}
