import type { Metadata } from "next";
import { ArrowRight, Gift, ShieldCheck } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { QuoteBlock } from "@/components/content/QuoteBlock";
import { PendingCheckoutButton } from "@/components/content/PendingCheckoutButton";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { Eyebrow } from "@/components/content/Eyebrow";
import { products, formatMinorAsGbp, membershipConfig } from "@/config/products";

export const metadata: Metadata = {
  title: "The Learning Confidence Parent Guide",
  description:
    "The complete method for rebuilding your child's confidence in learning, delivered entirely through you. Written for the whole of the 6 to 16 age group.",
  openGraph: {
    title: "The Learning Confidence Parent Guide: Rebuild Your Child's Confidence",
    description:
      "The complete method for rebuilding your child's confidence in learning, delivered entirely through you. Written for the whole of the 6 to 16 age group.",
    type: "website",
    url: "/parent-guide",
    siteName: "The Confident Learning Co.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Learning Confidence Parent Guide: Rebuild Your Child's Confidence",
    description:
      "The complete method for rebuilding your child's confidence in learning, delivered entirely through you. Written for the whole of the 6 to 16 age group.",
  },
};

const guide = products.guide;

const ageBands = [
  {
    label: "Years 2 to 4",
    heading: "The homework that ends in tears",
    body: "The homework that ends in tears, the Monday morning tummy ache, and the child who will not try in front of you.",
    image: "/images/rubbed-through-page.jpg",
    alt: "An exercise book page rubbed through by an eraser, pencil shavings scattered nearby",
    shotNote: "Rubbed-through homework page (Years 2 to 4)",
  },
  {
    label: "Years 5 to 6",
    heading: "The comparison that arrives",
    body: "The comparison that arrives around Year 5, the answers that stop being volunteered, and the move up to secondary.",
    image: "/images/empty-desk-window.jpg",
    alt: "An empty study desk by a window with an open notebook and a mug",
    shotNote: "Empty desk by a window (Years 5 to 6)",
  },
  {
    label: "Years 7 to 9",
    heading: "The quiet drift",
    body: "Homework not done and not mentioned, the report that says capable but not applying himself, options chosen to avoid a subject.",
    image: "/images/phone-facedown-bed.jpg",
    alt: "A smartphone lying face-down on a bed next to a pair of headphones",
    shotNote: "Phone face down on a duvet (Years 7 to 9)",
  },
  {
    label: "Years 10 to 11",
    heading: "The story already written",
    body: "The revision that never starts, the coursework left, and the mock result that confirms a story your child wrote two years earlier.",
    image: "/images/revision-timetable.jpg",
    alt: "A handwritten revision timetable pinned to a wall with only the first week filled in",
    shotNote: "Revision timetable (Years 10 to 11)",
  },
] as const;

const timelineItems = [
  {
    numeral: "01",
    label: "YEARS 2 TO 4",
    body: "In Years 2 to 4, that means the homework that ends in tears, the Monday morning tummy ache, and the child who will not try in front of you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7.5 text-brand-sage-800">
        <circle cx="12" cy="14.5" r="5" />
        <circle cx="9.5" cy="13.5" r="0.6" fill="currentColor" />
        <circle cx="14.5" cy="13.5" r="0.6" fill="currentColor" />
        <ellipse cx="12" cy="15.5" rx="1" ry="0.6" fill="currentColor" />
        <circle cx="8.5" cy="9.5" r="1.8" />
        <circle cx="15.5" cy="9.5" r="1.8" />
        <path d="M12,9.5 C12,9.5 12,12 12,13" />
      </svg>
    )
  },
  {
    numeral: "02",
    label: "YEARS 5 TO 6",
    body: "In Years 5 to 6, it means the comparison that arrives around Year 5, the answers that stop being volunteered, and the move up to secondary that flattens whatever confidence was left.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7 text-brand-sage-800">
        <path d="M12,3 L12,21 M12,7 L5,10 M12,7 L19,10" />
        <path d="M5,10 L3,16 Q5,18 7,16 Z M19,10 L17,16 Q19,18 21,16 Z" />
        <path d="M8,21 L16,21" />
      </svg>
    )
  },
  {
    numeral: "03",
    label: "YEARS 7 TO 9",
    body: "In Years 7 to 9, it means the drift: homework not done and not mentioned, the report that says capable but not applying himself, and options chosen to avoid a subject rather than to want one.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7 text-brand-sage-800">
        <circle cx="12" cy="12" r="9" />
        <path d="M16.2,7.8 L13.5,13.5 L7.8,16.2 L10.5,10.5 Z" fill="currentColor" fillOpacity="0.1" />
      </svg>
    )
  },
  {
    numeral: "04",
    label: "YEARS 10 AND 11",
    body: "In Years 10 and 11, it means the revision that never starts, the coursework left, and the mock result that confirms a story your child wrote about themselves two years earlier.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-7.5 text-brand-sage-800">
        <path d="M2,3 C2,3 7,5 12,5 C17,5 22,3 22,3 L22,17 C22,17 17,19 12,19 C7,19 2,17 2,17 Z M12,5 L12,19" />
      </svg>
    )
  }
];

