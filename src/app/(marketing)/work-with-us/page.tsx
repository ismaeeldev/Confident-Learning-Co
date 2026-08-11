import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImage } from "@/components/content/EditorialImage";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { PendingCheckoutButton } from "@/components/content/PendingCheckoutButton";
import { products, formatMinorAsGbp } from "@/config/products";

export const metadata: Metadata = {
  title: "Work With Us Closely",
  description: "Some families want to walk the method with us directly.",
};

export default function WorkWithUsPage() {
  return (
    <>
      <Section background="cream" className="pt-12 sm:pt-16">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <EditorialImage shotNote="Shot 8: the two of you, standing, to camera" />
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4">
                <h1 className="font-heading text-4xl sm:text-5xl">
                  When you want more than the membership
                </h1>
                <p className="text-brand-navy-800 text-lg leading-relaxed">
                  Some families want to walk the method with us directly. Two ways to do that.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="white">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="flex flex-col gap-4">
                <FounderPortrait founder="Michela" shotNote="seated" />
                <h2 className="font-heading text-2xl">
                  The Group Programme. Founders price {formatMinorAsGbp(products.group.founderPriceMinor!)}.
                </h2>
                <p className="leading-relaxed">
                  A small cohort of parents, led live by Adam and Michela together, working the
                  method over a set number of weeks. Cohorts run across the full 6 to 16 range and
                  the sessions are structured so both ends are served properly rather than one
                  being an afterthought.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="flex flex-col gap-4">
                <FounderPortrait founder="Adam" shotNote="seated" />
                <h2 className="font-heading text-2xl">
                  The 1:1 Resets. Founders price{" "}
                  {formatMinorAsGbp(products.confidence_reset.founderPriceMinor!)} each.
                </h2>
                <p className="leading-relaxed">
                  Private, focused work with one family at a time. The Confidence Reset rebuilds
                  a child&rsquo;s confidence in learning through you. The Calm Reset is its
                  settle-side partner, for the child who cannot yet get steady enough for the
                  confidence work to land.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section background="sage" className="text-center">
        <Container width="reading">
          <Reveal>
            <div className="flex flex-col items-center gap-4">
              <EditorialImage
                shotNote="Two mugs on a table — represents a conversation without staging one"
                src="/images/two-mugs-table.jpg"
                alt="Two mugs sitting together on a wooden table with steam gently rising"
              />
              <h2 className="font-heading text-2xl sm:text-3xl">How access works</h2>
              <p className="leading-relaxed">
                Both routes begin with a Pathway call: 30 minutes with Jane, our Pathway
                Coordinator, to make sure the fit is right before any money changes hands on a
                programme. If we are not the right support for your family, Jane will say so
                plainly and point you toward who is. We would rather lose a sale than waste your
                year. The Pathway call is available to Inside the Loop members.
              </p>
              <PendingCheckoutButton
                label={`Book a Pathway Call, ${formatMinorAsGbp(products.pathway.founderPriceMinor!)}`}
                size="lg"
              />
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
