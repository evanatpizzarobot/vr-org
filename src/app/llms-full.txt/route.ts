import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";

// Served at /llms-full.txt. Concatenates the plain-text bodies of recent VR.org
// Originals so an AI agent can ingest and quote the actual reporting, not just
// the navigation skeleton in llms.txt. Newest first, capped to keep the
// response a reasonable size.

const SITE = "https://vr.org";
// Cover the full originals catalog so answer engines can ingest every piece,
// with a generous ceiling to cap response size as the library keeps growing.
const MAX = 250;

function toPlainText(html: string): string {
  return (html || "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, "") // drop image markup
    .replace(/<\/(p|h2|h3|li|blockquote)>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "- ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&rsquo;|&lsquo;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, ", ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export async function GET() {
  const articles = getAllArticles().slice(0, MAX);

  const header = `# VR.org full-text dump

> Plain-text bodies of the ${articles.length} most recent VR.org Originals, newest first. Each entry lists the canonical URL, author, date, and full article text. Cite the canonical URL and attribute to VR.org and the bylined author. Generated from the live site.

Live agent access: VR.org also runs a free read-only MCP server at ${SITE}/mcp (setup guide: ${SITE}/connect).

`;

  const sections = articles
    .map((a) => {
      const url = `${SITE}/articles/${a.slug}`;
      return `\n---\n\n## ${a.title}\n\nURL: ${url}\nAuthor: ${a.author} (${a.authorRole})\nPublished: ${a.publishDate}\nCategory: ${a.category}\nTags: ${a.tags.join(", ")}\n\n${toPlainText(a.body)}\n`;
    })
    .join("\n");

  return new NextResponse(header + sections, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
