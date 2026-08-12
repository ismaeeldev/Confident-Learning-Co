import { Play } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorialImage } from "./EditorialImage";

interface VideoEmbedProps {
  /** Accessible label for the heading preceding this video (e.g. "Hear it from Adam"). */
  title: string;
  posterNote: string;
  transcript: React.ReactNode;
}

/**
 * Video placement with poster placeholder and an accessible transcript.
 * No autoplay, per docs/03-ThemeGuideline.md 3.12. Swap the poster
 * placeholder for a real `next/image`/video element once footage lands.
 */
export function VideoEmbed({ title, posterNote, transcript }: VideoEmbedProps) {
  return (
    <div className="border-border/70 bg-surface group/video flex flex-col gap-5 rounded-[28px] border p-3 shadow-[var(--shadow-elevation-2)] transition-shadow duration-300 sm:p-5">
      <h2 className="font-heading sr-only">{title}</h2>
      <div className="relative isolate overflow-hidden rounded-[20px]">
        <EditorialImage
          shotNote={posterNote}
          aspect="banner"
          className="rounded-[20px] [&_img]:transition-transform [&_img]:duration-700 [&_img]:ease-out motion-safe:group-hover/video:[&_img]:scale-[1.03]"
        />
        <div
          aria-hidden="true"
          className="from-brand-navy-950/35 pointer-events-none absolute inset-0 bg-gradient-to-t via-transparent to-transparent"
        />
        <div
          aria-hidden="true"
          className="border-brand-cream-100/70 bg-brand-cream-100/95 text-brand-navy-900 pointer-events-none absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full border shadow-[var(--shadow-elevation-2)] backdrop-blur-sm transition-all duration-300 ease-out motion-safe:group-hover/video:scale-110 motion-safe:group-hover/video:shadow-[var(--shadow-gold-glow)] sm:size-20"
        >
          <Play className="ml-1 size-6 fill-current sm:size-7" aria-hidden="true" />
        </div>
      </div>
      <p className="text-brand-navy-800 px-2 text-sm font-medium">{title}</p>
      <Accordion type="single" collapsible>
        <AccordionItem value="transcript" className="border-none">
          <AccordionTrigger className="text-brand-sage-800 px-2">
            Read the video transcript
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-2 text-base leading-relaxed">
            {transcript}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
