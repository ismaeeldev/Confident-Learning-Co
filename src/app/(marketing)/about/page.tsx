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
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: "Adam, Michela, and Jane: The Confident Learning Co.",
  openGraph: {
    title: "About Us: The Confident Learning Co.",
    description: "Meet Adam, Michela, and Jane. Learn about our specialists' backgrounds, experience, advocacy, and approach to rebuilding children's learning confidence.",
    type: "website",
    url: "/about",
    siteName: "The Confident Learning Co.",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us: The Confident Learning Co.",
    description: "Meet Adam, Michela, and Jane. Learn about our specialists' backgrounds, experience, advocacy, and approach to rebuilding children's learning confidence.",
  },
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
      "Jane is the first person you speak to when you are considering working with us closely. Her job is not to sell you anything. Jane listens properly and takes it back to Adam and Michela. If anything in your situation needs different support first, she will tell you plainly and point you toward it.",
    ],
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <JsonLd data={personJsonLd("Adam", "Founder and Learning Confidence Specialist")} />
      <JsonLd data={personJsonLd("Michela", "Learning Confidence Specialist")} />

      <Section background="cream" className="relative overflow-hidden pt-12 sm:pt-16 pb-12">
        {/* Subtle ambient background glow bubbles */}
        <div aria-hidden="true" className="from-brand-gold-100/50 via-brand-sage-100/25 pointer-events-none absolute -top-24 -right-32 size-[32rem] rounded-full blur-3xl" />
        <div aria-hidden="true" className="bg-brand-sage-200/20 pointer-events-none absolute -bottom-32 -left-24 size-[26rem] rounded-full blur-3xl" />

        <Container className="relative">
          <Reveal>
            <div className="relative p-6 sm:p-8 bg-white border border-brand-cream-300 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(20,32,56,0.08)] max-w-5xl mx-auto">
              <div className="absolute inset-4 border border-brand-gold-500/30 rounded-[20px] pointer-events-none">
                <div className="absolute -top-1.5 -left-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                  <div className="size-1 bg-brand-gold-500 rounded-full" />
                </div>
                <div className="absolute -top-1.5 -right-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                  <div className="size-1 bg-brand-gold-500 rounded-full" />
                </div>
                <div className="absolute -bottom-1.5 -left-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                  <div className="size-1 bg-brand-gold-500 rounded-full" />
                </div>
                <div className="absolute -bottom-1.5 -right-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                  <div className="size-1 bg-brand-gold-500 rounded-full" />
                </div>
              </div>
              <div className="relative border border-dashed border-brand-sage-300/50 bg-brand-sage-100/30 rounded-[18px] p-2 overflow-hidden">
                <EditorialImage
                  shotNote="Shot 7: the two of you in conversation, not to camera"
                  className="rounded-xl transition-transform duration-500 hover:scale-[1.01]"
                />
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="text-center mt-10">
            <h1 className="font-heading max-w-3xl mx-auto text-brand-navy-950 text-[clamp(2.25rem,4vw+1.25rem,3.5rem)] leading-[1.05] text-balance">
              About Adam, Michela, and Jane
            </h1>
            
            {/* Decorative divider line */}
            <div className="flex items-center justify-center gap-3 w-40 mt-4 mx-auto">
              <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
              <svg className="size-2.5 text-brand-gold-600 fill-brand-gold-600 rotate-45" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" />
              </svg>
              <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="white" className="py-20 sm:py-28">
        <Container>
          {/* Alternating Biography Rows (Resolves stretching cards) */}
          <div className="flex flex-col gap-20 sm:gap-28 max-w-6xl mx-auto">
            {founders.map((person, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={person.name} className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
                  
                  {/* Portrait Column (spans 5 cols) */}
                  <Reveal className={cn(
                    "order-1 lg:col-span-5 relative",
                    isEven ? "lg:order-1" : "lg:order-2"
                  )}>
                    <div className="relative p-6 bg-white border border-brand-cream-300 rounded-[32px] shadow-[0_15px_40px_-10px_rgba(20,32,56,0.06)]">
                      {/* Signature Notched Frame lines */}
                      <div className="absolute inset-4 border border-brand-gold-500/25 rounded-[20px] pointer-events-none">
                        <div className="absolute -top-1.5 -left-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                          <div className="size-1 bg-brand-gold-500 rounded-full" />
                        </div>
                        <div className="absolute -top-1.5 -right-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                          <div className="size-1 bg-brand-gold-500 rounded-full" />
                        </div>
                        <div className="absolute -bottom-1.5 -left-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                          <div className="size-1 bg-brand-gold-500 rounded-full" />
                        </div>
                        <div className="absolute -bottom-1.5 -right-1.5 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                          <div className="size-1 bg-brand-gold-500 rounded-full" />
                        </div>
                      </div>
                      <div className="relative border border-dashed border-brand-sage-300/40 bg-brand-sage-100/25 rounded-[18px] p-2 overflow-hidden">
                        <FounderPortrait
                          founder={person.name}
                          shotNote={person.shotNote}
                          className="rounded-xl transition-transform duration-500 hover:scale-[1.01]"
                        />
                      </div>
                    </div>
                  </Reveal>

                  {/* Text Column (spans 7 cols) */}
                  <Reveal className={cn(
                    "order-2 lg:col-span-7 flex flex-col gap-4",
                    isEven ? "lg:order-2" : "lg:order-1"
                  )}>
                    <div className="flex flex-col gap-2">
                      <span className="bg-brand-sage-800 text-brand-cream-100 text-[0.62rem] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border border-brand-sage-700 w-fit">
                        Team Partner
                      </span>
                      <h2 className="font-heading text-3xl sm:text-4xl text-brand-navy-950 leading-none mt-1">
                        {person.name}
                      </h2>
                      <p className="text-brand-navy-900/80 text-sm font-semibold tracking-wide uppercase leading-snug mt-1">
                        {person.role}
                      </p>
                      
                      {/* Decorative star divider line */}
                      <div className="flex items-center gap-3 w-40 mt-1">
                        <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
                        <svg className="size-2.5 text-brand-gold-600 fill-brand-gold-600 rotate-45" viewBox="0 0 24 24">
                          <rect x="6" y="6" width="12" height="12" />
                        </svg>
                        <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
                      </div>
                    </div>

                    <div className="text-brand-navy-800 flex flex-col gap-4 text-base leading-relaxed mt-2">
                      {person.bio.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>
                  </Reveal>

                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section background="cream" className="py-12 sm:py-16">
        <Container width="reading">
          <Reveal>
            <div className="relative border border-brand-sage-300/40 bg-surface-sage rounded-[24px] p-6 sm:p-8 shadow-[var(--shadow-elevation-1)] overflow-hidden">
              <div className="flex items-start gap-4">
                <div className="bg-brand-sage-700 text-brand-cream-100 p-2.5 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
                  <ShieldCheck className="size-5.5" aria-hidden="true" />
                </div>
                <ScopeNotice className="text-brand-navy-900 leading-relaxed text-sm sm:text-base" />
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="white" className="py-16 sm:py-20 text-center">
        <Container>
          <Reveal>
            <PrimaryCTA href={PUBLIC_ROUTES.reflection} size="lg" arrow className="w-full sm:w-auto">
              Take the 5-Minute Parent Reflection
            </PrimaryCTA>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
