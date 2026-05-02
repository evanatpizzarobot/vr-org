import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";

const PILLAR_LASTMOD = "2026-04-20";

export async function GET() {
  const now = new Date().toISOString().split("T")[0];
  const articles = getAllArticles();

  const articleUrls = articles
    .map(
      (a) => `  <url>
    <loc>https://vr.org/articles/${a.slug}</loc>
    <lastmod>${a.updatedDate || a.publishDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("\n");

  const latestArticleDate =
    articles.length > 0
      ? (articles[0].updatedDate || articles[0].publishDate)
      : now;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vr.org/</loc>
    <lastmod>${latestArticleDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://vr.org/hardware</loc>
    <lastmod>${latestArticleDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vr.org/gaming</loc>
    <lastmod>${latestArticleDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vr.org/software</loc>
    <lastmod>${latestArticleDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vr.org/enterprise</loc>
    <lastmod>${latestArticleDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vr.org/ar</loc>
    <lastmod>${latestArticleDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vr.org/xr</loc>
    <lastmod>${latestArticleDate}</lastmod>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vr.org/originals</loc>
    <lastmod>${latestArticleDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vr.org/best-of</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://vr.org/events</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://vr.org/deals</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://vr.org/what-is-vr</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://vr.org/best-vr-headsets</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://vr.org/best-vr-games</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://vr.org/best-vr-games-2026</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://vr.org/best-vr-apps</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://vr.org/best-vr-fitness</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://vr.org/ar-glasses</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
  <url>
    <loc>https://vr.org/vr-for-beginners</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.85</priority>
  </url>
${articleUrls}
  <url>
    <loc>https://vr.org/about</loc>
    <lastmod>${PILLAR_LASTMOD}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://vr.org/privacy</loc>
    <lastmod>2026-03-23</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
