interface QuoteBlockProps {
  children: React.ReactNode;
  attribution: string;
  role: string;
}

/** Founder testimonial/quote block with attribution. */
export function QuoteBlock({ children, attribution, role }: QuoteBlockProps) {
  return (
    <figure className="flex flex-col gap-4">
      <blockquote className="flex flex-col gap-4 leading-relaxed italic">{children}</blockquote>
      <figcaption className="not-italic">
        <span className="font-semibold">{attribution}</span>
        <br />
        <span className="text-brand-sage-800 text-sm">{role}</span>
      </figcaption>
    </figure>
  );
}
