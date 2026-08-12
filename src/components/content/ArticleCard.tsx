import Link from "next/link";
import { EditorialImage } from "./EditorialImage";
import { CHILD_BAND_LABELS, type ChildBand } from "@/config/canon";

export interface ArticleCardData {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  authorRole: string;
  ageBand: ChildBand;
  readingTimeMinutes: number;
  imageShotNote: string;
  /** Real image path, once available. Falls back to a labeled placeholder. */
  image?: string;
}

/** Article listing card. */
export function ArticleCard({ article }: { article: ArticleCardData }) {
  const config = {
    early: { dot: "bg-brand-gold-500" },
    middle: { dot: "bg-brand-sage-600" },
    "lower-secondary": { dot: "bg-brand-navy-700" },
    "exam-years": { dot: "bg-brand-gold-700" },
  }[article.ageBand] || { dot: "bg-brand-gold-500" };

  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group border border-brand-cream-300/60 bg-white/80 backdrop-blur-sm focus-visible:ring-focus-ring flex h-full flex-col gap-5 rounded-[24px] p-5 outline-none transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-elevation-2)] focus-visible:ring-3 shadow-[var(--shadow-elevation-1)]"
    >
      <div className="relative overflow-hidden rounded-[18px] aspect-[16/10] bg-brand-cream-100">
        <div className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03]">
          <EditorialImage shotNote={article.imageShotNote} src={article.image} alt={article.imageShotNote} className="w-full h-full object-cover" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-navy-950/20 via-transparent to-transparent pointer-events-none" />
        
        {/* Age band label overlay */}
        <span className="absolute top-3 left-3 bg-white/95 text-brand-navy-900 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide uppercase shadow-sm backdrop-blur-sm">
          <span aria-hidden="true" className={`size-1.5 rounded-full ${config.dot}`} />
          {CHILD_BAND_LABELS[article.ageBand]}
        </span>
      </div>
      
      <div className="flex flex-1 flex-col gap-3 px-1">
        <h3 className="font-heading text-xl sm:text-2.5xl text-brand-navy-950 leading-snug group-hover:text-brand-gold-700 transition-colors duration-200">
          {article.title}
        </h3>
        <p className="text-brand-navy-800/80 line-clamp-3 leading-relaxed text-sm sm:text-[0.95rem]">{article.excerpt}</p>
        
        <div className="mt-auto pt-4 border-t border-brand-cream-300/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className="font-medium text-brand-navy-900/90">{article.author} · <span className="text-xs font-normal text-muted-foreground">{article.authorRole}</span></span>
          <span className="shrink-0">{article.readingTimeMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}
