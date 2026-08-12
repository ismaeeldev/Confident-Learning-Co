export interface TocHeading {
  id: string;
  text: string;
}

/**
 * Mirrors github-slugger's default behaviour (used by rehype-slug on the
 * rendered MDX) closely enough for this site's plain-English headings:
 * lowercase, spaces become hyphens, anything outside [a-z0-9-_] is dropped.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s/g, "-")
    .replace(/[^a-z0-9-_]/g, "");
}

/** Pulls H2 headings out of raw MDX body text to build an in-article table of contents. */
export function extractHeadings(source: string): TocHeading[] {
  const matches = source.matchAll(/^##\s+(.+?)\s*$/gm);
  const seen = new Map<string, number>();

  return Array.from(matches, (match) => {
    const text = match[1].trim();
    let id = slugify(text);
    const count = seen.get(id) ?? 0;
    seen.set(id, count + 1);
    if (count > 0) id = `${id}-${count}`;
    return { id, text };
  });
}
