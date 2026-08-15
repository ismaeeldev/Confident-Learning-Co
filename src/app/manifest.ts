import type { MetadataRoute } from "next";
import { brand } from "@/config/brand";

/**
 * Web App Manifest (Next.js 16 file convention). Next auto-serves this at
 * /manifest.webmanifest and auto-injects the <link rel="manifest"> tag, so
 * no manual link tag is needed in layout.tsx.
 *
 * Colours are the actual brand tokens from docs/03-ThemeGuideline.md 3.3,
 * not arbitrary choices: cream-100 background, navy-950 theme colour.
 *
 * No `orientation` is set — this is a normal responsive marketing site,
 * not an orientation-locked app.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: brand.name,
    // Full brand name is 27 characters, longer than most home-screen
    // launchers comfortably show before truncating — this shortened label
    // is only used for the installed icon caption, the full name is used
    // everywhere else on the site untouched.
    short_name: "Confident Learning",
    description:
      "Parent education and coaching for rebuilding a child's confidence in learning, ages 6 to 16.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#fffdf8", // --brand-cream-100
    theme_color: "#142038", // --brand-navy-950
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
