import type { Metadata } from "next";
import { BookOpen, KeyRound, RefreshCw, Tag, Users2, Video } from "lucide-react";
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

const heroTrustItems = [
  { icon: Users2, label: "Community across all four age bands" },
  { icon: BookOpen, label: "New Confidence Library material every month" },
  { icon: Video, label: "Bi-weekly live sessions on Zoom" },
] as const;

const founders = [
  {
    founder: "Adam" as const,
    role: "Founder and Learning Confidence Specialist",
  },
  {
    founder: "Michela" as const,
    role: "Learning Confidence Specialist",
  },
];

const benefits = [
  {
    icon: Users2,
    label: "Community",
    body: "The community itself, with members across the four age bands, so you can find the parents living your exact version of this.",
  },
  {
    icon: BookOpen,
    label: "Confidence Library",
    body: "The Confidence Library: practical resources, scripts and tools, with new material added every month and every resource marked for the years it fits.",
  },
  {
    icon: Video,
    label: "Live Sessions",
    body: "The bi-weekly live session on Zoom, where we work through real situations from across the range.",
  },
  {
    icon: KeyRound,
    label: "Member-Only Access",
    body: "And member-only access to our practical packs and to the pathway conversations for families who want to go further.",
  },
] as const;

const joinPoints = [
  { icon: BookOpen, label: "Comes with the Learning Confidence Parent Guide" },
  {
    icon: Tag,
    label: `${formatMinorAsGbp(membershipConfig.priceMinor)} per month after ${membershipConfig.includedDays} days`,
  },
  { icon: RefreshCw, label: "Cancel any time" },
] as const;

export default function InsideTheLoopPage() {
  return (
    <>
      <Section background="cream" className="pt-12 sm:pt-16">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal delay={0.04} className="order-2 lg:order-1">
              <EditorialImage
                shotNote="Shot 8: the two of you together, to camera"
                className="shadow-sm"
              />
            </Reveal>
            <Reveal className="order-1 lg:order-2">
              <div className="flex flex-col gap-5">
                <h1 className="font-heading text-[clamp(2.25rem,4vw+1.25rem,3.5rem)] leading-[1.05] text-balance">
                  Inside the Loop
                </h1>
                <p className="text-brand-navy-800 max-w-prose text-lg leading-relaxed">
                  The members community of The Confident Learning Co.
                </p>
                <ul className="mt-1 flex flex-col gap-3">
                  {heroTrustItems.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <item.icon
                        className="text-brand-sage-700 mt-0.5 size-5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="text-brand-navy-800 text-sm font-medium sm:text-base">
                        {item.label}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container width="reading">
          <Reveal>
            <p className="text-lg leading-relaxed">
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
              <div className="grid grid-cols-2 gap-4 sm:gap-5">
                {founders.map((person) => (
                  <div
                    key={person.founder}
                    className="group border-border bg-surface flex flex-col gap-3 rounded-2xl border p-3 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:gap-4 sm:p-4"
                  >
                    <FounderPortrait
                      founder={person.founder}
                      shotNote="vertical portrait"
                      className="[&_img]:transition-transform [&_img]:duration-200 [&_img]:ease-out group-hover:[&_img]:scale-[1.02]"
                    />
                    <div className="flex flex-col gap-0.5">
                      <h3 className="font-heading text-base leading-snug sm:text-lg">
                        {person.founder}
                      </h3>
                      <p className="text-brand-navy-900/70 text-[11px] leading-snug sm:text-xs">
                        {person.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4">
                <h2 className="font-heading text-2xl sm:text-3xl">
                  Both of us are in here, every day
                </h2>
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
        <Container>
          <Reveal>
            <h2 className="font-heading mb-10 text-center text-2xl sm:mb-12 sm:text-3xl">
              What membership includes
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <Reveal key={benefit.label} delay={index * 0.05} className="h-full">
                <div className="group border-border bg-surface flex h-full flex-col gap-3 rounded-2xl border p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-6">
                  <benefit.icon className="text-brand-sage-700 size-6 shrink-0" aria-hidden="true" />
                  <h3 className="font-heading text-lg leading-snug">{benefit.label}</h3>
                  <p className="text-brand-navy-800 flex-1 text-sm leading-relaxed">
                    {benefit.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <Reveal>
            <EditorialImage
              shotNote="Shot 7: the two of you in conversation"
              className="mb-10 shadow-sm sm:mb-12"
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="border-brand-gold-300 bg-surface-subtle mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-2xl border-2 p-8 text-center shadow-md sm:p-10">
              <h2 className="font-heading text-2xl sm:text-3xl">How you join</h2>
              <p className="leading-relaxed">
                Membership comes with the Learning Confidence Parent Guide: every Guide includes
                {" "}{membershipConfig.includedDays} days of full membership. After that, staying is{" "}
                {formatMinorAsGbp(membershipConfig.priceMinor)} per month, cancel any time. There
                is no way to join without the Guide, deliberately, because the community works
                when everyone in it shares the same method.
              </p>
              <ul className="flex flex-col gap-3 self-stretch sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2">
                {joinPoints.map((point) => (
                  <li
                    key={point.label}
                    className="text-brand-navy-800 flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <point.icon className="text-brand-sage-700 size-4 shrink-0" aria-hidden="true" />
                    {point.label}
                  </li>
                ))}
              </ul>
              <PrimaryCTA
                href={PUBLIC_ROUTES.parentGuide}
                size="lg"
                arrow
                className="w-full sm:w-auto"
              >
                Start with the Parent Guide
              </PrimaryCTA>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
