import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/motion/Reveal";
import { Eyebrow } from "@/components/content/Eyebrow";
import { Heading } from "@/components/content/Heading";
import { RichText } from "@/components/content/RichText";
import { FounderPortrait } from "@/components/content/FounderPortrait";
import { EditorialImage } from "@/components/content/EditorialImage";
import { VideoEmbed } from "@/components/content/VideoEmbed";
import { PrimaryCTA } from "@/components/content/PrimaryCTA";
import { QuietCallout } from "@/components/content/QuietCallout";
import { ScopeNotice } from "@/components/content/ScopeNotice";
import { AgeBandBadge } from "@/components/content/AgeBandBadge";
import { ArticleCard } from "@/components/content/ArticleCard";
import { QuoteBlock } from "@/components/content/QuoteBlock";
import { Breadcrumbs } from "@/components/content/Breadcrumbs";
import { ImagePlaceholder } from "@/components/content/ImagePlaceholder";
import { PendingCheckoutButton } from "@/components/content/PendingCheckoutButton";
import { ToastDemoButton } from "@/components/content/ToastDemoButton";
import { CHILD_BANDS, PUBLIC_ROUTES } from "@/config/canon";

export const metadata: Metadata = {
  title: "Design System (dev only)",
  robots: { index: false, follow: false },
};

