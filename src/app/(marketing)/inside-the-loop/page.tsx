import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { PUBLIC_ROUTES } from "@/config/canon";
import { formatMinorAsGbp, membershipConfig } from "@/config/products";

export const metadata: Metadata = {
  title: "Inside the Loop",
  description: "The members community of The Confident Learning Co.",
};

export default function InsideTheLoopPage() {
  return (
    <>
      <Section background="cream" className="pt-12 sm:pt-16">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <EditorialImage shotNote="Shot 8: the two of you together, to camera" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4">
                <h1 className="font-heading text-4xl sm:text-5xl">Inside the Loop</h1>
                <p className="text-brand-navy-800 text-lg leading-relaxed">
                  The members community of The Confident Learning Co.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container width="reading">
          <Reveal>
            <p className="leading-relaxed">
              The Guide gives you the method. Inside the Loop is where it keeps working: the
              place you bring the real weeks, the wobbly Wednesdays, the wins too small to tell
              anyone else and too important not to tell someone.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section background="sage">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="flex gap-3">
                <FounderPortrait founder="Adam" shotNote="vertical portrait" className="flex-1" />
                <FounderPortrait founder="Michela" shotNote="vertical portrait" className="flex-1" />
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4">
                <h2 className="font-heading text-2xl sm:text-3xl">Both of us are in here, every day</h2>
                <p className="leading-relaxed">
                  Adam works across the whole range and leads the confidence side of the method.
                  Michela brings nearly two decades with young people in Years 7 to 11, in schools
                  and in family homes. So whether you are asking about a seven year old refusing
                  to pick up a pencil, a Year 9 who has quietly stopped bothering, or a Year 11 who
                  has not opened a book since October, one of us has stood in that exact room
                  before.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="cream">
        <Container width="reading">
          <Reveal>
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl sm:text-3xl">What membership includes</h2>
              <p className="leading-relaxed">
                The community itself, with members across the four age bands, so you can find the
                parents living your exact version of this. The Confidence Library: practical
                resources, scripts and tools, with new material added every month and every
                resource marked for the years it fits. The bi-weekly live session on Zoom, where
                we work through real situations from across the range. And member-only access to
                our practical packs and to the pathway conversations for families who want to go
                further.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <Reveal>
            <EditorialImage shotNote="Shot 7: the two of you in conversation" className="mb-8" />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
              <h2 className="font-heading text-2xl sm:text-3xl">How you join</h2>
              <p className="leading-relaxed">
                Membership comes with the Learning Confidence Parent Guide: every Guide includes
                {" "}{membershipConfig.includedDays} days of full membership. After that, staying is{" "}
                {formatMinorAsGbp(membershipConfig.priceMinor)} per month, cancel any time. There
                is no way to join without the Guide, deliberately, because the community works
                when everyone in it shares the same method.
              </p>
              <PrimaryCTA href={PUBLIC_ROUTES.parentGuide} size="lg">
                Start with the Parent Guide
              </PrimaryCTA>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
