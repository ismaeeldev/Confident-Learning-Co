import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { ScopeNotice } from "@/components/content/ScopeNotice";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { JsonLd } from "@/components/content/JsonLd";
import { PUBLIC_ROUTES } from "@/config/canon";
import { personJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: "About",
  description: "Adam, Michela, and Jane — The Confident Learning Co.",
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd("Adam", "Founder and Learning Confidence Specialist")} />
      <JsonLd data={personJsonLd("Michela", "Learning Confidence Specialist")} />
      <Section background="cream" className="pt-12 sm:pt-16">
        <Container>
          <Reveal>
            <EditorialImage shotNote="Shot 7: the two of you in conversation, not to camera" />
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-heading mt-8 text-4xl sm:text-5xl">
              About Adam, Michela, and Jane
            </h1>
          </Reveal>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <Reveal>
              <FounderPortrait founder="Adam" shotNote="shot 1 or 9" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl">Adam</h2>
                  <p className="text-muted-foreground">
                    Founder and Learning Confidence Specialist, The Confident Learning Co.
                  </p>
                </div>
                <p className="leading-relaxed">
                  Adam has spent his career seeing children from angles most specialists never
                  get: as a teacher, tutor, nanny, au pair, researcher, mentor and coach, across
                  early years settings, primary schools, children&rsquo;s centres, community play,
                  charities and family advocacy.
                </p>
                <p className="leading-relaxed">
                  That breadth is the point. A child who has lost confidence in learning looks
                  different at school, at home, and at the kitchen table, and Adam has worked in
                  all three rooms. He has seen the six year old who will not pick up a pencil and
                  the sixteen year old who has decided the whole thing is pointless, and he has
                  watched how one becomes the other when nobody interrupts it.
                </p>
                <p className="leading-relaxed">
                  His work now goes entirely through the parent, because the parent is the one
                  constant in a child&rsquo;s learning life.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="sage">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <Reveal>
              <FounderPortrait founder="Michela" shotNote="shot 4 or 10" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl">Michela</h2>
                  <p className="text-brand-sage-800">
                    Learning Confidence Specialist, The Confident Learning Co.
                  </p>
                </div>
                <p className="leading-relaxed">
                  Michela brings nearly two decades of experience with young people in Years 7 to
                  11, in schools and in family homes.
                </p>
                <p className="leading-relaxed">
                  The secondary years are her ground. She has sat with Year 9s choosing options
                  they have already decided they will fail, with Year 11s who stopped revising in
                  October, and with the parents outside those bedroom doors trying to work out
                  whether to push or to leave it.
                </p>
                <p className="leading-relaxed">
                  That dual view matters: she has seen how a young person who struggles in the
                  classroom carries it home, and how what happens at home walks back into school
                  the next morning. Her work is practical and tested, built on years spent
                  alongside families navigating the hardest stretches of school life.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <Reveal>
              <FounderPortrait founder="Jane" shotNote="get a real portrait before launch" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="font-heading text-2xl sm:text-3xl">Jane</h2>
                  <p className="text-muted-foreground">Pathway Coordinator, The Confident Learning Co.</p>
                </div>
                <p className="leading-relaxed">
                  Jane is the first person you speak to when you are considering working with us
                  closely. Her job is not to sell you anything. It is to listen to your situation
                  properly and tell you honestly whether what we do is the right fit, and if it is
                  not, to point you toward what is.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="cream">
        <Container width="reading">
          <Reveal>
            <ScopeNotice />
          </Reveal>
        </Container>
      </Section>

      <Section background="white" className="text-center">
        <Container>
          <Reveal>
            <PrimaryCTA href={PUBLIC_ROUTES.reflection} size="lg">
              Take the 5-Minute Parent Reflection
            </PrimaryCTA>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
