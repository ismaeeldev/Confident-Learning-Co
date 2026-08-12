import type { Metadata } from "next";
import { CalendarClock, CheckCircle2, Compass, HeartHandshake, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { PendingCheckoutButton } from "@/components/content/PendingCheckoutButton";
import { Eyebrow } from "@/components/content/Eyebrow";
import { ResetEnquiryForm } from "@/components/content/ResetEnquiryForm";
import { products, formatMinorAsGbp } from "@/config/products";

export const metadata: Metadata = {
  title: "Work With Us Closely",
  description: "Some families want to walk the method with us directly.",
};

const offers = [
  {
    key: "group" as const,
    founder: "Michela" as const,
    shotNote: "seated",
    label: "Live, led by Adam and Michela together",
    name: "The Group Programme",
    price: formatMinorAsGbp(products.group.founderPriceMinor!),
    priceNote: null as string | null,
    intro:
      "A small cohort of parents, led live by Adam and Michela together, working the method over a set number of weeks. Cohorts run across the full 6 to 16 range and the sessions are structured so both ends are served properly rather than one being an afterthought.",
    inclusions: [
      "Led live by Adam and Michela, together",
      "A small cohort, over a set number of weeks",
      "Covers the full 6 to 16 range — both ends served properly",
    ],
  },
  {
    key: "resets" as const,
    founder: "Adam" as const,
    shotNote: "seated",
    label: "Private, one family at a time",
    name: "The 1:1 Resets",
    price: formatMinorAsGbp(products.confidence_reset.founderPriceMinor!),
    priceNote: "each",
    intro:
      "Private, focused work with one family at a time. The Confidence Reset rebuilds a child’s confidence in learning through you. The Calm Reset is its settle-side partner, for the child who cannot yet get steady enough for the confidence work to land.",
    inclusions: [
      "Private, focused work with one family at a time",
      "The Confidence Reset — rebuilds a child’s confidence in learning",
      "The Calm Reset — for the child who isn’t yet steady enough",
    ],
  },
];

const pathwaySteps = [
  {
    icon: CalendarClock,
    label: "Pathway Call",
    body: "30 minutes with Jane, our Pathway Coordinator.",
  },
  {
    icon: HeartHandshake,
    label: "Fit Assessment",
    body: "Jane listens properly, then tells you honestly whether it’s the right fit.",
  },
  {
    icon: Compass,
    label: "Next Step",
    body: "The right path forward with us — or a plain, honest steer toward who is.",
  },
] as const;

export default function WorkWithUsPage() {
  return (
    <>
      <Section background="cream" className="pt-12 sm:pt-16">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal delay={0.04} className="order-2 lg:order-1">
              <EditorialImage
                shotNote="Shot 8: the two of you, standing, to camera"
                className="shadow-sm"
              />
            </Reveal>
            <Reveal className="order-1 lg:order-2">
              <div className="flex flex-col gap-4">
                <h1 className="font-heading text-[clamp(2.25rem,4vw+1.25rem,3.5rem)] leading-[1.05] text-balance">
                  When you want more than the membership
                </h1>
                <p className="text-brand-navy-800 max-w-prose text-lg leading-relaxed">
                  Some families want to walk the method with us directly. Two ways to do that.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
            {offers.map((offer, index) => (
              <Reveal key={offer.key} delay={index * 0.06} className="h-full">
                <div className="group border-border bg-surface flex h-full flex-col gap-5 rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:p-8">
                  <FounderPortrait
                    founder={offer.founder}
                    shotNote={offer.shotNote}
                    aspect="square"
                    className="[&_img]:transition-transform [&_img]:duration-200 [&_img]:ease-out group-hover:[&_img]:scale-[1.02]"
                  />

                  <div className="flex flex-col gap-1">
                    <Eyebrow>{offer.label}</Eyebrow>
                    <h2 className="font-heading text-2xl">{offer.name}</h2>
                  </div>

                  <div className="border-border/70 flex flex-col gap-0.5 border-b pb-5">
                    <span className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                      Founders price
                    </span>
                    <p className="flex items-baseline gap-1.5">
                      <span className="font-heading text-brand-navy-900 text-3xl sm:text-4xl">
                        {offer.price}
                      </span>
                      {offer.priceNote && (
                        <span className="text-muted-foreground text-sm">{offer.priceNote}</span>
                      )}
                    </p>
                  </div>

                  <p className="text-brand-navy-800 text-sm leading-relaxed">{offer.intro}</p>

                  <ul className="flex flex-col gap-2.5">
                    {offer.inclusions.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle2
                          className="text-brand-sage-700 mt-0.5 size-4 shrink-0"
                          aria-hidden="true"
                        />
                        <span className="text-brand-navy-800">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#how-access-works"
                    className="text-brand-sage-800 hover:text-brand-navy-900 mt-auto inline-flex w-fit items-center gap-1 pt-1 text-sm font-semibold underline decoration-transparent underline-offset-4 transition-colors duration-200 hover:decoration-current"
                  >
                    See how access works
                    <ArrowRight
                      className="size-3.5 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="sage" className="text-center">
        <Container width="reading">
          <div id="how-access-works" className="scroll-mt-20" />
          <Reveal>
            <div className="flex flex-col items-center gap-4">
              <EditorialImage
                shotNote="Two mugs on a table — represents a conversation without staging one"
                src="/images/two-mugs-table.jpg"
                alt="Two mugs sitting together on a wooden table with steam gently rising"
                aspect="square"
                className="w-full max-w-xs shadow-sm"
              />
              <h2 className="font-heading text-2xl sm:text-3xl">How access works</h2>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-6 text-left sm:mt-12 sm:grid-cols-3 sm:gap-5">
            {pathwaySteps.map((step, index) => (
              <Reveal key={step.label} delay={0.05 + index * 0.06} className="h-full">
                <div className="border-border/70 bg-surface relative flex h-full flex-col gap-2 rounded-2xl border p-5 shadow-sm">
                  <span className="text-brand-sage-700 font-heading text-sm">
                    {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <step.icon className="text-brand-sage-700 size-5 shrink-0" aria-hidden="true" />
                    <h3 className="font-heading text-base leading-snug">{step.label}</h3>
                  </div>
                  <p className="text-brand-navy-800 text-sm leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container width="reading">
          <div className="grid items-center gap-8 sm:grid-cols-[auto_1fr] sm:gap-10">
            <Reveal>
              <FounderPortrait
                founder="Jane"
                shotNote="portrait"
                compact
                className="mx-auto size-28 sm:size-32"
              />
            </Reveal>
            <Reveal delay={0.06}>
              <div className="flex flex-col gap-3">
                <p className="leading-relaxed">
                  Both routes begin with a Pathway call: 30 minutes with Jane, our Pathway
                  Coordinator, to make sure the fit is right before any money changes hands on a
                  programme. If we are not the right support for your family, Jane will say so
                  plainly and point you toward who is. We would rather lose a sale than waste your
                  year. The Pathway call is available to Inside the Loop members.
                </p>
                <p className="not-italic">
                  <span className="font-semibold">Jane</span>
                  <br />
                  <span className="text-brand-sage-800 text-sm">
                    Pathway Coordinator, The Confident Learning Co.
                  </span>
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 flex flex-col items-center gap-3 sm:mt-12">
              <PendingCheckoutButton
                label={`Book a Pathway Call, ${formatMinorAsGbp(products.pathway.founderPriceMinor!)}`}
                size="lg"
              />
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section background="cream">
        <Container width="reading">
          <Reveal>
            <ResetEnquiryForm />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
