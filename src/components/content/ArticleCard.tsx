import Link from "next/link";
import { EditorialImage } from "./EditorialImage";
import { AgeBandBadge } from "./AgeBandBadge";
import type { ChildBand } from "@/config/canon";

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
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="group border-border bg-surface focus-visible:ring-focus-ring flex h-full flex-col gap-4 rounded-2xl border p-4 outline-none transition-transform duration-200 ease-out hover:-translate-y-1 focus-visible:ring-3 sm:p-5"
    >
      <div className="overflow-hidden rounded-2xl">
        <div className="transition-transform duration-300 ease-out group-hover:scale-[1.025]">
          <EditorialImage shotNote={article.imageShotNote} src={article.image} alt={article.imageShotNote} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <AgeBandBadge band={article.ageBand} />
        <h3 className="font-heading text-xl leading-snug group-hover:underline sm:text-2xl">
          {article.title}
        </h3>
        <p className="text-muted-foreground line-clamp-3 leading-relaxed">{article.excerpt}</p>
        <p className="text-muted-foreground mt-auto pt-1 text-sm">
          {article.author} · {article.authorRole} · {article.readingTimeMinutes} min read
        </p>
      </div>
    </Link>
  );
}