function Swatch({ name, className }: { name: string; className: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-16 rounded-xl border border-black/5 ${className}`} />
      <p className="text-muted-foreground text-xs">{name}</p>
    </div>
  );
}

function GallerySection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-border flex flex-col gap-6 border-b pb-12">
      <h2 className="font-heading text-2xl">{title}</h2>
      {children}
    </section>
  );
}

/** Development-only component gallery. Never linked from production nav; noindex above. */
export default function DesignSystemPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <Section background="cream">
          <Container>
            <div className="flex flex-col gap-16">
              <div>
                <h1 className="font-heading text-4xl">Design System</h1>
                <p className="text-muted-foreground mt-2">
                  Development-only QA gallery. Not linked from production navigation.
                </p>
              </div>

              <GallerySection title="Colour tokens">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                  <Swatch name="navy-900" className="bg-brand-navy-900" />
                  <Swatch name="sage-600" className="bg-brand-sage-600" />
                  <Swatch name="sage-800" className="bg-brand-sage-800" />
                  <Swatch name="gold-500" className="bg-brand-gold-500" />
                  <Swatch name="cream-100" className="bg-brand-cream-100" />
                  <Swatch name="cream-200" className="bg-brand-cream-200" />
                </div>
              </GallerySection>

              <GallerySection title="Typography">
                <div className="flex flex-col gap-3">
                  <Heading level={1}>Heading level 1</Heading>
                  <Heading level={2}>Heading level 2</Heading>
                  <Heading level={3}>Heading level 3</Heading>
                  <Heading level={4}>Heading level 4</Heading>
                  <Eyebrow>Eyebrow label</Eyebrow>
                  <RichText>
                    <p>
                      Body copy at reading width, 1.6–1.75 line height, set in Inter with
                      Newsreader reserved for headings.
                    </p>
                  </RichText>
                </div>
              </GallerySection>

              <GallerySection title="Buttons — all variants, sizes, and states">
                <div className="flex flex-wrap items-center gap-3">
                  <Button>Default</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default size</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button disabled>Disabled</Button>
                  <PendingCheckoutButton label="Pending / explained-disabled state" />
                  <Button className="w-40 justify-center">
                    <span className="border-brand-navy-950 size-4 animate-spin rounded-full border-2 border-t-transparent" />
                    Loading
                  </Button>
                </div>
              </GallerySection>

              <GallerySection title="Badges and age bands">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {CHILD_BANDS.map((band) => (
                    <AgeBandBadge key={band} band={band} />
                  ))}
                </div>
              </GallerySection>

              <GallerySection title="Card">
                <Card className="max-w-sm">
                  <CardHeader>
                    <CardTitle>Card title</CardTitle>
                    <CardDescription>Supporting description text.</CardDescription>
                  </CardHeader>
                  <CardContent>Card body content.</CardContent>
                </Card>
              </GallerySection>

              <GallerySection title="Accordion">
                <Accordion type="single" collapsible className="max-w-lg">
                  <AccordionItem value="a">
                    <AccordionTrigger>Closed state</AccordionTrigger>
                    <AccordionContent>Revealed content.</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </GallerySection>

              <GallerySection title="Dialog and Sheet (mobile nav shown in header above)">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Open dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Dialog title</DialogTitle>
                      <DialogDescription>Dialog description text.</DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </GallerySection>

              <GallerySection title="Form controls">
                <div className="flex max-w-sm flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ds-input">Input — default</Label>
                    <Input id="ds-input" placeholder="Placeholder text" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="ds-input-error">Input — error</Label>
                    <Input id="ds-input-error" aria-invalid defaultValue="Invalid value" />
                    <p className="text-destructive text-sm">This field has an error.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="ds-consent" />
                    <Label htmlFor="ds-consent">
                      Marketing consent (unticked by default, per policy)
                    </Label>
                  </div>
                  <Select>
                    <SelectTrigger aria-label="School year band">
                      <SelectValue placeholder="Select a school year band" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHILD_BANDS.map((band) => (
                        <SelectItem key={band} value={band}>
                          {band}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </GallerySection>

              <GallerySection title="Tabs">
                <Tabs defaultValue="one" className="max-w-md">
                  <TabsList>
                    <TabsTrigger value="one">One</TabsTrigger>
                    <TabsTrigger value="two">Two</TabsTrigger>
                  </TabsList>
                  <TabsContent value="one">Tab one content.</TabsContent>
                  <TabsContent value="two">Tab two content.</TabsContent>
                </Tabs>
              </GallerySection>

              <GallerySection title="Skeleton (loading state)">
                <div className="flex max-w-sm flex-col gap-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </GallerySection>

              <GallerySection title="Alert — success and error states">
                <div className="flex max-w-lg flex-col gap-4">
                  <Alert>
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your submission was received.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>Something went wrong. Please try again.</AlertDescription>
                  </Alert>
                </div>
              </GallerySection>

              <GallerySection title="Tooltip and Toast">
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">Hover for tooltip</Button>
                    </TooltipTrigger>
                    <TooltipContent>Tooltip content</TooltipContent>
                  </Tooltip>
                  <ToastDemoButton />
                </div>
              </GallerySection>

              <GallerySection title="Content primitives">
                <div className="grid gap-8 sm:grid-cols-2">
                  <FounderPortrait founder="Adam" shotNote="head and shoulders, direct to camera" />
                  <EditorialImage shotNote="Empty desk by a window, natural light" />
                </div>
                <div className="flex items-center gap-3">
                  <FounderPortrait founder="Adam" shotNote="byline portrait" aspect="square" compact className="size-12 shrink-0" />
                  <p className="text-muted-foreground text-sm">Compact avatar variant (e.g. article bylines)</p>
                </div>
                <VideoEmbed
                  title="Sample video"
                  posterNote="Poster placeholder"
                  transcript={<p>Sample transcript paragraph for accessibility.</p>}
                />
                <div className="grid gap-6 sm:grid-cols-2">
                  <QuietCallout tone="sage">Quiet sage callout — reassurance or scope note.</QuietCallout>
                  <QuietCallout tone="gold">Quiet gold callout — quiet emphasis only.</QuietCallout>
                </div>
                <ScopeNotice />
                <QuoteBlock attribution="Michela" role="Learning Confidence Specialist">
                  <p>Sample quote block content.</p>
                </QuoteBlock>
                <Breadcrumbs
                  items={[
                    { label: "Articles", href: PUBLIC_ROUTES.articles },
                    { label: "Sample article" },
                  ]}
                />
                <ArticleCard
                  article={{
                    slug: "sample-article",
                    title: "Sample article title",
                    excerpt: "Sample excerpt text for the article card component.",
                    author: "Adam",
                    authorRole: "Founder and Learning Confidence Specialist",
                    ageBand: "early",
                    readingTimeMinutes: 4,
                    imageShotNote: "Sample environmental image",
                  }}
                />
                <ImagePlaceholder label="Generic image placeholder (empty state)" />
                <PrimaryCTA href={PUBLIC_ROUTES.reflection}>Primary CTA example</PrimaryCTA>
              </GallerySection>

              <GallerySection title="Motion — reveal on mount, reduced-motion safe">
                <Reveal>
                  <div className="bg-surface-sage rounded-2xl p-6">
                    This block fades and lifts 16px on mount, and renders statically when
                    prefers-reduced-motion is set.
                  </div>
                </Reveal>
              </GallerySection>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
