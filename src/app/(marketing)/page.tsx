import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { EditorialImage } from "@/components/content/EditorialImage";
import { VideoEmbed } from "@/components/content/VideoEmbed";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { ScrollProgress } from "@/components/content/ScrollProgress";
import { PUBLIC_ROUTES, CHILD_BAND_LABELS } from "@/config/canon";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Bright child. Crumbling confidence. It does not look the same at seven as it does at fifteen, and you are not imagining either one.",
  openGraph: {
    title: "Rebuild Your Child's Learning Confidence: The Confident Learning Co.",
    description:
      "Bright child. Crumbling confidence. It does not look the same at seven as it does at fifteen, and you are not imagining either one.",
    type: "website",
    url: "/",
    siteName: "The Confident Learning Co.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rebuild Your Child's Learning Confidence: The Confident Learning Co.",
    description:
      "Bright child. Crumbling confidence. It does not look the same at seven as it does at fifteen, and you are not imagining either one.",
  },
};

const ageBandBlocks = [
  {
    band: CHILD_BAND_LABELS.early,
    ages: "ages 6 to 9",
    body: "The homework that takes an hour and ends in tears. Tummy aches on Monday mornings. “I’m on the wrong table.” A child who will not try in front of you, because trying and failing in front of you is the worst part of all.",
    image: "/images/rubbed-through-page.jpg",
    alt: "An exercise book page rubbed through by an eraser, pencil shavings scattered nearby",
  },
  {
    band: CHILD_BAND_LABELS.middle,
    ages: "ages 9 to 11",
    body: "Comparison arrives. They stop volunteering answers. “I’m rubbish at maths” stops being a complaint and becomes a fact they have accepted about themselves. Tests come home unmentioned, or not at all. Then secondary starts and flattens whatever was left.",
    image: "/images/empty-desk-window.jpg",
    alt: "An empty study desk by a window with an open notebook and a mug",
  },
  {
    band: CHILD_BAND_LABELS["lower-secondary"],
    ages: "ages 11 to 14",
    body: "The drift. Homework not done and not mentioned. “It’s boring.” A report that says capable but not applying himself. The phone becomes the room. Options picked to avoid a subject rather than because they wanted one. Quiet enough that everyone tells you it is just the age.",
    image: "/images/phone-facedown-bed.jpg",
    alt: "A smartphone lying face-down on a bed next to a pair of headphones",
  },
  {
    band: CHILD_BAND_LABELS["exam-years"],
    ages: "ages 14 to 16",
    body: "Revision that never starts. Coursework left. “I’ll be fine” and “there’s no point” in the same week. Coasting on purpose, so a bad grade never means anything about them. Mocks that confirm a story they wrote about themselves two years ago.",
    image: "/images/revision-timetable.jpg",
    alt: "A handwritten revision timetable pinned to a wall with only the first week filled in",
  },
];

/**
 * Splits a locked recognition-copy paragraph into a punchy opening "hook"
 * sentence and the remaining supporting sentences, purely for typographic
 * hierarchy. Splits on the first ". " so the hook is always the author's own
 * first sentence — no words are added, removed, or reworded. Concatenating
 * `hook + " " + rest` reproduces the original `body` string exactly.
 */
function splitHook(body: string): { hook: string; rest: string } {
  const breakIndex = body.indexOf(". ");
  if (breakIndex === -1) {
    return { hook: body, rest: "" };
  }
  return {
    hook: body.slice(0, breakIndex + 1),
    rest: body.slice(breakIndex + 2),
  };
}

/**
 * The "At seven / At eleven / At thirteen / At fifteen" recognition copy,
 * split into a timeline of {age, body} rows purely for layout. Concatenating
 * "At " + age + ", " + body across all four rows (with a space between rows)
 * reproduces the original single paragraph exactly — no words changed.
 */
const ageMoments = [
  {
    age: "seven",
    body: "it is tears over spellings and a page rubbed through until it tears.",
  },
  {
    age: "eleven",
    body: "it is a child who used to put their hand up and now hopes nobody looks at them.",
  },
  {
    age: "thirteen",
    body: "it is homework that was never mentioned and a door you knock on now instead of walking through.",
  },
  {
    age: "fifteen",
    body: "it is revision that never starts and “there is no point” said in a voice that has stopped arguing.",
  },
];

/** One accent per card, rotating through existing brand tokens only. */
const cardAccents = [
  { bar: "bg-brand-gold-500", dot: "bg-brand-gold-500", numeral: "text-brand-gold-500/[0.14]" },
  { bar: "bg-brand-sage-600", dot: "bg-brand-sage-600", numeral: "text-brand-sage-600/[0.14]" },
  { bar: "bg-brand-navy-700", dot: "bg-brand-navy-700", numeral: "text-brand-navy-700/[0.09]" },
  { bar: "bg-brand-gold-700", dot: "bg-brand-gold-700", numeral: "text-brand-gold-700/[0.14]" },
] as const;

