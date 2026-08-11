import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { QuoteBlock } from "@/components/content/QuoteBlock";
import { PendingCheckoutButton } from "@/components/content/PendingCheckoutButton";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { products, formatMinorAsGbp, membershipConfig } from "@/config/products";

export const metadata: Metadata = {
  title: "The Learning Confidence Parent Guide",
  description:
    "The complete method for rebuilding your child's confidence in learning, delivered entirely through you. Written for the whole of the 6 to 16 age group.",
};

const guide = products.guide;

export default function ParentGuidePage() {
  return (
    <>
      <Section background="cream" className="pt-12 sm:pt-16">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <EditorialImage shotNote="Shot 3: Adam seated, warm interior, wide frame" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-5">
                <h1 className="font-heading text-4xl leading-tight sm:text-5xl">
                  The Learning Confidence Parent Guide
                </h1>
                <p className="text-brand-navy-800 text-lg leading-relaxed">
                  The complete method for rebuilding your child&rsquo;s confidence in learning,
                  delivered entirely through you. Written for the whole of the 6 to 16 age group.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container width="reading">
          <Reveal>
            <div className="flex flex-col gap-6 leading-relaxed">
              <p>
                You have tried encouragement. You have tried backing off. You have tried sitting
                beside them while the work gets rubbed through, or standing outside a door that
                will not open. The problem was never your effort. It is that nobody ever handed
                you a method.
              </p>
              <p>
                The Guide gives you one: a named, repeatable framework you can run at your own
                kitchen table, in the real moments, with the child you actually have. No scripts
                to perform. No pressure to add. Every step is something a tired parent can do on
                a Tuesday.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="cream">
        <Container>
          <Reveal>
            <h2 className="font-heading mb-8 text-center text-3xl sm:text-4xl">
              Whatever age your child is
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mb-8 grid grid-cols-2 gap-3 sm:gap-4">
              <EditorialImage
                shotNote="Rubbed-through homework page (Years 2 to 4)"
                src="/images/rubbed-through-page.jpg"
                alt="An exercise book page rubbed through by an eraser, pencil shavings scattered nearby"
              />
              <EditorialImage
                shotNote="Empty desk by a window (Years 5 to 6)"
                src="/images/empty-desk-window.jpg"
                alt="An empty study desk by a window with an open notebook and a mug"
              />
              <EditorialImage
                shotNote="Phone face down on a duvet (Years 7 to 9)"
                src="/images/phone-facedown-bed.jpg"
                alt="A smartphone lying face-down on a bed next to a pair of headphones"
              />
              <EditorialImage
                shotNote="Revision timetable (Years 10 to 11)"
                src="/images/revision-timetable.jpg"
                alt="A handwritten revision timetable pinned to a wall with only the first week filled in"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mx-auto flex max-w-3xl flex-col gap-4 leading-relaxed">
              <p>
                The method is the same at seven and at fifteen. What changes is what it looks like
                in your house, and the Guide walks all of it.
              </p>
              <p>
                In Years 2 to 4, that means the homework that ends in tears, the Monday morning
                tummy ache, and the child who will not try in front of you.
              </p>
              <p>
                In Years 5 to 6, it means the comparison that arrives around Year 5, the answers
                that stop being volunteered, and the move up to secondary that flattens whatever
                confidence was left.
              </p>
              <p>
                In Years 7 to 9, it means the drift: homework not done and not mentioned, the
                report that says capable but not applying himself, and options chosen to avoid a
                subject rather than to want one.
              </p>
              <p>
                In Years 10 and 11, it means the revision that never starts, the coursework left,
                and the mock result that confirms a story your child wrote about themselves two
                years earlier.
              </p>
              <p>
                Every part of the method is shown across all four, with worked examples from real
                situations in each band, because a Year 10 will not sit down for something written
                for a Year 3 and will spot the attempt instantly.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="white">
        <Container width="reading">
          <Reveal>
            <div className="flex flex-col gap-4 leading-relaxed">
              <h2 className="font-heading text-2xl sm:text-3xl">What is inside</h2>
              <p>
                The full framework, step by step, with the reasoning behind each move so you can
                adapt it rather than recite it. The settling work that comes first, because no
                method lands on an unsettled child. Worked examples in all four bands. And the
                exact words for the moments that usually go wrong, written four ways, because what
                works at seven will get you a closed door at fifteen.
              </p>
              <h3 className="font-heading mt-4 text-xl">
                Included: 30 days&rsquo; membership of Inside the Loop
              </h3>
              <p>
                A month of full membership: the community, the resource library, the bi-weekly
                live session, and both specialists in the room. After {membershipConfig.includedDays}{" "}
                days, staying is your choice at {formatMinorAsGbp(membershipConfig.priceMinor)} per
                month. Nothing converts automatically and nobody is charged without choosing.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="sage">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <FounderPortrait founder="Michela" shotNote="mid-talk" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4">
                <h2 className="font-heading text-2xl sm:text-3xl">
                  If your child is at secondary school, read this first
                </h2>
                <QuoteBlock
                  attribution="Michela"
                  role="Learning Confidence Specialist, The Confident Learning Co."
                >
                  <p>
                    &ldquo;You have probably been told your child is lazy, or coasting, or just
                    needs to apply themselves. I have spent nearly twenty years with young people
                    in exactly those years, in schools and in family homes, and that is almost
                    never what I find.
                  </p>
                  <p>
                    A capable teenager who stops trying on purpose is protecting themselves. If
                    they revise properly and the grade still comes back low, that grade means
                    something about them. If they do not revise at all, it means nothing. The
                    shrug is not indifference. It is armour.
                  </p>
                  <p>
                    In Years 7 to 9 it is quiet. Homework that was never mentioned, a subject
                    dropped at options to avoid it rather than because they wanted the other one,
                    and everyone around you saying it is just the age. It is not just the age, and
                    this is the easiest point in the whole range to turn it around.
                  </p>
                  <p>
                    In Years 10 and 11 it has hardened, and there is a countdown behind every
                    conversation you try to have. It is not too late. It is later, which means the
                    approach has to change, and it changes in ways that are in this Guide.
                  </p>
                  <p>
                    The method works at fifteen. It just does not look the way it looks at seven,
                    and I will make sure you get the version that fits the young person actually
                    living in your house.&rdquo;
                  </p>
                </QuoteBlock>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="cream" className="text-center">
        <Container width="reading">
          <Reveal>
            <div className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">
                Founders price {formatMinorAsGbp(guide.founderPriceMinor!)}. Full price{" "}
                {formatMinorAsGbp(guide.fullPriceMinor!)}.
              </p>
              {guide.stripePriceId ? (
                <PrimaryCTA href="/checkout/guide" size="lg">
                  {`Get the Parent Guide, ${formatMinorAsGbp(guide.founderPriceMinor!)}`}
                </PrimaryCTA>
              ) : (
                <PendingCheckoutButton
                  label={`Get the Parent Guide, ${formatMinorAsGbp(guide.founderPriceMinor!)}`}
                  size="lg"
                />
              )}
              <p className="text-muted-foreground text-sm">
                Secure checkout through Stripe. The Guide and your community invitation arrive by
                email within minutes.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
