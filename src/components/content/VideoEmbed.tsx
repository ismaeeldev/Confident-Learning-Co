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
    <div className="border-border bg-surface flex flex-col gap-5 rounded-2xl border p-3 shadow-sm sm:p-4">
      <h2 className="font-heading sr-only">{title}</h2>
      <div className="relative">
        <EditorialImage shotNote={posterNote} aspect="banner" className="rounded-xl" />
        <div
          aria-hidden="true"
          className="border-brand-navy-900/10 bg-brand-cream-100/90 pointer-events-none absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full border shadow-md backdrop-blur-sm sm:size-20"
        >
          <Play className="text-brand-navy-900 ml-1 size-6 fill-current sm:size-7" />
        </div>
      </div>
      <p className="text-brand-navy-800 px-1 text-sm font-medium">{title}</p>
      <Accordion type="single" collapsible>
        <AccordionItem value="transcript" className="border-none">
          <AccordionTrigger className="text-brand-sage-800 px-1">
            Read the video transcript
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-1 text-base leading-relaxed">
            {transcript}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
