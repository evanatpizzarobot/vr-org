import { NextResponse } from "next/server";
import { getAllArticles, type EditorialArticle } from "@/lib/articles";

// Video sitemap for articles that embed a YouTube video. Listed in robots.txt
// and submittable in Search Console. Unlocks Video rich results independently
// of the VideoObject JSON-LD already rendered on the article pages.

// Reads data/articles.json, which is volume-mounted and updated by data-only
// deploys that skip the Docker rebuild. Pinned dynamic so Next can never
// statically prerender it and freeze this output at the container build date.
export const dynamic = "force-dynamic";

const SITE = "https://vr.org";

function xmlEscape(value: string): string {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function youTubeId(html: string): string | null {
  const patterns = [
    /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/,
    /img\.youtube\.com\/vi\/([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return null;
}

export async function GET() {
  const entries = getAllArticles()
    .map((a) => ({ a, vid: youTubeId(a.body) }))
    .filter((e): e is { a: EditorialArticle; vid: string } => e.vid !== null);

  const urls = entries
    .map(({ a, vid }) => {
      const pubDate = new Date(a.updatedDate || a.publishDate).toISOString();
      const description = xmlEscape(a.snippet || a.title);
      return `  <url>
    <loc>${SITE}/articles/${a.slug}</loc>
    <video:video>
      <video:thumbnail_loc>https://img.youtube.com/vi/${vid}/maxresdefault.jpg</video:thumbnail_loc>
      <video:title>${xmlEscape(a.title)}</video:title>
      <video:description>${description}</video:description>
      <video:player_loc>https://www.youtube.com/embed/${vid}</video:player_loc>
      <video:publication_date>${pubDate}</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
      <video:live>no</video:live>
    </video:video>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
