import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { EditorialImage } from "./EditorialImage";

interface VideoEmbedProps {
  /** Accessible label for the hidden heading preceding this video (e.g. "Hear it from Adam"). */
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
    <div className="flex flex-col gap-4">
      <h2 className="font-heading sr-only">{title}</h2>
      <EditorialImage shotNote={posterNote} aspect="banner" />
      <Accordion type="single" collapsible>
        <AccordionItem value="transcript">
          <AccordionTrigger className="text-brand-sage-800">
            Read the video transcript
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-base leading-relaxed">
            {transcript}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
