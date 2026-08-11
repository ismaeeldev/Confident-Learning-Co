import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { brand } from "@/config/brand";
import { CHILD_BAND_LABELS } from "@/config/canon";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#fffdf8",
          color: "#1f2e4d",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#4f6f54" }}>{brand.name}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {article && (
            <div style={{ display: "flex", fontSize: 24, color: "#9f813e" }}>
              {CHILD_BAND_LABELS[article.ageBand]}
            </div>
          )}
          <div style={{ display: "flex", fontSize: 56, lineHeight: 1.15 }}>
            {article?.title ?? "Learning Confidence, Answered"}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
