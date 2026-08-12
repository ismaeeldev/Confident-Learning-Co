import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
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

const founders = [
  {
    name: "Adam",
    role: "Founder and Learning Confidence Specialist, The Confident Learning Co.",
    shotNote: "shot 1 or 9",
    bio: [
      "Adam has spent his career seeing children from angles most specialists never get: as a teacher, tutor, nanny, au pair, researcher, mentor and coach, across early years settings, primary schools, children’s centres, community play, charities and family advocacy.",
      "That breadth is the point. A child who has lost confidence in learning looks different at school, at home, and at the kitchen table, and Adam has worked in all three rooms. He has seen the six year old who will not pick up a pencil and the sixteen year old who has decided the whole thing is pointless, and he has watched how one becomes the other when nobody interrupts it.",
      "His work now goes entirely through the parent, because the parent is the one constant in a child’s learning life.",
    ],
  },
  {
    name: "Michela",
    role: "Learning Confidence Specialist, The Confident Learning Co.",
    shotNote: "shot 4 or 10",
    bio: [
      "Michela brings nearly two decades of experience with young people in Years 7 to 11, in schools and in family homes.",
      "The secondary years are her ground. She has sat with Year 9s choosing options they have already decided they will fail, with Year 11s who stopped revising in October, and with the parents outside those bedroom doors trying to work out whether to push or to leave it.",
      "That dual view matters: she has seen how a young person who struggles in the classroom carries it home, and how what happens at home walks back into school the next morning. Her work is practical and tested, built on years spent alongside families navigating the hardest stretches of school life.",
    ],
  },
  {
    name: "Jane",
    role: "Pathway Coordinator, The Confident Learning Co.",
    shotNote: "get a real portrait before launch",
    bio: [
      "Jane is the first person you speak to when you are considering working with us closely. Her job is not to sell you anything. It is to listen to your situation properly and tell you honestly whether what we do is the right fit, and if it is not, to point you toward what is.",
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd("Adam", "Founder and Learning Confidence Specialist")} />
      <JsonLd data={personJsonLd("Michela", "Learning Confidence Specialist")} />

      <Section background="cream" className="pt-12 sm:pt-16">
        <Container>
          <Reveal>
            <EditorialImage
              shotNote="Shot 7: the two of you in conversation, not to camera"
              className="shadow-sm"
            />
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="font-heading mt-8 max-w-3xl text-[clamp(2.25rem,4vw+1.25rem,3.5rem)] leading-[1.05] text-balance">
              About Adam, Michela, and Jane
            </h1>
          </Reveal>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {founders.map((person, index) => (
              <Reveal key={person.name} delay={0.04 + index * 0.06} className="h-full">
                <div className="group border-border bg-surface flex h-full flex-col gap-5 rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
                  <FounderPortrait
                    founder={person.name}
                    shotNote={person.shotNote}
                    className="[&_img]:transition-transform [&_img]:duration-200 [&_img]:ease-out group-hover:[&_img]:scale-[1.02]"
                  />
                  <div className="flex flex-1 flex-col gap-4">
                    <div>
                      <h2 className="font-heading text-2xl leading-snug">{person.name}</h2>
                      <p className="text-muted-foreground mt-1 text-sm leading-snug">
                        {person.role}
                      </p>
                    </div>
                    <div className="text-brand-navy-800 flex flex-col gap-3 text-sm leading-relaxed">
                      {person.bio.map((paragraph, paragraphIndex) => (
                        <p key={paragraphIndex}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="cream">
        <Container width="reading">
          <Reveal>
            <div className="bg-surface-sage mx-auto flex max-w-2xl flex-col items-start gap-3 rounded-2xl p-6 sm:flex-row sm:gap-4 sm:p-8">
              <ShieldCheck
                className="text-brand-sage-800 size-6 shrink-0 sm:mt-0.5"
                aria-hidden="true"
              />
              <ScopeNotice className="text-brand-navy-800" />
            </div>
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
