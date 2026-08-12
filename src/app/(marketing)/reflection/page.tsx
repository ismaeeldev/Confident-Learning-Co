import type { Metadata } from "next";
import { Clock, Lock, ShieldCheck, Users } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { ScoreAppEmbed } from "@/components/content/ScoreAppEmbed";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "The Reflection",
  description:
    "Where Is Your Child Getting Stuck? A 5-Minute Parent Reflection, written for parents of 6 to 16 year olds.",
};

const trustPoints = [
  { icon: Clock, label: "About 5 minutes" },
  { icon: Lock, label: "Completely private" },
  { icon: Users, label: "Designed for parents" },
  { icon: ShieldCheck, label: "Your child does not need to take part" },
] as const;

export default function ReflectionPage() {
  return (
    <Section background="cream" className="pt-12 sm:pt-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="order-1 flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
              <div className="hidden w-24 shrink-0 sm:block">
                <FounderPortrait founder="Adam" shotNote="head and shoulders" />
              </div>
              <h1 className="font-heading text-3xl leading-[1.1] text-balance sm:text-4xl lg:text-[2.75rem]">
                Where Is Your Child Getting Stuck? A 5-Minute Parent Reflection
              </h1>
            </div>

            <p className="text-brand-navy-800 max-w-prose text-lg leading-relaxed">
              Five minutes, honest questions, no jargon. Written for parents of 6 to 16 year
              olds, and it adapts to your child&rsquo;s school year, so what you read at the end
              is about the child you actually have.
            </p>
            <p className="text-brand-navy-800 max-w-prose leading-relaxed">
              At the end you will see the pattern behind what you are watching at home, and one
              small thing to try this week.
            </p>
            <p className="text-muted-foreground max-w-prose leading-relaxed">
              This is a reflection for you. Your child does not need to be involved, or to know.
            </p>

            <PrimaryCTA href="#the-reflection" size="lg" arrow className="w-full sm:w-auto">
              Take the 5-Minute Parent Reflection
            </PrimaryCTA>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-8">
              {trustPoints.map((point) => (
                <li key={point.label} className="flex items-center gap-2">
                  <point.icon className="text-brand-sage-700 size-5 shrink-0" aria-hidden="true" />
                  <span className="text-brand-navy-800 text-sm font-medium">{point.label}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.06} className="order-2">
            <EditorialImage
              shotNote="Shot 11: hands and notebook, no face — calm and quiet banner"
              className="shadow-sm"
            />
          </Reveal>
        </div>
      </Container>

      <Container width="reading">
        <div id="the-reflection" className="mt-14 scroll-mt-24 sm:mt-16 lg:mt-20">
          <Reveal>
            <div className="border-border bg-surface-sage rounded-2xl border p-5 sm:p-8 lg:p-10">
              <h2 className="mx-auto mb-6 max-w-2xl text-center text-2xl sm:mb-8 sm:text-3xl">
                Take the 5-Minute Parent Reflection
              </h2>
              <ScoreAppEmbed embedUrl={env.NEXT_PUBLIC_SCOREAPP_EMBED_URL} />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
