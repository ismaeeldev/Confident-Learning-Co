import type { Metadata } from "next";
import { BookOpen, KeyRound, RefreshCw, Tag, Users2, Video } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { Eyebrow } from "@/components/content/Eyebrow";
import { PUBLIC_ROUTES } from "@/config/canon";
import { formatMinorAsGbp, membershipConfig } from "@/config/products";

export const metadata: Metadata = {
  title: "Inside the Loop",
  description: "The members community of The Confident Learning Co.",
  openGraph: {
    title: "Inside the Loop Community: The Confident Learning Co.",
    description: "The members-only community where parent learning confidence specialist coaching keeps working every day.",
    type: "website",
    url: "/inside-the-loop",
    siteName: "The Confident Learning Co.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inside the Loop Community: The Confident Learning Co.",
    description: "The members-only community where parent learning confidence specialist coaching keeps working every day.",
  },
};

const heroTrustItems = [
  { icon: Users2, label: "Community across all four age bands" },
  { icon: BookOpen, label: "New Confidence Library material every month" },
  { icon: Video, label: "Fortnightly live sessions on Zoom" },
] as const;

const founders = [
  {
    founder: "Adam" as const,
    role: "Founder and Learning Confidence Specialist",
    src: "/assets/Inside the Loop Adam.jpg",
  },
  {
    founder: "Michela" as const,
    role: "Learning Confidence Specialist",
    src: "/assets/Inside the Loop Michela.jpg",
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
    body: "The fortnightly live session on Zoom, where we work through real situations from across the range.",
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
            
            {/* Left Column - Beautiful Notched Framed Image (spans 6 cols) */}
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
                    shotNote="Shot 8: the two of you together, to camera"
                    src="/assets/Inside the Loop top.jpg"
                    alt="Adam and Michela"
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
                <Eyebrow>The Members Community</Eyebrow>
                <h1 className="font-heading text-brand-navy-950 text-[clamp(2.35rem,3.2vw+1.2rem,3.65rem)] leading-[1.05] text-balance">
                  Inside the Loop
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
                The members community of The Confident Learning Co.
              </p>

              {/* Styled Trust badges */}
              <ul className="flex flex-col gap-3.5 mt-2">
                {heroTrustItems.map((item) => (
                  <li 
                    key={item.label} 
                    className="flex items-center gap-3.5 bg-white/60 backdrop-blur-sm border border-brand-cream-300/45 px-4.5 py-3 rounded-2xl shadow-[var(--shadow-elevation-1)] w-fit max-w-full"
                  >
                    <div className="bg-brand-sage-100 text-brand-sage-800 p-2.5 rounded-full size-9 shrink-0 flex items-center justify-center border border-brand-sage-200/20">
                      <item.icon className="size-4.5" aria-hidden="true" />
                    </div>
                    <span className="text-brand-navy-900 text-sm font-semibold leading-snug">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white" className="py-16 sm:py-20">
        <Container width="reading">
          <Reveal>
            <div className="flex flex-col gap-6 leading-relaxed text-brand-navy-900 text-base sm:text-lg border-l border-brand-sage-300/60 pl-6 sm:pl-8 italic">
              <p>
                The Guide gives you the method. Inside the Loop is where it keeps working: the
                place you bring the real weeks, the wobbly Wednesdays, the wins too small to tell
                anyone else and too important not to tell someone.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="sage" className="relative overflow-hidden py-20 sm:py-24">
        {/* Ambient background glow inside the sage section */}
        <div aria-hidden="true" className="from-brand-sage-300/30 pointer-events-none absolute -bottom-24 -right-24 size-[28rem] rounded-full blur-3xl" />
        
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
            
            {/* Left Column - Founder Portraits Grid (spans 6 cols) */}
            <Reveal className="lg:col-span-6 relative">
              <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {founders.map((person) => (
                  <div
                    key={person.founder}
                    className="group relative border border-brand-cream-300 bg-white flex flex-col gap-3 rounded-[24px] p-3 shadow-[var(--shadow-elevation-1)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-elevation-2)] overflow-hidden"
                  >
                    {/* Subtle frame borders */}
                    <div className="absolute inset-2 border border-brand-gold-500/20 rounded-[16px] pointer-events-none" />
                    
                    <div className="relative border border-dashed border-brand-sage-300/40 bg-brand-sage-100/25 rounded-[12px] p-1.5 overflow-hidden">
                      <FounderPortrait
                        founder={person.founder}
                        shotNote="vertical portrait"
                        src={person.src}
                        className="rounded-lg [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out group-hover:[&_img]:scale-[1.03]"
                      />
                    </div>
                    
                    <div className="relative z-10 flex flex-col gap-0.5 px-1.5 pb-1">
                      <h3 className="font-heading text-brand-navy-950 text-base leading-snug sm:text-lg">
                        {person.founder}
                      </h3>
                      <p className="text-brand-navy-800 text-[10px] sm:text-xs leading-snug font-semibold">
                        {person.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Right Column - Testimonial copy (spans 6 cols) */}
            <Reveal delay={0.08} className="lg:col-span-6 flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <span className="bg-brand-sage-800 text-brand-cream-100 text-[0.62rem] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full border border-brand-sage-700 w-fit">
                  Founder Specialists
                </span>
                <h2 className="font-heading text-2xl sm:text-3.5xl text-brand-navy-950 leading-tight">
                  Both of us are in here, every day
                </h2>
              </div>
              <p className="text-brand-navy-800 leading-relaxed text-sm sm:text-base">
                Adam works across the whole range and leads the confidence side of the method.
                Michela brings nearly two decades with young people in Years 7 to 11, in schools
                and in family homes. So whether you are asking about a seven year old refusing
                to pick up a pencil, a Year 9 who has quietly stopped bothering, or a Year 11 who
                has not opened a book since October, one of us has stood in that exact room
                before.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="cream" className="relative overflow-hidden py-20 sm:py-24">
        <Container>
          <Reveal className="text-center mb-4">
            <h2 className="font-heading text-3xl sm:text-4xl text-brand-navy-950">
              What membership includes
            </h2>
          </Reveal>
          <Reveal delay={0.04} className="text-center mb-12 lg:mb-16">
            <div aria-hidden="true" className="h-0.5 w-12 bg-brand-gold-500 rounded-full mx-auto" />
          </Reveal>

          {/* Upgraded standard grid cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {benefits.map((benefit, index) => {
              const accent = cardAccents[index % cardAccents.length];
              const numeral = String(index + 1).padStart(2, "0");

              return (
                <Reveal key={benefit.label} delay={index * 0.05} className="h-full">
                  <div className="group border-border/60 bg-surface relative isolate flex h-full flex-col overflow-hidden rounded-[20px] border p-5 shadow-[var(--shadow-elevation-1)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-elevation-2)] sm:p-6">
                    {/* Faded editorial numeral backdrop */}
                    <span
                      aria-hidden="true"
                      className={`font-heading pointer-events-none absolute -top-3 right-4 z-0 text-[5rem] leading-none select-none sm:-top-4 sm:right-5 sm:text-[6rem] ${accent.numeral}`}
                    >
                      {numeral}
                    </span>

                    {/* Icon bubble */}
                    <div className="relative z-10 bg-brand-sage-100 text-brand-sage-800 p-2.5 rounded-full size-11 flex items-center justify-center border border-brand-sage-200/20 shadow-sm shrink-0 mb-4 transition-transform duration-300 group-hover:scale-110">
                      <benefit.icon className="size-5.5" aria-hidden="true" />
                    </div>

                    <div className="relative z-10 flex flex-1 flex-col gap-2.5">
                      <span aria-hidden="true" className={`h-[3px] w-8 rounded-full ${accent.bar}`} />
                      <h3 className="font-heading text-lg sm:text-xl leading-snug">{benefit.label}</h3>
                      <p className="text-brand-navy-800 flex-1 text-sm leading-relaxed">
                        {benefit.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section background="white" className="py-20 sm:py-24">
        <Container>
          {/* Conversation Portrait wrapped in notched frame */}
          <Reveal>
            <div className="relative p-6 sm:p-8 bg-white border border-brand-cream-300 rounded-[32px] shadow-[0_20px_50px_-12px_rgba(20,32,56,0.08)] mb-12 sm:mb-16 max-w-4xl mx-auto">
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
                  shotNote="Shot 7: the two of you in conversation"
                  src="/assets/Inside the Loop Bottom.jpg"
                  alt="Adam and Michela in conversation"
                  className="rounded-xl transition-transform duration-500 hover:scale-[1.01]"
                />
              </div>
            </div>
          </Reveal>

          {/* Upgraded checkout focus container */}
          <Reveal delay={0.05}>
            <div
              className="relative border border-brand-gold-500/40 bg-white/95 backdrop-blur-md rounded-[32px] p-8 sm:p-12 shadow-[var(--shadow-elevation-3)] overflow-hidden flex flex-col items-center gap-6 max-w-2xl mx-auto scroll-mt-24 text-center"
            >
              {/* Subtle background glow */}
              <div aria-hidden="true" className="from-brand-gold-300/35 via-brand-cream-300/10 pointer-events-none absolute -inset-10 rounded-[40px] bg-radial to-transparent blur-2xl" />
              
              <span className="relative z-10 bg-brand-gold-700 text-brand-cream-100 text-[0.62rem] font-bold tracking-[0.25em] uppercase px-4 py-1.5 rounded-full shadow-sm">
                Membership Pathway
              </span>
              
              <h2 className="relative z-10 font-heading text-brand-navy-950 text-2xl sm:text-3.5xl leading-tight">
                How you join
              </h2>
              
              <div aria-hidden="true" className="relative z-10 h-0.5 w-12 bg-brand-gold-500 rounded-full" />
              
              <p className="relative z-10 text-brand-navy-800 leading-relaxed text-base sm:text-lg">
                Membership comes with the Learning Confidence Parent Guide: every Guide includes
                {" "}{membershipConfig.includedDays} days of full membership. After that, staying is{" "}
                {formatMinorAsGbp(membershipConfig.priceMinor)} per month, cancel any time. There
                is no way to join without the Guide, deliberately, because the community works
                when everyone in it shares the same method.
              </p>
              
              {/* Styled List Items */}
              <ul className="relative z-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-6 sm:gap-y-2 mt-2 w-full">
                {joinPoints.map((point) => (
                  <li
                    key={point.label}
                    className="text-brand-navy-900 flex items-center justify-center gap-2 text-sm font-semibold bg-brand-cream-200/40 border border-brand-cream-300/30 px-4 py-2 rounded-xl"
                  >
                    <point.icon className="text-brand-sage-700 size-4.5 shrink-0" aria-hidden="true" />
                    {point.label}
                  </li>
                ))}
              </ul>
              
              <div className="relative z-10 w-full flex flex-col items-center gap-4 mt-2">
                <PrimaryCTA
                  href={PUBLIC_ROUTES.parentGuide}
                  size="lg"
                  arrow
                  className="w-full sm:w-auto shadow-[0_10px_25px_-5px_rgba(201,169,97,0.45)]"
                >
                  Start with the Parent Guide
                </PrimaryCTA>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