export default function HomePage() {
  return (
    <>
      <ScrollProgress />

      <Section
        background="cream"
        className="relative overflow-hidden pt-10 sm:pt-14 lg:pt-20"
      >
        <div
          aria-hidden="true"
          className="from-brand-gold-100/70 via-brand-sage-100/40 pointer-events-none absolute -top-24 -right-32 size-[36rem] rounded-full bg-gradient-to-br to-transparent blur-3xl"
        />
        <div
          aria-hidden="true"
          className="bg-brand-sage-200/30 pointer-events-none absolute -bottom-32 -left-24 size-[26rem] rounded-full blur-3xl"
        />
        <Container className="relative">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal delay={0.08} distance={20} className="order-2 lg:order-1">
              <Parallax range={14}>
                <EditorialImage
                  shotNote="Shot 2: Adam, three-quarter, mid-talk, space to one side for headline text"
                  src="/assets/Homepage Top.jpg"
                  alt="Adam"
                  positionY="35%"
                  className="shadow-[var(--shadow-elevation-3)] ring-brand-cream-100 ring-1"
                />
              </Parallax>
            </Reveal>
            <Reveal distance={20} className="order-1 lg:order-2">
              <div className="flex flex-col gap-7">
                <span
                  aria-hidden="true"
                  className="bg-brand-gold-500 h-1 w-14 rounded-full"
                />
                <h1 className="font-heading text-[clamp(2.5rem,3vw+1.75rem,4.75rem)] leading-[1.02] tracking-[-0.01em] text-balance">
                  Bright child. Crumbling confidence.
                </h1>
                <p className="text-brand-navy-800 max-w-prose text-lg leading-relaxed sm:text-xl">
                  It does not look the same at seven as it does at fifteen, and you are not
                  imagining either one.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white" className="pt-10 sm:pt-12 lg:pt-16">
        <Container width="reading">
          <Reveal>
            <VideoEmbed
              title="Hear it from Adam"
              posterNote="90-second home page video: Adam. Poster: still from Shot 1. No autoplay, no music."
              transcript={
                <>
                  <p>
                    If your child has stopped believing they can do it, you already know it does
                    not look the same at every age.
                  </p>
                  <p>
                    At seven, it is tears over a spelling list and a page rubbed through until it
                    tears. At eleven, it is a child who used to put their hand up and now hopes
                    nobody looks at them. At thirteen, it is homework that was never mentioned, a
                    report that says capable but not applying himself, and a door you knock on now
                    instead of walking through. At fifteen, it is revision that never starts and
                    &ldquo;there is no point&rdquo; said in a voice that has stopped arguing with
                    you.
                  </p>
                  <p>
                    Four completely different pictures. One thing underneath all of them: a child
                    who has worked out that trying is the risky option. Because if you try and it
                    goes wrong, that means something about you. If you never really try, it does
                    not.
                  </p>
                  <p>
                    I am Adam. I have spent my career seeing children from angles most people never
                    get to: in classrooms, in nurseries, in children&rsquo;s centres, in family
                    homes as a nanny and a tutor, in charities, and alongside families fighting for
                    the right support. Different rooms, same child, and I have watched what happens
                    to their confidence in every one of them.
                  </p>
                  <p>
                    I work with you, not with your child. Not because your child does not matter,
                    but because you are the one constant in their learning life. You are there
                    before school and after it, in the good weeks and the ones where nothing works.
                  </p>
                  <p>
                    Start with five minutes. The Reflection below will show you where your child is
                    actually getting stuck, whether they are in Year 2 or Year 11. It is free, and
                    your child does not need to know you did it.
                  </p>
                </>
              }
            />
          </Reveal>
        </Container>
      </Section>

      <Section background="cream">
        <Container>
          <Reveal>
            <div className="mx-auto mb-16 max-w-xl sm:mb-20">
              <div className="border-brand-sage-300/70 flex flex-col border-l border-dashed pl-8 sm:pl-10">
                {ageMoments.map((moment, index) => (
                  <div
                    key={moment.age}
                    className={`relative py-6 sm:py-7 ${index !== ageMoments.length - 1 ? "border-border/60 border-b" : ""
                      }`}
                  >
                    <span
                      aria-hidden="true"
                      className="bg-brand-sage-600 ring-brand-cream-100 absolute top-8 -left-[calc(2rem+4px)] size-2 rounded-full ring-4 sm:-left-[calc(2.5rem+4px)]"
                    />
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                      <div className="sm:w-28 sm:shrink-0">
                        <p className="text-brand-sage-700 text-[0.65rem] font-semibold tracking-[0.25em] uppercase">
                          At
                        </p>
                        <p className="font-heading text-brand-navy-900 text-3xl leading-none sm:text-4xl">
                          {moment.age}
                        </p>
                      </div>
                      <p className="text-brand-navy-800 mt-2 leading-relaxed sm:mt-0 sm:text-lg">
                        {moment.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-14 flex flex-col items-center gap-6 text-center sm:mt-16">
                <span
                  aria-hidden="true"
                  className="font-heading text-brand-gold-500 text-6xl leading-none"
                >
                  &ldquo;
                </span>
                <p className="font-heading text-brand-navy-900 max-w-lg text-2xl leading-snug sm:text-3xl">
                  Four different pictures. The same thing underneath:{" "}
                  <em className="italic">
                    a child who has decided that trying is the risky option.
                  </em>
                </p>
                <span aria-hidden="true" className="bg-brand-gold-500/50 h-px w-16" />
                <p className="text-brand-navy-800 max-w-md leading-relaxed">
                  We help parents of 6 to 16 year olds rebuild that. Not through tutoring. Not
                  through more pressure. Through you, because you are the one constant in your
                  child&rsquo;s learning life.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
            {ageBandBlocks.map((block, index) => {
              const { hook, rest } = splitHook(block.body);
              const accent = cardAccents[index % cardAccents.length];
              const numeral = String(index + 1).padStart(2, "0");

              return (
                <Reveal
                  key={block.band}
                  delay={index * 0.07}
                  distance={20}
                  className={index % 2 === 1 ? "h-full lg:mt-10" : "h-full"}
                >
                  <div className="group border-border/60 bg-surface relative isolate flex h-full flex-col overflow-hidden rounded-2xl border p-6 shadow-[var(--shadow-elevation-1)] transition-all duration-300 ease-out motion-safe:hover:-translate-y-1.5 motion-safe:hover:shadow-[var(--shadow-elevation-2)] sm:p-8">
                    {/* Faded editorial numeral — per-card identity motif */}
                    <span
                      aria-hidden="true"
                      className={`font-heading pointer-events-none absolute -top-3 right-4 z-0 text-[5.5rem] leading-none select-none sm:-top-4 sm:right-5 sm:text-[7rem] ${accent.numeral}`}
                    >
                      {numeral}
                    </span>

                    <div className="relative z-10 overflow-hidden rounded-xl">
                      <EditorialImage
                        shotNote={`Environmental image signalling ${block.band}`}
                        src={block.image}
                        alt={block.alt}
                        className="rounded-xl [&_img]:transition-transform [&_img]:duration-500 [&_img]:ease-out motion-safe:group-hover:[&_img]:scale-[1.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="from-brand-navy-950/35 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
                      />
                      <span className="bg-brand-cream-100/95 text-brand-navy-900 absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase shadow-[var(--shadow-elevation-1)] backdrop-blur-sm">
                        <span aria-hidden="true" className={`size-1.5 rounded-full ${accent.dot}`} />
                        {block.ages}
                      </span>
                    </div>

                    <div className="relative z-10 mt-5 flex flex-1 flex-col gap-3">
                      <span aria-hidden="true" className={`h-[3px] w-8 rounded-full ${accent.bar}`} />
                      <h3 className="font-heading text-xl sm:text-2xl">{block.band}</h3>
                      <p className="text-lg leading-snug font-semibold text-balance">{hook}</p>
                      {rest && (
                        <p className="text-muted-foreground text-sm leading-relaxed sm:text-base">
                          {rest}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal>
            <p className="mx-auto mt-24 max-w-2xl text-center text-lg font-medium">
              Four ages, one pattern. That is why one method works across all of it.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section background="white">
        <Container width="reading">
          <Reveal distance={20}>
            <div className="border-border/60 bg-surface-sage relative flex flex-col items-center gap-6 overflow-hidden rounded-[28px] border px-6 py-14 text-center shadow-[var(--shadow-elevation-2)] sm:px-14 sm:py-20">
              <div
                aria-hidden="true"
                className="from-brand-gold-300/40 pointer-events-none absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full bg-gradient-to-b to-transparent blur-3xl"
              />
              <span aria-hidden="true" className="bg-brand-gold-500 relative h-1 w-14 rounded-full" />
              <h2 className="font-heading relative text-3xl sm:text-4xl">
                Take the 5-Minute Parent Reflection
              </h2>
              <PrimaryCTA
                href={PUBLIC_ROUTES.reflection}
                size="lg"
                arrow
                className="relative w-full sm:w-auto"
              >
                Take the 5-Minute Parent Reflection
              </PrimaryCTA>
              <p className="text-muted-foreground relative text-sm">
                Free, five minutes, and your child does not need to know you did it.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="navy">
        <Container width="wide">
          <Reveal distance={20}>
            <Parallax range={16}>
              <EditorialImage
                shotNote="Shot 7: Adam and Michela together, in conversation, not looking at camera"
                src="/assets/Homepage bottom.jpg"
                alt="Adam and Michela in conversation"
                className="border-brand-sage-600/30 bg-brand-navy-800 text-brand-sage-200 shadow-[var(--shadow-elevation-3)] mx-auto max-w-3xl"
              />
            </Parallax>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
