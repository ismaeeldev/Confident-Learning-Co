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
  openGraph: {
    title: "Where Is Your Child Getting Stuck? A 5-Minute Parent Reflection",
    description:
      "A 5-minute parent reflection to identify exactly where your child is getting stuck and how to rebuild their learning confidence.",
    type: "website",
    url: "/reflection",
    siteName: "The Confident Learning Co.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Where Is Your Child Getting Stuck? A 5-Minute Parent Reflection",
    description:
      "A 5-minute parent reflection to identify exactly where your child is getting stuck and how to rebuild their learning confidence.",
  },
};

const trustPoints = [
  { icon: Clock, label: "About 5 minutes" },
  { icon: Lock, label: "Completely private" },
  { icon: Users, label: "Designed for parents" },
  { icon: ShieldCheck, label: "Your child does not need to take part" },
] as const;

export default function ReflectionPage() {
  return (
    <Section background="cream" className="relative overflow-hidden pt-8 sm:pt-10 lg:pt-12 pb-12 sm:pb-16 lg:pb-18">
      {/* Subtle ambient background glow bubbles */}
      <div
        aria-hidden="true"
        className="from-brand-gold-100/60 via-brand-sage-100/40 pointer-events-none absolute -top-24 -right-32 size-[36rem] rounded-full bg-gradient-to-br to-transparent blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-brand-sage-200/25 pointer-events-none absolute -bottom-32 -left-24 size-[26rem] rounded-full blur-3xl"
      />

      {/* Background contour wavy lines (top right) */}
      <div className="absolute top-0 right-0 w-[45%] h-[400px] opacity-[0.06] pointer-events-none select-none text-brand-gold-600">
        <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M100,-50 Q200,100 450,50" />
          <path d="M120,-70 Q240,110 470,30" />
          <path d="M80,-30 Q160,90 430,70" />
          <path d="M60,-10 Q120,70 410,90" />
          <path d="M40,10 Q80,50 390,110" />
        </svg>
      </div>

      {/* Decorative leaf illustration (bottom left) */}
      <div className="absolute bottom-4 left-4 size-32 sm:size-40 opacity-[0.1] pointer-events-none select-none text-brand-sage-800">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10,90 Q30,60 50,20" />
          <path d="M30,65 Q15,55 10,65 Q25,75 30,65" fill="currentColor" fillOpacity="0.1" />
          <path d="M40,45 Q25,35 22,45 Q35,55 40,45" fill="currentColor" fillOpacity="0.1" />
          <path d="M48,25 Q35,15 32,25 Q45,35 48,25" fill="currentColor" fillOpacity="0.1" />
        </svg>
      </div>

      {/* Decorative leaf illustration (top right, flipped) */}
      <div className="absolute top-4 right-4 size-36 sm:size-44 opacity-[0.06] pointer-events-none select-none text-brand-sage-800 rotate-180">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10,90 Q30,60 50,20" />
          <path d="M30,65 Q15,55 10,65 Q25,75 30,65" fill="currentColor" fillOpacity="0.1" />
          <path d="M40,45 Q25,35 22,45 Q35,55 40,45" fill="currentColor" fillOpacity="0.1" />
          <path d="M48,25 Q35,15 32,25 Q45,35 48,25" fill="currentColor" fillOpacity="0.1" />
        </svg>
      </div>

      <Container className="relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-16">
          
          {/* Left Column - Hero Content (spans 7 cols to make text wider and shorter) */}
          <Reveal className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="bg-brand-sage-100/90 text-brand-sage-800 text-[0.62rem] font-bold tracking-[0.2em] uppercase px-3 py-0.5 rounded-full border border-brand-sage-300/40">
                  Interactive Questionnaire
                </span>
                <span className="bg-brand-gold-100/90 text-brand-gold-700 text-[0.62rem] font-bold tracking-[0.2em] uppercase px-3 py-0.5 rounded-full border border-brand-gold-300/40">
                  5 Min
                </span>
              </div>
              
              <h1 className="font-heading text-brand-navy-950 text-[clamp(2.1rem,2.4vw+1rem,2.85rem)] leading-[1.1] tracking-[-0.015em] text-balance">
                Where Is Your Child Getting Stuck? A 5-Minute Parent Reflection
              </h1>

              {/* Title decorative ornament line */}
              <div className="flex items-center gap-3 w-40 mt-0.5">
                <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
                <svg className="size-2.5 text-brand-gold-600 fill-brand-gold-600 rotate-45" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
                <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
              </div>
              
              {/* Author Capsule Button */}
              <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-sm border border-brand-cream-300/60 rounded-full pl-1.5 pr-4 py-1 w-fit shadow-[var(--shadow-elevation-1)] mt-1">
                <div className="size-8 overflow-hidden rounded-full border border-brand-sage-300 shrink-0 bg-brand-sage-100/60 flex items-center justify-center">
                  <FounderPortrait founder="Adam" shotNote="head and shoulders" compact aspect="square" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[11px] font-bold text-brand-navy-950 leading-none">Created by Adam</span>
                  <span className="text-[9px] text-brand-navy-700/80 mt-0.5 font-medium leading-none">Founder & Learning Specialist</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-brand-navy-950 max-w-prose text-[0.92rem] font-semibold leading-relaxed text-balance">
                Five minutes, honest questions, no jargon. Written for parents of{" "}
                <strong className="font-bold text-brand-navy-950 underline decoration-brand-gold-500 decoration-2 underline-offset-2">6 to 16 year olds</strong>, and it adapts to
                your child&rsquo;s school year, so what you read at the end is about the child you actually have.
              </p>
              <p className="text-brand-navy-800/90 max-w-prose text-[0.88rem] leading-relaxed text-balance">
                At the end you will see the pattern behind what you are watching at home, and one
                small thing to try this week.
              </p>
              <p className="text-brand-navy-700/85 max-w-prose text-[0.78rem] leading-relaxed border-l border-brand-sage-300 pl-3 italic">
                This is a reflection for you. Your child does not need to be involved, or to know.
              </p>
            </div>

            <div className="mt-1">
              <PrimaryCTA href="#the-reflection" size="lg" arrow className="w-full sm:w-auto shadow-[0_10px_20px_-5px_rgba(201,169,97,0.35)]">
                Take the 5-Minute Parent Reflection
              </PrimaryCTA>
            </div>
          </Reveal>

          {/* Right Column - Beautiful Framed Image (spans 5 cols to make image smaller and compact) */}
          <Reveal delay={0.06} className="lg:col-span-5 relative lg:mt-0 mt-6 w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative p-5 lg:p-6 bg-white border border-brand-cream-300 rounded-[24px] shadow-[0_15px_40px_-10px_rgba(20,32,56,0.06)]">
              {/* Elegant internal double-border line with diamonds */}
              <div className="absolute inset-3.5 border border-brand-gold-500/30 rounded-[14px] pointer-events-none">
                {/* Corner ornaments */}
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
                {/* Top center ornament */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                  <div className="size-1 bg-brand-gold-500 rounded-full" />
                </div>
              </div>

              {/* Dotted border wrapper for the placeholder image */}
              <div className="relative border border-dashed border-brand-sage-300/50 bg-brand-sage-100/30 rounded-[14px] p-1.5 overflow-hidden">
                <EditorialImage
                  shotNote="Shot 11: hands and notebook, no face — calm and quiet banner"
                  aspect="square"
                  className="rounded-lg transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Overlapping botanical leaf branch badge */}
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 translate-x-1/4 translate-y-1/4 size-14 sm:size-16 rounded-full bg-white border border-brand-cream-300 shadow-[0_8px_16px_-6px_rgba(20,32,56,0.1)] flex items-center justify-center z-20">
                <svg className="size-8 sm:size-10 text-brand-sage-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M50,85 C50,85 50,55 65,30" strokeLinecap="round" />
                  <path d="M50,85 C50,85 45,55 30,35" strokeLinecap="round" />
                  {/* Leaves right */}
                  <path d="M57,55 Q67,50 72,58 Q62,65 57,55" fill="currentColor" fillOpacity="0.15" />
                  <path d="M62,40 Q72,35 75,44 Q65,49 62,40" fill="currentColor" fillOpacity="0.15" />
                  <path d="M65,26 Q73,20 74,29 Q67,33 65,26" fill="currentColor" fillOpacity="0.15" />
                  {/* Leaves left */}
                  <path d="M43,62 Q33,58 35,67 Q43,71 43,62" fill="currentColor" fillOpacity="0.15" />
                  <path d="M38,47 Q28,42 27,51 Q37,55 38,47" fill="currentColor" fillOpacity="0.15" />
                  <path d="M32,32 Q22,27 20,36 Q30,39 32,32" fill="currentColor" fillOpacity="0.15" />
                  {/* Top leaf */}
                  <path d="M50,22 Q50,10 53,10 Q56,12 50,22" fill="currentColor" fillOpacity="0.15" />
                </svg>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Full-width bottom row of trust cards */}
        <Reveal delay={0.12}>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mt-10 lg:mt-12 w-full relative z-10">
            {trustPoints.map((point) => (
              <li 
                key={point.label} 
                className="relative flex items-center gap-3 bg-white/75 backdrop-blur-sm border border-brand-cream-300/70 px-4 py-3.5 rounded-2xl shadow-[var(--shadow-elevation-1)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-2)]"
              >
                <div className="bg-brand-sage-100/70 border border-brand-sage-200/20 text-brand-sage-800 p-2 rounded-full shrink-0 flex items-center justify-center size-9">
                  <point.icon className="size-4" aria-hidden="true" />
                </div>
                <span className="text-brand-navy-950 text-[0.82rem] font-bold leading-tight">{point.label}</span>
                
                {/* Center bottom gold diamond ornament */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 bg-brand-cream-100 border border-brand-gold-500 rotate-45 flex items-center justify-center">
                  <div className="size-0.5 bg-brand-gold-500 rounded-full" />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>

      {/* Focus card reflection embed wrapper section */}
      <Container width="reading">
        <div id="the-reflection" className="mt-16 sm:mt-20 lg:mt-24 relative">
          <div aria-hidden="true" className="from-brand-sage-300/20 via-brand-cream-300/10 pointer-events-none absolute -inset-10 rounded-[40px] bg-radial to-transparent blur-2xl" />
          
          <Reveal>
            <div className="relative border border-brand-sage-300/40 bg-white/95 backdrop-blur-md rounded-[32px] p-6 sm:p-10 lg:p-12 shadow-[var(--shadow-elevation-3)]">
              <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
                <span className="bg-brand-sage-700 text-brand-cream-100 text-[0.65rem] font-bold tracking-[0.25em] uppercase px-3.5 py-1.5 rounded-full mb-4">
                  Assessment Portal
                </span>
                <h2 className="font-heading text-brand-navy-950 text-2xl sm:text-3xl leading-tight max-w-xl">
                  Take the 5-Minute Parent Reflection
                </h2>
                <div className="h-0.5 w-12 bg-brand-gold-500 rounded-full mt-4 mb-3" />
                <p className="text-brand-navy-800 text-sm max-w-md">
                  Answer the questions based on what you observe at home. Completely private.
                </p>
              </div>

              <div className="bg-brand-cream-200/30 border border-brand-cream-300/30 rounded-2xl p-2 sm:p-4">
                <ScoreAppEmbed embedUrl={env.NEXT_PUBLIC_SCOREAPP_EMBED_URL} />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
