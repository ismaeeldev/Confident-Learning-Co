import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { VideoEmbed } from "@/components/content/VideoEmbed";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { Eyebrow } from "@/components/content/Eyebrow";
import { PUBLIC_ROUTES, CHILD_BAND_LABELS } from "@/config/canon";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Bright child. Crumbling confidence. It does not look the same at seven as it does at fifteen, and you are not imagining either one.",
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

export default function HomePage() {
  return (
    <>
      <Section background="cream" className="pt-12 sm:pt-16 lg:pt-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <EditorialImage shotNote="Shot 2: Adam, three-quarter, mid-talk, space to one side for headline text" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-6">
                <h1 className="font-heading text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                  Bright child. Crumbling confidence.
                </h1>
                <p className="text-brand-navy-800 text-lg leading-relaxed sm:text-xl">
                  It does not look the same at seven as it does at fifteen, and you are not
                  imagining either one.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container width="reading">
          <Reveal>
            <VideoEmbed
              title="Hear it from Adam"
              posterNote="90-second home page video — Adam. Poster: still from Shot 1. No autoplay, no music."
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
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-lg leading-relaxed sm:text-xl">
                At seven, it is tears over spellings and a page rubbed through until it tears. At
                eleven, it is a child who used to put their hand up and now hopes nobody looks at
                them. At thirteen, it is homework that was never mentioned and a door you knock on
                now instead of walking through. At fifteen, it is revision that never starts and
                &ldquo;there is no point&rdquo; said in a voice that has stopped arguing.
              </p>
              <p className="mt-4 text-lg leading-relaxed font-medium sm:text-xl">
                Four different pictures. The same thing underneath: a child who has decided that
                trying is the risky option.
              </p>
              <p className="text-brand-navy-800 mt-4 leading-relaxed">
                We help parents of 6 to 16 year olds rebuild that. Not through tutoring. Not
                through more pressure. Through you, because you are the one constant in your
                child&rsquo;s learning life.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {ageBandBlocks.map((block, index) => (
              <Reveal key={block.band} delay={index * 0.06}>
                <div className="border-border bg-surface flex flex-col gap-4 rounded-2xl border p-6 sm:p-8">
                  <EditorialImage
                    shotNote={`Environmental image signalling ${block.band}`}
                    src={block.image}
                    alt={block.alt}
                  />
                  <div>
                    <Eyebrow>
                      {block.band}, {block.ages}
                    </Eyebrow>
                    <p className="text-brand-navy-800 mt-2 leading-relaxed">{block.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p className="mx-auto mt-12 max-w-2xl text-center text-lg font-medium">
              Four ages, one pattern. That is why one method works across all of it.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section background="white">
        <Container width="reading" className="text-center">
          <Reveal>
            <div className="flex flex-col items-center gap-6">
              <h2 className="font-heading text-3xl sm:text-4xl">
                Take the 5-Minute Parent Reflection
              </h2>
              <PrimaryCTA href={PUBLIC_ROUTES.reflection} size="lg">
                Take the 5-Minute Parent Reflection
              </PrimaryCTA>
              <p className="text-muted-foreground text-sm">
                Free, five minutes, and your child does not need to know you did it.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="navy">
        <Container>
          <Reveal>
            <EditorialImage
              shotNote="Shot 7: Adam and Michela together, in conversation, not looking at camera"
              className="border-brand-sage-600/40 bg-brand-navy-800 text-brand-sage-200"
            />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
