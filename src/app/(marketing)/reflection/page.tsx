import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { ScoreAppEmbed } from "@/components/content/ScoreAppEmbed";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  title: "The Reflection",
  description:
    "Where Is Your Child Getting Stuck? A 5-Minute Parent Reflection, written for parents of 6 to 16 year olds.",
};

export default function ReflectionPage() {
  return (
    <Section background="cream" className="pt-12 sm:pt-16">
      <Container width="reading">
        <div className="mb-10">
          <EditorialImage shotNote="Shot 11: hands and notebook, no face — calm and quiet banner" />
        </div>

        <div className="mb-10 grid gap-8 sm:grid-cols-[auto_1fr] sm:items-start">
          <div className="hidden w-32 sm:block">
            <FounderPortrait founder="Adam" shotNote="head and shoulders" />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-3xl sm:text-4xl">
              Where Is Your Child Getting Stuck? A 5-Minute Parent Reflection
            </h1>
            <p className="text-brand-navy-800 text-lg leading-relaxed">
              Five minutes, honest questions, no jargon. Written for parents of 6 to 16 year
              olds, and it adapts to your child&rsquo;s school year, so what you read at the end
              is about the child you actually have.
            </p>
            <p className="text-brand-navy-800 leading-relaxed">
              At the end you will see the pattern behind what you are watching at home, and one
              small thing to try this week.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This is a reflection for you. Your child does not need to be involved, or to know.
            </p>
          </div>
        </div>

        <ScoreAppEmbed embedUrl={env.NEXT_PUBLIC_SCOREAPP_EMBED_URL} />
      </Container>
    </Section>
  );
}
