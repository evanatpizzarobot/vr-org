import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAllArticles } from "@/lib/articles";

// Sitemap with truthful per-page lastmod:
//   - pillar / static / hub pages read their real lastRefreshed from the
//     maintenance registry (data/page-maintenance.json), so a refresh there
//     flows straight through instead of every page sharing one frozen date.
//   - category hubs use the newest article actually tagged to that category,
//     not the global newest, so a sparse hub reports its real recency.
//   - articles use their own updatedDate || publishDate.

const SITE = "https://vr.org";

function xmlEscape(value: string): string {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function firstImage(html: string): string | null {
  const m = html.match(/<img\s[^>]*src=["']([^"']+)["']/i);
  if (!m) return null;
  const src = m[1];
  return src.startsWith("http") ? src : `${SITE}${src}`;
}

function registryDates(): Record<string, string> {
  try {
    const p = path.join(process.cwd(), "data", "page-maintenance.json");
    const reg = JSON.parse(fs.readFileSync(p, "utf-8"));
    const map: Record<string, string> = {};
    for (const pg of reg.pages || []) {
      if (pg.path && pg.lastRefreshed) map[pg.path] = pg.lastRefreshed;
    }
    return map;
  } catch {
    return {};
  }
}

export async function GET() {
  const articles = getAllArticles();
  const today = new Date().toISOString().split("T")[0];
  const latest =
    articles.length > 0
      ? articles[0].updatedDate || articles[0].publishDate
      : today;
  const reg = registryDates();

  // Newest article (category match OR tag match) per category hub.
  const CATS = ["hardware", "gaming", "software", "enterprise", "ar", "xr"];
  const catNewest: Record<string, string> = {};
  for (const c of CATS) {
    const dates = articles
      .filter((a) => a.category === c || a.tags.includes(c))
      .map((a) => a.updatedDate || a.publishDate)
      .sort();
    if (dates.length) catNewest[c] = dates[dates.length - 1];
  }

  const reg_or = (p: string) => reg[p] || latest;

  // [loc, lastmod, changefreq, priority] — same URL set and freq/priority as before.
  const pages: [string, string, string, string][] = [
    ["/", latest, "hourly", "1.0"],
    ["/hardware", catNewest.hardware || latest, "hourly", "0.9"],
    ["/gaming", catNewest.gaming || latest, "hourly", "0.9"],
    ["/software", catNewest.software || latest, "hourly", "0.9"],
    ["/enterprise", catNewest.enterprise || latest, "hourly", "0.9"],
    ["/ar", catNewest.ar || latest, "hourly", "0.9"],
    ["/xr", catNewest.xr || latest, "hourly", "0.9"],
    ["/originals", latest, "weekly", "0.9"],
    ["/best-of", reg_or("/best-of"), "weekly", "0.9"],
    ["/events", reg_or("/events"), "monthly", "0.8"],
    ["/deals", reg_or("/deals"), "weekly", "0.7"],
    ["/what-is-vr", reg_or("/what-is-vr"), "monthly", "0.85"],
    ["/best-vr-headsets", reg_or("/best-vr-headsets"), "monthly", "0.85"],
    ["/best-vr-games", reg_or("/best-vr-games"), "monthly", "0.85"],
    ["/best-vr-games-2026", reg_or("/best-vr-games-2026"), "weekly", "0.85"],
    ["/best-vr-apps", reg_or("/best-vr-apps"), "monthly", "0.85"],
    ["/best-vr-fitness", reg_or("/best-vr-fitness"), "monthly", "0.85"],
    ["/ar-glasses", reg_or("/ar-glasses"), "monthly", "0.85"],
    ["/vr-for-beginners", reg_or("/vr-for-beginners"), "monthly", "0.85"],
    ["/about", reg_or("/about"), "monthly", "0.5"],
    ["/privacy", reg["/privacy"] || "2026-03-23", "monthly", "0.3"],
  ];

  const staticUrls = pages
    .map(
      ([loc, lastmod, changefreq, priority]) => `  <url>
    <loc>${SITE}${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("\n");

  const articleUrls = articles
    .map((a) => {
      const img = firstImage(a.body);
      const imageBlock = img
        ? `
    <image:image>
      <image:loc>${xmlEscape(img)}</image:loc>
    </image:image>`
        : "";
      return `  <url>
    <loc>${SITE}/articles/${a.slug}</loc>
    <lastmod>${a.updatedDate || a.publishDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>${imageBlock}
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticUrls}
${articleUrls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
