import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";

// Google News sitemap. Google News only considers articles published in the
// last 2 days, so this lists only that rolling window. Referenced from
// robots.txt and submittable in Search Console for Top Stories / News surfaces.

const SITE = "https://vr.org";
const WINDOW_DAYS = 2;

function xmlEscape(value: string): string {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const cutoff = new Date(Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const recent = getAllArticles().filter(
    (a) => new Date(a.publishDate).getTime() >= cutoff.getTime()
  );

  const urls = recent
    .map((a) => {
      const url = `${SITE}/articles/${a.slug}`;
      // publishDate is a bare YYYY-MM-DD (UTC midnight); emit full ISO.
      const pubDate = new Date(a.publishDate).toISOString();
      return `  <url>
    <loc>${url}</loc>
    <news:news>
      <news:publication>
        <news:name>VR.org</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${xmlEscape(a.title)}</news:title>
    </news:news>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=900, s-maxage=900",
    },
  });
}
