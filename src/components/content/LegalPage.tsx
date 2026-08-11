import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { LegalDraftNotice } from "./LegalDraftNotice";

interface LegalPageProps {
  title: string;
  updatedAt: string;
  children: React.ReactNode;
}

export function LegalPage({ title, updatedAt, children }: LegalPageProps) {
  return (
    <Section background="cream" className="pt-12 pb-20 sm:pt-16">
      <Container width="reading">
        <h1 className="font-heading text-3xl sm:text-4xl">{title}</h1>
        <p className="text-muted-foreground mt-2 mb-8 text-sm">Last updated: {updatedAt}</p>
        <LegalDraftNotice />
        <div className="flex flex-col gap-5 leading-relaxed [&_h2]:font-heading [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:first:mt-0 [&_li]:ml-5 [&_li]:list-disc [&_a]:text-brand-sage-800 [&_a]:underline [&_a]:underline-offset-4">
          {children}
        </div>
      </Container>
    </Section>
  );
}