export default function ParentGuidePage() {
  const cardAccents = [
    { bar: "bg-brand-gold-500", dot: "bg-brand-gold-500", numeral: "text-brand-gold-500/[0.14]" },
    { bar: "bg-brand-sage-600", dot: "bg-brand-sage-600", numeral: "text-brand-sage-600/[0.14]" },
    { bar: "bg-brand-navy-700", dot: "bg-brand-navy-700", numeral: "text-brand-navy-700/[0.09]" },
    { bar: "bg-brand-gold-700", dot: "bg-brand-gold-700", numeral: "text-brand-gold-700/[0.14]" },
  ] as const;

  return (
    <>
      <Section background="cream" className="relative overflow-hidden pt-12 sm:pt-16 pb-20 sm:pb-28">
        {/* Subtle ambient background glow bubbles */}
        <div
          aria-hidden="true"
          className="from-brand-gold-100/60 via-brand-sage-100/40 pointer-events-none absolute -top-24 -right-32 size-[36rem] rounded-full bg-gradient-to-br to-transparent blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-brand-sage-200/25 pointer-events-none absolute -bottom-32 -left-24 size-[26rem] rounded-full blur-3xl"
        />

        {/* Faint background contour wavy lines */}
        <div className="absolute top-0 right-0 w-[45%] h-[400px] opacity-[0.06] pointer-events-none select-none text-brand-gold-600">
          <svg className="w-full h-full" viewBox="0 0 400 400" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M100,-50 Q200,100 450,50" />
            <path d="M120,-70 Q240,110 470,30" />
            <path d="M80,-30 Q160,90 430,70" />
          </svg>
        </div>

        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            
            {/* Left Column - Beautiful Notched Framed Image (spans 6 cols for larger size) */}
            <Reveal delay={0.04} className="lg:col-span-6 relative order-2 lg:order-1">
              <div className="relative p-6 sm:p-8 bg-white border border-brand-cream-300 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(20,32,56,0.08)]">
                {/* Elegant internal double-border line with diamonds */}
                <div className="absolute inset-4 border border-brand-gold-500/30 rounded-[20px] pointer-events-none">
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

                {/* Dotted border wrapper for the image */}
                <div className="relative border border-dashed border-brand-sage-300/50 bg-brand-sage-100/30 rounded-[18px] p-2 overflow-hidden">
                  <EditorialImage
                    shotNote="Shot 3: Adam seated, warm interior, wide frame"
                    className="rounded-xl transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Overlapping botanical leaf branch badge */}
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 translate-x-1/4 translate-y-1/4 size-16 sm:size-20 rounded-full bg-white border border-brand-cream-300 shadow-[0_8px_20px_-6px_rgba(20,32,56,0.12)] flex items-center justify-center z-20">
                  <svg className="size-10 sm:size-12 text-brand-sage-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M50,85 C50,85 50,55 65,30" strokeLinecap="round" />
                    <path d="M50,85 C50,85 45,55 30,35" strokeLinecap="round" />
                    <path d="M57,55 Q67,50 72,58 Q62,65 57,55" fill="currentColor" fillOpacity="0.15" />
                    <path d="M62,40 Q72,35 75,44 Q65,49 62,40" fill="currentColor" fillOpacity="0.15" />
                    <path d="M65,26 Q73,20 74,29 Q67,33 65,26" fill="currentColor" fillOpacity="0.15" />
                    <path d="M43,62 Q33,58 35,67 Q43,71 43,62" fill="currentColor" fillOpacity="0.15" />
                    <path d="M38,47 Q28,42 27,51 Q37,55 38,47" fill="currentColor" fillOpacity="0.15" />
                    <path d="M32,32 Q22,27 20,36 Q30,39 32,32" fill="currentColor" fillOpacity="0.15" />
                    <path d="M50,22 Q50,10 53,10 Q56,12 50,22" fill="currentColor" fillOpacity="0.15" />
                  </svg>
                </div>
              </div>
            </Reveal>

            {/* Right Column - Hero Content (spans 6 cols) */}
            <Reveal className="lg:col-span-6 flex flex-col gap-6 order-1 lg:order-2">
              <div className="flex flex-col gap-4">
                <Eyebrow>For parents of 6 to 16 year olds</Eyebrow>
                <h1 className="font-heading text-brand-navy-950 text-[clamp(2.35rem,3.2vw+1.2rem,3.65rem)] leading-[1.05] text-balance">
                  The Learning Confidence Parent Guide
                </h1>

                {/* Decorative divider line */}
                <div className="flex items-center gap-3 w-40 mt-1">
                  <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
                  <svg className="size-2.5 text-brand-gold-600 fill-brand-gold-600 rotate-45" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" />
                  </svg>
                  <div className="h-[1.5px] bg-brand-gold-500/40 flex-1" />
                </div>
              </div>

              <p className="text-brand-navy-950 max-w-prose text-lg leading-relaxed font-medium">
                The complete method for rebuilding your child&rsquo;s confidence in learning,
                delivered entirely through you. Written for the whole of the 6 to 16 age group.
              </p>

              <div className="mt-4">
                <PrimaryCTA href="#the-guide-offer" size="lg" arrow className="w-fit">
                  See the Guide
                </PrimaryCTA>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white" className="py-16 sm:py-20">
        <Container width="reading">
          <Reveal>
            <div className="flex flex-col gap-6 leading-relaxed text-brand-navy-900 text-base sm:text-lg border-l border-brand-sage-300/60 pl-6 sm:pl-8 italic">
              <p>
                You have tried encouragement. You have tried backing off. You have tried sitting
                beside them while the work gets rubbed through, or standing outside a door that
                will not open. The problem was never your effort. It is that nobody ever handed
                you a method.
              </p>
              <p className="not-italic text-brand-navy-800 text-base font-normal">
                The Guide gives you one: a named, repeatable framework you can run at your own
                kitchen table, in the real moments, with the child you actually have. No scripts
                to perform. No pressure to add. Every step is something a tired parent can do on
                a Tuesday.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="cream" className="relative overflow-hidden py-20 sm:py-24">
        <Container>
          <Reveal className="text-center mb-4">
            <h2 className="font-heading text-3xl sm:text-4xl text-brand-navy-950">
              Whatever age your child is
            </h2>
          </Reveal>
          <Reveal delay={0.04} className="text-center mb-12 lg:mb-16">
            <p className="text-brand-navy-800 mx-auto max-w-2xl leading-relaxed">
              The method is the same at seven and at fifteen. What changes is what it looks like
              in your house, and the Guide walks all of it.
            </p>
          </Reveal>

          {/* Upgraded premium standardized grid cards */}
          <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {ageBands.map((band, index) => {
              const accent = cardAccents[index % cardAccents.length];
              const numeral = String(index + 1).padStart(2, "0");

              return (
                <Reveal key={band.label} delay={0.06 + index * 0.05} className="h-full">
                  <div className="group border-border/60 bg-surface relative isolate flex h-full flex-col overflow-hidden rounded-[20px] border p-4.5 shadow-[var(--shadow-elevation-1)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-elevation-2)] sm:p-5">
                    {/* Faded editorial numeral background */}
                    <span
                      aria-hidden="true"
                      className={`font-heading pointer-events-none absolute -top-3 right-4 z-0 text-[5rem] leading-none select-none sm:-top-4 sm:right-5 sm:text-[6rem] ${accent.numeral}`}
                    >
                      {numeral}
                    </span>

                    <div className="relative z-10 overflow-hidden rounded-xl">
                      <EditorialImage
                        shotNote={band.shotNote}
                        src={band.image}
                        alt={band.alt}
                        className="rounded-xl [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-[1.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="from-brand-navy-950/30 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                      />
                      <span className="bg-brand-cream-100/95 text-brand-navy-900 absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase shadow-sm backdrop-blur-sm">
                        <span aria-hidden="true" className={`size-1.5 rounded-full ${accent.dot}`} />
                        {band.label}
                      </span>
                    </div>

                    <div className="relative z-10 mt-4 flex flex-1 flex-col gap-2">
                      <span aria-hidden="true" className={`h-[3px] w-8 rounded-full ${accent.bar}`} />
                      <h3 className="font-heading text-base sm:text-lg leading-snug">{band.heading}</h3>
                      <p className="text-brand-navy-800/90 flex-1 text-xs sm:text-sm leading-relaxed">
                        {band.body}
                      </p>
                      
                      <div className="mt-2.5 pt-2.5 border-t border-brand-cream-300/40">
                        <a
                          href="#the-guide-offer"
                          className="text-brand-sage-800 hover:text-brand-navy-900 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-200"
                        >
                          See the Guide
                          <ArrowRight
                            className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Beautiful Timeline (Matches User Mockup Image Exactly) */}
          <div className="relative flex flex-col gap-8 md:gap-10 max-w-4xl mx-auto py-10 border-t border-brand-cream-300/50 mt-16">
            
            {/* Central connecting line with diamond ornaments */}
            <div aria-hidden="true" className="absolute left-5 md:left-[96px] top-14 bottom-14 w-[1.5px] bg-brand-gold-500/30 -translate-x-1/2">
              <div className="absolute top-[16.6%] -translate-y-1/2 left-1/2 -translate-x-1/2 size-2 bg-white border border-brand-gold-500 rotate-45 flex items-center justify-center">
                <div className="size-0.5 bg-brand-gold-500 rounded-full" />
              </div>
              <div className="absolute top-[50%] -translate-y-1/2 left-1/2 -translate-x-1/2 size-2 bg-white border border-brand-gold-500 rotate-45 flex items-center justify-center">
                <div className="size-0.5 bg-brand-gold-500 rounded-full" />
              </div>
              <div className="absolute top-[83.3%] -translate-y-1/2 left-1/2 -translate-x-1/2 size-2 bg-white border border-brand-gold-500 rotate-45 flex items-center justify-center">
                <div className="size-0.5 bg-brand-gold-500 rounded-full" />
              </div>
            </div>

            {timelineItems.map((item, idx) => (
              <Reveal key={item.numeral} delay={0.06 + idx * 0.05} className="w-full">
                <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-6 pl-12 md:pl-[140px]">
                  
                  {/* Number Circle aligned mathematically to the central line */}
                  <div className="absolute left-0 md:left-[76px] size-10 rounded-full border border-brand-gold-500/60 bg-white flex items-center justify-center text-sm font-heading font-semibold text-brand-navy-950 shadow-sm z-10 shrink-0 select-none">
                    {item.numeral}
                  </div>

                  {/* Circular double/dashed icon wrapper */}
                  <div className="size-16 rounded-full border border-dashed border-brand-sage-400 bg-brand-sage-50/50 flex items-center justify-center shrink-0 shadow-sm">
                    {item.icon}
                  </div>

                  {/* Thin vertical grey separator line */}
                  <div aria-hidden="true" className="hidden md:block w-[1px] h-12 bg-brand-cream-300/80 shrink-0 self-center" />

                  {/* Text columns */}
                  <div className="flex-1 flex flex-col gap-1 pr-4">
                    <h3 className="font-heading text-brand-navy-950 text-[1.05rem] font-bold tracking-wider uppercase leading-snug">
                      {item.label}
                    </h3>
                    <p className="text-brand-navy-800 text-sm sm:text-[0.95rem] leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>

                {/* Separation line between items */}
                {idx < timelineItems.length - 1 && (
                  <div aria-hidden="true" className="h-[1px] bg-brand-cream-300/30 w-full my-6 md:my-8" />
                )}
              </Reveal>
            ))}
          </div>

          {/* Premium Notched Wreath Summary Container */}
          <Reveal delay={0.1}>
            <div className="relative border border-brand-gold-500/40 bg-white/95 rounded-[32px] p-8 sm:p-12 shadow-[var(--shadow-elevation-2)] max-w-4xl mx-auto mt-8 scroll-mt-24 overflow-hidden">
              
              {/* Notched internal border lines */}
              <div className="absolute inset-4 border border-brand-gold-500/30 rounded-[20px] pointer-events-none">
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
              </div>

              {/* Laurel wreath badge at top center */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-1 z-10 border border-brand-gold-500/35 rounded-full shadow-sm flex items-center justify-center">
                <svg className="size-7 text-brand-gold-700" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M35,30 C30,45 32,60 45,70 C46,71 48,70 47,68 C38,58 35,45 38,32" strokeLinecap="round" />
                  <path d="M65,30 C70,45 68,60 55,70 C54,71 52,70 53,68 C62,58 65,45 62,32" strokeLinecap="round" />
                  <path d="M36,36 Q28,32 30,40 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M34,46 Q26,42 29,50 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M34,56 Q27,53 31,60 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M64,36 Q72,32 70,40 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M66,46 Q74,42 71,50 Z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M66,56 Q73,53 69,60 Z" fill="currentColor" fillOpacity="0.2" />
                </svg>
              </div>

              {/* Bottom-left corner leaf stem illustration */}
              <div aria-hidden="true" className="absolute bottom-2 left-2 size-20 text-brand-sage-700/20 pointer-events-none select-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20,80 Q25,50 45,30" strokeLinecap="round" />
                  <path d="M30,60 Q40,55 42,63 Q32,68 30,60" fill="currentColor" fillOpacity="0.15" />
                  <path d="M35,45 Q45,40 46,48 Q36,53 35,45" fill="currentColor" fillOpacity="0.15" />
                  <path d="M42,33 Q50,28 50,36 Q42,41 42,33" fill="currentColor" fillOpacity="0.15" />
                </svg>
              </div>

              {/* Bottom-right corner leaf stem illustration */}
              <div aria-hidden="true" className="absolute bottom-2 right-2 size-20 text-brand-sage-700/20 pointer-events-none select-none scale-x-[-1]">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20,80 Q25,50 45,30" strokeLinecap="round" />
                  <path d="M30,60 Q40,55 42,63 Q32,68 30,60" fill="currentColor" fillOpacity="0.15" />
                  <path d="M35,45 Q45,40 46,48 Q36,53 35,45" fill="currentColor" fillOpacity="0.15" />
                  <path d="M42,33 Q50,28 50,36 Q42,41 42,33" fill="currentColor" fillOpacity="0.15" />
                </svg>
              </div>

              {/* Text copy */}
              <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center gap-4">
                <p className="font-heading text-brand-navy-950 text-base sm:text-[1.08rem] leading-relaxed">
                  Every part of the method is shown across <span className="italic">all four</span>, with worked examples from real situations in each band, because a Year 10 will not sit down for something written for a Year 3 and will spot the attempt instantly.
                </p>
                
                {/* Center tiny gold diamond star */}
                <div className="flex items-center justify-center gap-2 mt-1">
                  <div className="h-[1px] w-6 bg-brand-gold-500/40" />
                  <div className="size-1.5 bg-brand-gold-500 rotate-45" />
                  <div className="h-[1px] w-6 bg-brand-gold-500/40" />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="white" className="py-16 sm:py-20">
        <Container width="reading">
          <Reveal>
            <div className="flex flex-col gap-8 leading-relaxed">
              <h2 className="font-heading text-3xl text-brand-navy-950">What is inside</h2>
              <p className="text-brand-navy-800 text-base sm:text-lg leading-relaxed">
                The full framework, step by step, with the reasoning behind each move so you can
                adapt it rather than recite it. The settling work that comes first, because no
                method lands on an unsettled child. Worked examples in all four bands. And the
                exact words for the moments that usually go wrong, written four ways, because what
                works at seven will get you a closed door at fifteen.
              </p>

              {/* Upgraded included membership card */}
              <div className="relative border border-brand-sage-300/40 bg-surface-sage rounded-[24px] p-6 sm:p-8 shadow-[var(--shadow-elevation-1)] overflow-hidden">
                <div className="absolute -right-8 -bottom-8 size-32 text-brand-sage-300/20 pointer-events-none">
                  <Gift className="w-full h-full" />
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-brand-sage-700 text-brand-cream-100 p-2.5 rounded-xl shrink-0 flex items-center justify-center shadow-sm">
                    <Gift className="size-6" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-heading text-brand-navy-950 text-xl leading-tight">
                      Included: 30 days&rsquo; membership of Inside the Loop
                    </h3>
                    <p className="text-brand-navy-800 text-sm sm:text-base leading-relaxed mt-1">
                      A month of full membership: the community, the resource library, the bi-weekly
                      live session, and both specialists in the room. After{" "}
                      {membershipConfig.includedDays} days, staying is your choice at{" "}
                      {formatMinorAsGbp(membershipConfig.priceMinor)} per month. Nothing converts
                      automatically and nobody is charged without choosing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="sage" className="relative overflow-hidden py-20 sm:py-24">
        {/* Ambient background glow inside the sage section */}
        <div aria-hidden="true" className="from-brand-sage-300/30 pointer-events-none absolute -bottom-24 -right-24 size-[28rem] rounded-full blur-3xl" />
        
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            
            {/* Michela portrait classical notched frame (spans 6 cols for larger size) */}
            <Reveal className="lg:col-span-6 relative">
              <div className="relative p-6 sm:p-8 bg-white border border-brand-cream-300 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(20,32,56,0.08)]">
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
                  <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 size-3 bg-white border border-brand-gold-500 flex items-center justify-center rotate-45">
                    <div className="size-1 bg-brand-gold-500 rounded-full" />
                  </div>
                </div>

                <div className="relative border border-dashed border-brand-sage-300/50 bg-brand-sage-100/30 rounded-[18px] p-2 overflow-hidden">
                  <FounderPortrait founder="Michela" shotNote="mid-talk" />
                </div>
                
                {/* Overlapping botanical leaf badge */}
                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 translate-x-1/4 translate-y-1/4 size-16 sm:size-20 rounded-full bg-white border border-brand-cream-300 shadow-[0_8px_20px_-6px_rgba(20,32,56,0.12)] flex items-center justify-center z-20">
                  <svg className="size-10 sm:size-12 text-brand-sage-800" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M50,85 C50,85 50,55 65,30" strokeLinecap="round" />
                    <path d="M50,85 C50,85 45,55 30,35" strokeLinecap="round" />
                    <path d="M57,55 Q67,50 72,58 Q62,65 57,55" fill="currentColor" fillOpacity="0.15" />
                    <path d="M62,40 Q72,35 75,44 Q65,49 62,40" fill="currentColor" fillOpacity="0.15" />
                    <path d="M65,26 Q73,20 74,29 Q67,33 65,26" fill="currentColor" fillOpacity="0.15" />
                    <path d="M43,62 Q33,58 35,67 Q43,71 43,62" fill="currentColor" fillOpacity="0.15" />
                    <path d="M38,47 Q28,42 27,51 Q37,55 38,47" fill="currentColor" fillOpacity="0.15" />
                    <path d="M32,32 Q22,27 20,36 Q30,39 32,32" fill="currentColor" fillOpacity="0.15" />
                    <path d="M50,22 Q50,10 53,10 Q56,12 50,22" fill="currentColor" fillOpacity="0.15" />
                  </svg>
                </div>
              </div>
            </Reveal>

            {/* Michela testimonial text side (spans 6 cols) */}
            <Reveal delay={0.08} className="lg:col-span-6 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <span className="bg-brand-sage-800 text-brand-cream-100 text-[0.62rem] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border border-brand-sage-700 w-fit">
                  Expert Perspective
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl text-brand-navy-950">
                  If your child is at secondary school, read this first
                </h2>
              </div>
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
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Upgraded checkout Founders Offer Focus container */}
      <Section background="cream" className="relative overflow-hidden py-16 sm:py-24">
        {/* Glow behind checkout card */}
        <div aria-hidden="true" className="from-brand-gold-100/40 via-brand-sage-100/20 pointer-events-none absolute -bottom-24 -left-24 size-[32rem] rounded-full blur-3xl" />
        
        <Container width="reading">
          <Reveal>
            <div
              id="the-guide-offer"
              className="relative border border-brand-gold-500/40 bg-white/95 backdrop-blur-md rounded-[32px] p-8 sm:p-12 shadow-[var(--shadow-elevation-3)] overflow-hidden flex flex-col items-center gap-6 max-w-xl mx-auto scroll-mt-24"
            >
              {/* Subtle background glow */}
              <div aria-hidden="true" className="from-brand-gold-300/35 via-brand-cream-300/10 pointer-events-none absolute -inset-10 rounded-[40px] bg-radial to-transparent blur-2xl" />
              
              <span className="relative z-10 bg-brand-gold-700 text-brand-cream-100 text-[0.62rem] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full shadow-sm">
                Founders Offer
              </span>
              
              <h2 className="relative z-10 font-heading text-brand-navy-950 text-2xl sm:text-3.5xl leading-tight text-center">
                The Learning Confidence Parent Guide
              </h2>
              
              <div aria-hidden="true" className="relative z-10 h-0.5 w-12 bg-brand-gold-500 rounded-full" />
              
              <div className="relative z-10 flex flex-col items-center gap-1.5 text-center bg-brand-cream-200/50 border border-brand-cream-300/40 rounded-2xl px-6 py-4 w-full">
                <p className="text-[10px] text-brand-sage-800 uppercase tracking-widest font-bold">Special Pricing</p>
                <div className="flex items-baseline gap-2.5 mt-0.5">
                  <span className="text-brand-navy-950 text-3xl sm:text-4xl font-extrabold font-heading leading-none">
                    {formatMinorAsGbp(guide.founderPriceMinor!)}
                  </span>
                  <span className="text-muted-foreground text-sm line-through">
                    Full price {formatMinorAsGbp(guide.fullPriceMinor!)}
                  </span>
                </div>
              </div>

              <div className="relative z-10 w-full flex flex-col items-center gap-4">
                {guide.stripePriceId ? (
                  <PrimaryCTA href="/checkout/guide" size="lg" arrow className="w-full shadow-[0_10px_25px_-5px_rgba(201,169,97,0.45)]">
                    {`Get the Parent Guide, ${formatMinorAsGbp(guide.founderPriceMinor!)}`}
                  </PrimaryCTA>
                ) : (
                  <PendingCheckoutButton
                    label={`Get the Parent Guide, ${formatMinorAsGbp(guide.founderPriceMinor!)}`}
                    size="lg"
                    className="w-full"
                  />
                )}
                
                <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs text-center mt-2 max-w-sm">
                  <ShieldCheck className="text-brand-sage-700 size-4 shrink-0" aria-hidden="true" />
                  Secure checkout through Stripe. The Guide and your community invitation arrive by
                  email within minutes.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
