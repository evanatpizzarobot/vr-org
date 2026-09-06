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

// MUST stay force-dynamic. This route reads data/articles.json, which is
// volume-mounted and updated by data-only deploys that never rebuild the
// container (see deploy-run.sh). Without this, Next statically prerenders the
// route at build time and the sitemap freezes at the container's build date, so
// new articles stay out of the sitemap until something else triggers a rebuild.
// Caught 2026-08-09: an article was live and linked from every hub while
// sitemap.xml still listed only the previous day's slugs.
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

  // [loc, lastmod, changefreq, priority]: same URL set and freq/priority as before.
  const pages: [string, string, string, string][] = [
    ["/", latest, "hourly", "1.0"],
    ["/hardware", catNewest.hardware || latest, "hourly", "0.9"],
    ["/gaming", catNewest.gaming || latest, "hourly", "0.9"],
    ["/software", catNewest.software || latest, "hourly", "0.9"],
    ["/enterprise", catNewest.enterprise || latest, "hourly", "0.9"],
    ["/ar", catNewest.ar || latest, "hourly", "0.9"],
    ["/xr", catNewest.xr || latest, "hourly", "0.9"],
    ["/originals", latest, "weekly", "0.9"],
    ["/state-of-vr-2026", reg_or("/state-of-vr-2026"), "monthly", "0.8"],
    ["/best-of", reg_or("/best-of"), "weekly", "0.9"],
    ["/events", reg_or("/events"), "monthly", "0.8"],
    ["/deals", reg_or("/deals"), "weekly", "0.7"],
    ["/connect", "2026-07-08", "monthly", "0.6"],
    ["/what-is-vr", reg_or("/what-is-vr"), "monthly", "0.85"],
    ["/best-vr-headsets", reg_or("/best-vr-headsets"), "monthly", "0.85"],
    ["/best-budget-vr-headset", reg_or("/best-budget-vr-headset"), "monthly", "0.8"],
    ["/quest-3-vs-quest-3s", reg_or("/quest-3-vs-quest-3s"), "monthly", "0.8"],
    ["/quest-3-vs-vision-pro", reg_or("/quest-3-vs-vision-pro"), "monthly", "0.8"],
    ["/psvr2-vs-quest-3", reg_or("/psvr2-vs-quest-3"), "monthly", "0.8"],
    ["/best-vr-headset-for-kids", reg_or("/best-vr-headset-for-kids"), "monthly", "0.8"],
    ["/best-pc-vr-headset", reg_or("/best-pc-vr-headset"), "monthly", "0.8"],
    ["/best-standalone-vr-headset", reg_or("/best-standalone-vr-headset"), "monthly", "0.8"],
    ["/upcoming-vr-headsets-2026", reg_or("/upcoming-vr-headsets-2026"), "weekly", "0.8"],
    ["/vr-release-dates", reg_or("/vr-release-dates"), "weekly", "0.85"],
    ["/steam-frame", reg_or("/steam-frame"), "weekly", "0.85"],
    ["/great-on-frame", reg_or("/great-on-frame"), "weekly", "0.85"],
    ["/steam-frame-price", reg_or("/steam-frame-price"), "weekly", "0.8"],
    ["/steam-frame-release-date", reg_or("/steam-frame-release-date"), "weekly", "0.8"],
    ["/steam-frame-vs-quest-3", reg_or("/steam-frame-vs-quest-3"), "weekly", "0.8"],
    ["/meta-connect-2026", reg_or("/meta-connect-2026"), "weekly", "0.85"],
    ["/best-vr-headset-for-gaming", reg_or("/best-vr-headset-for-gaming"), "monthly", "0.8"],
    ["/highest-resolution-vr-headset", reg_or("/highest-resolution-vr-headset"), "monthly", "0.8"],
    ["/best-vr-headset-for-movies", reg_or("/best-vr-headset-for-movies"), "monthly", "0.8"],
    ["/best-vr-headset-for-sim-racing", reg_or("/best-vr-headset-for-sim-racing"), "monthly", "0.8"],
    ["/best-vr-games", reg_or("/best-vr-games"), "monthly", "0.85"],
    ["/best-vr-games-2026", reg_or("/best-vr-games-2026"), "weekly", "0.85"],
    ["/best-vr-apps", reg_or("/best-vr-apps"), "monthly", "0.85"],
    ["/best-vr-fitness", reg_or("/best-vr-fitness"), "monthly", "0.85"],
    ["/best-mixed-reality-games", reg_or("/best-mixed-reality-games"), "monthly", "0.85"],
    ["/ar-glasses", reg_or("/ar-glasses"), "monthly", "0.85"],
    ["/vr-for-beginners", reg_or("/vr-for-beginners"), "monthly", "0.85"],
    ["/vr-youtubers", reg_or("/vr-youtubers"), "monthly", "0.85"],
    ["/advertise", reg_or("/advertise"), "monthly", "0.6"],
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
