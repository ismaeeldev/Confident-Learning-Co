import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const mdPath = path.join(root, "content", "parent-guide-draft.md");
const htmlOutPath = path.join(root, "content", "parent-guide-draft.html");
const pdfOutPath = path.join(root, "content", "parent-guide-draft.pdf");

const md = readFileSync(mdPath, "utf8");

/** Minimal, purpose-built markdown -> HTML converter for this document's own subset
 *  (headings, hr, blockquote banner, bold/italic, paragraphs, em-dashes already literal). */
function mdToHtml(source) {
  const lines = source.split("\n");
  const out = [];
  let paragraph = [];
  let inBanner = false;

  function inline(text) {
    return text
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  }

  function flushParagraph() {
    if (paragraph.length) {
      out.push(`<p>${inline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("> ")) {
      flushParagraph();
      out.push(`<div class="draft-banner">${inline(line.slice(2))}</div>`);
      continue;
    }
    if (line === "---") {
      flushParagraph();
      out.push(`<hr />`);
      continue;
    }
    if (line.startsWith("# ")) {
      flushParagraph();
      out.push(`<h1>${inline(line.slice(2))}</h1>`);
      continue;
    }
    if (line.startsWith("## ")) {
      flushParagraph();
      out.push(`<h2>${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      flushParagraph();
      out.push(`<h3>${inline(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      out.push(`<li>${inline(line.slice(2))}</li>`);
      continue;
    }
    if (line === "") {
      flushParagraph();
      continue;
    }
    paragraph.push(line);
  }
  flushParagraph();

  // Wrap consecutive <li> runs in <ul>
  const html = out.join("\n").replace(/(<li>.*?<\/li>\n?)+/gs, (match) => `<ul>\n${match}</ul>\n`);
  return html;
}

const bodyHtml = mdToHtml(md);

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>The Learning Confidence Parent Guide — Draft</title>
<style>
  @page {
    size: A4;
    margin: 26mm 22mm 24mm 22mm;
  }

  :root {
    --brand-navy-950: #142038;
    --brand-navy-900: #1f2e4d;
    --brand-sage-700: #5d7d62;
    --brand-gold-600: #b4944d;
    --brand-gold-500: #c9a961;
    --brand-gold-100: #f8f1dd;
    --brand-cream-100: #fffdf8;
    --brand-cream-300: #f1eadf;
    --neutral-ink: #172033;
    --neutral-muted: #657083;
    --neutral-border: #dcd8cf;
    --neutral-warning: #8a6826;
  }

  * { box-sizing: border-box; }

  html, body {
    margin: 0;
    padding: 0;
    background: var(--brand-cream-100);
    color: var(--neutral-ink);
    font-family: "Georgia", "Newsreader", serif;
    font-size: 11.5pt;
    line-height: 1.65;
  }

  .cover {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    page-break-after: always;
    background: linear-gradient(180deg, var(--brand-navy-950) 0%, var(--brand-navy-900) 100%);
    color: var(--brand-cream-100);
    padding: 0 12mm;
  }

  .cover .eyebrow {
    letter-spacing: 0.28em;
    text-transform: uppercase;
    font-family: "Calibri", "Inter", sans-serif;
    font-size: 9.5pt;
    color: var(--brand-gold-500);
    margin-bottom: 18mm;
  }

  .cover h1 {
    font-family: "Georgia", "Newsreader", serif;
    font-size: 30pt;
    line-height: 1.2;
    margin: 0 0 8mm 0;
    font-weight: 400;
  }

  .cover .subtitle {
    font-family: "Calibri", "Inter", sans-serif;
    font-style: italic;
    font-size: 12pt;
    color: var(--brand-cream-300);
    max-width: 120mm;
  }

  .cover .cover-footer {
    position: absolute;
    bottom: 16mm;
    font-family: "Calibri", "Inter", sans-serif;
    font-size: 9pt;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--brand-gold-500);
  }

  .content {
    padding: 0 2mm;
  }

  .draft-banner {
    font-family: "Calibri", "Inter", sans-serif;
    font-size: 9.5pt;
    line-height: 1.55;
    background: var(--brand-gold-100);
    border: 1px solid var(--brand-gold-600);
    color: var(--neutral-warning);
    padding: 5mm 6mm;
    border-radius: 2mm;
    margin: 0 0 10mm 0;
  }

  h1 {
    font-size: 20pt;
    color: var(--brand-navy-950);
    font-weight: 400;
    border-bottom: 2px solid var(--brand-gold-500);
    padding-bottom: 4mm;
    margin: 0 0 6mm 0;
  }

  h2 {
    font-size: 15pt;
    color: var(--brand-navy-950);
    font-weight: 400;
    margin: 14mm 0 5mm 0;
    page-break-after: avoid;
  }

  h2::before {
    content: "";
    display: block;
    width: 14mm;
    height: 2px;
    background: var(--brand-sage-700);
    margin-bottom: 4mm;
  }

  h3 {
    font-size: 12.5pt;
    color: var(--brand-sage-700);
    font-weight: 700;
    font-family: "Calibri", "Inter", sans-serif;
    margin: 9mm 0 3mm 0;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 4mm 0;
    orphans: 3;
    widows: 3;
  }

  hr {
    border: none;
    border-top: 1px solid var(--neutral-border);
    margin: 10mm 0;
  }

  ul {
    margin: 0 0 4mm 0;
    padding-left: 6mm;
  }

  li {
    margin-bottom: 2mm;
  }

  strong { color: var(--brand-navy-950); }

  .signoff {
    font-family: "Calibri", "Inter", sans-serif;
    font-style: italic;
    text-align: right;
    color: var(--brand-sage-700);
  }
</style>
</head>
<body>

  <div class="cover">
    <div class="eyebrow">The Confident Learning Co.</div>
    <h1>The Learning Confidence<br/>Parent Guide</h1>
    <div class="subtitle">A method for rebuilding your child's confidence in learning — from Years 2 to 11, delivered entirely through you.</div>
    <div class="cover-footer">Adam &amp; Michela — Draft Manuscript</div>
  </div>

  <div class="content">
    ${bodyHtml}
  </div>

</body>
</html>`;

writeFileSync(htmlOutPath, page, "utf8");

const browser = await chromium.launch();
const browserPage = await browser.newPage();
await browserPage.goto(`file://${htmlOutPath.replace(/\\/g, "/")}`, { waitUntil: "load" });
await browserPage.pdf({
  path: pdfOutPath,
  format: "A4",
  printBackground: true,
  displayHeaderFooter: true,
  headerTemplate: `<div></div>`,
  footerTemplate: `
    <div style="width:100%; font-family: Calibri, Inter, sans-serif; font-size:8pt; color:#657083; padding: 0 20mm; display:flex; justify-content:space-between;">
      <span>The Learning Confidence Parent Guide — DRAFT, not final</span>
      <span class="pageNumber"></span>
    </div>`,
  margin: { top: "26mm", bottom: "24mm", left: "22mm", right: "22mm" },
});
await browser.close();

console.log(`PDF written to ${pdfOutPath}`);
