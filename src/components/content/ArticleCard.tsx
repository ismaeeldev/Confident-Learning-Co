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
      className="group border-border bg-surface focus-visible:ring-focus-ring flex flex-col gap-4 rounded-2xl border p-4 outline-none focus-visible:ring-3"
    >
      <EditorialImage shotNote={article.imageShotNote} src={article.image} alt={article.imageShotNote} />
      <AgeBandBadge band={article.ageBand} />
      <h3 className="font-heading text-xl group-hover:underline">{article.title}</h3>
      <p className="text-muted-foreground line-clamp-3">{article.excerpt}</p>
      <p className="text-muted-foreground text-sm">
        {article.author} · {article.authorRole} · {article.readingTimeMinutes} min read
      </p>
    </Link>
  );
}
