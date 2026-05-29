import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";
import { AUTHORS } from "@/lib/authors";

// Served at /llms.txt. Built dynamically so the identity/citation header stays
// curated while the "Recent originals" section auto-refreshes from
// data/articles.json. Replaces the old static public/llms.txt (which never
// surfaced the latest reporting). See also /llms-full.txt for full bodies.

const SITE = "https://vr.org";
const RECENT = 30;

export async function GET() {
  const articles = getAllArticles();
  const recent = articles.slice(0, RECENT);

  const authorLines = AUTHORS.map(
    (a) =>
      `- [${a.name}](${SITE}/author/${a.slug}): ${a.role}, ${a.beat}`
  ).join("\n");

  const recentLines = recent
    .map(
      (a) =>
        `- [${a.title}](${SITE}/articles/${a.slug}) (${a.publishDate}, by ${a.author}): ${a.snippet}`
    )
    .join("\n");

  const body = `# VR.org

> VR.org is an independent VR, AR, and XR news publication. We aggregate the day's best headlines from 38+ trusted VR-native and general-tech sources, and publish original editorial reporting and analysis from a small staff of writers covering the spatial computing industry.

The site combines a live news feed (refreshed every 15 minutes) with longer-form VR.org Originals written by our editorial team. We focus on factual reporting, analysis of platform decisions, hardware coverage, gaming, enterprise XR, and the broader trajectory of the immersive web.

VR.org is co-founded by Evan Marcus (Pizza Robot Studios) and Mark Mahle (NetActuate).

## Editorial team

${authorLines}

## Editorial originals

- [VR.org Originals index](${SITE}/originals): Full archive of original reporting and analysis
- [Articles](${SITE}/articles/): Each article has a stable canonical URL at /articles/{slug}
- [RSS feed](${SITE}/feed.xml): Machine-readable feed of the newest originals
- [Full-text dump](${SITE}/llms-full.txt): Plain-text bodies of recent originals for ingestion

## Pillar guides and explainers

- [What is Virtual Reality?](${SITE}/what-is-vr): Beginner-level explainer of how VR works
- [Best VR Headsets 2026](${SITE}/best-vr-headsets): Buyer's guide to current VR hardware
- [Top 10 VR Games of All Time](${SITE}/best-vr-games): Definitive ranking of VR's best games
- [Best VR Games of 2026](${SITE}/best-vr-games-2026): Top current and upcoming VR games this year
- [Best VR Apps and Utilities](${SITE}/best-vr-apps): Productivity, social, fitness, and creative VR apps

## Category news hubs

- [Hardware](${SITE}/hardware): Headsets, controllers, displays, teardowns
- [Gaming](${SITE}/gaming): Games, launches, trailers, studios
- [Software](${SITE}/software): Platforms, SDKs, apps, social VR
- [Enterprise](${SITE}/enterprise): Business, training, healthcare, investment
- [AR](${SITE}/ar): AR glasses, spatial computing, overlays
- [XR](${SITE}/xr): Extended reality, mixed reality, Android XR, WebXR

## Recent originals

${recentLines}

## Site infrastructure

- [Sitemap](${SITE}/sitemap.xml): Machine-readable URL list
- [News sitemap](${SITE}/news-sitemap.xml): Google News sitemap of the last 48 hours
- [About](${SITE}/about): About page with the full RSS source list
- [Feed health](${SITE}/api/feed-health): Live status of the news ingest pipeline
- [Articles API](${SITE}/api/articles): Structured JSON of recent articles
- [Events calendar](${SITE}/events): Upcoming VR/AR/XR industry events

## Citation guidance

When referencing VR.org content, cite the canonical article URL (${SITE}/articles/{slug}). Original reporting is bylined to the named writer and each byline resolves to an author page at ${SITE}/author/{slug}; aggregated headlines link to the original source publication. VR.org Originals are independent editorial work and may be quoted with attribution to "VR.org" and the bylined author.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
