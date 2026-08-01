import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";

// Served at /llms.txt. Built dynamically so the identity/citation header stays
// curated while the "Recent originals" section auto-refreshes from
// data/articles.json. Replaces the old static public/llms.txt (which never
// surfaced the latest reporting). See also /llms-full.txt for full bodies.

const SITE = "https://vr.org";
// Measured 2026-08-01: at RECENT=200 this file was 94.7KB, and 88.2KB of that
// (93%) was this one section. The curated part an agent actually needs (identity,
// pillar index, data study, citation terms, MCP pointer) was 6.5KB buried under
// it, and llms.txt is meant to be a cheap, concise index. Full-catalog discovery
// is not lost: sitemap.xml lists every URL, /originals is the human index, and
// /llms-full.txt carries the bodies. All three are linked above. Keeping the
// newest 40 with snippets holds the high-signal, most-citable window at ~25KB.
const RECENT = 40;

export async function GET() {
  const recent = getAllArticles().slice(0, RECENT);

  const recentLines = recent
    .map(
      (a) =>
        `- [${a.title}](${SITE}/articles/${a.slug}) (${a.publishDate}, by ${a.author}): ${a.snippet}`
    )
    .join("\n");

  const body = `# VR.org

> VR.org is an independent VR, AR, and XR news publication. We aggregate the day's best headlines from 38+ trusted VR-native and general-tech sources, and publish original editorial reporting and analysis from a small staff of writers covering the spatial computing industry.

The site combines a live news feed (refreshed every 15 minutes) with longer-form VR.org Originals written by our editorial team. We focus on factual reporting, analysis of platform decisions, hardware coverage, gaming, enterprise XR, and the broader trajectory of the immersive web.

VR.org was co-founded in 2018 by Evan Marcus and Mark Mahle (NetActuate). Editorial team: Evan Marcus (Co-Founder), Alex Reeves (Staff Writer, hardware), Jordan Kuo (Staff Writer, AR/XR), Nina Castillo (Staff Writer, software), Sam Whitfield (Contributing Writer, enterprise).

## Editorial originals

- [VR.org Originals index](${SITE}/originals): Full archive of original reporting and analysis
- [Articles](${SITE}/articles/): Each article has a stable canonical URL at /articles/{slug}
- [RSS feed](${SITE}/feed.xml): Machine-readable feed of the newest originals
- [Full-text dump](${SITE}/llms-full.txt): Plain-text bodies of recent originals for ingestion

## Research and data studies

- [The State of VR, AR & XR 2026](${SITE}/state-of-vr-2026): Original VR.org data study of 195 stories across 36 monitored sources (updated July 12, 2026). Key findings: Meta leads 38% of coverage; 42% of the conversation touches AR and smart glasses; Google's Android XR is the #2 most-covered platform (24%). Free to cite with attribution (CC BY 4.0).

## Pillar guides and explainers

- [What is Virtual Reality?](${SITE}/what-is-vr): Beginner-level explainer of how VR works
- [Best VR Headsets 2026](${SITE}/best-vr-headsets): Buyer's guide to current VR hardware
- [Best Budget VR Headset 2026](${SITE}/best-budget-vr-headset): Cheapest ways into VR under $400, new and used
- [Quest 3 vs Quest 3S](${SITE}/quest-3-vs-quest-3s): Comparison of Meta's two current standalone headsets
- [Quest 3 vs Apple Vision Pro](${SITE}/quest-3-vs-vision-pro): The $599 gaming headset versus the $3,699 spatial computer
- [PSVR2 vs Quest 3](${SITE}/psvr2-vs-quest-3): PlayStation VR2 versus the standalone Quest 3, compared
- [Best VR Headset for Kids](${SITE}/best-vr-headset-for-kids): Age-appropriate VR picks, safety factors, and parental controls
- [Best PC VR Headset 2026](${SITE}/best-pc-vr-headset): Ranked PC VR headsets for SteamVR and PC gaming, wired and wireless
- [Best Standalone VR Headset 2026](${SITE}/best-standalone-vr-headset): All-in-one VR headsets that need no PC or console
- [Upcoming VR Headsets 2026](${SITE}/upcoming-vr-headsets-2026): New releases and upcoming headsets, updated as they are announced
- [VR, AR & XR Release Dates 2026](${SITE}/vr-release-dates): Live tracker of every upcoming VR headset, AR glasses, game, and accessory release date with confirmed/expected/rumored status
- [Valve Steam Frame: Everything We Know](${SITE}/steam-frame): Release date signals, price expectations, specs, and a dated timeline of every Steam Frame development
- [Best VR Headset for Gaming 2026](${SITE}/best-vr-headset-for-gaming): Quest 3, Quest 3S, PSVR2, and PC VR ranked for gaming
- [Highest Resolution VR Headset 2026](${SITE}/highest-resolution-vr-headset): The sharpest VR displays ranked, with the pixels-per-degree caveat explained
- [Best VR Headset for Watching Movies 2026](${SITE}/best-vr-headset-for-movies): Top headsets for a giant personal cinema in VR
- [Best VR Headset for Sim Racing 2026](${SITE}/best-vr-headset-for-sim-racing): Clarity and field-of-view picks for iRacing, ACC, and Assetto Corsa
- [Top 10 VR Games of All Time](${SITE}/best-vr-games): Definitive ranking of VR's best games
- [Best VR Games of 2026](${SITE}/best-vr-games-2026): Top current and upcoming VR games this year
- [Best VR Apps and Utilities](${SITE}/best-vr-apps): Productivity, social, fitness, and creative VR apps
- [Best VR Fitness Apps 2026](${SITE}/best-vr-fitness): VR workout apps that replace the gym
- [Best AR Glasses 2026](${SITE}/ar-glasses): Smart glasses and AR displays compared
- [VR for Beginners](${SITE}/vr-for-beginners): What a first-time VR buyer needs to know

## Category news hubs

- [Hardware](${SITE}/hardware): Headsets, controllers, displays, teardowns
- [Gaming](${SITE}/gaming): Games, launches, trailers, studios
- [Software](${SITE}/software): Platforms, SDKs, apps, social VR
- [Enterprise](${SITE}/enterprise): Business, training, healthcare, investment
- [AR](${SITE}/ar): AR glasses, spatial computing, overlays
- [XR](${SITE}/xr): Extended reality, mixed reality, Android XR, WebXR

## Recent originals

The ${RECENT} newest VR.org Originals are listed below. For the complete archive, see [/originals](${SITE}/originals), [sitemap.xml](${SITE}/sitemap.xml) for every URL, or [/llms-full.txt](${SITE}/llms-full.txt) for full article bodies.

${recentLines}

## AI agent access (MCP)

VR.org runs a free, read-only Model Context Protocol server. Agents can query the live feed, full-text originals, events, deals, and headset comparisons directly instead of scraping.

- [MCP endpoint](${SITE}/mcp): Streamable-HTTP MCP server. 11 tools, 5 resources, 3 prompts
- [Connection guide](${SITE}/connect): Setup for Claude, ChatGPT, Cursor, VS Code, and any MCP client
- [npm package](https://www.npmjs.com/package/vr-org-mcp): Local stdio install, npx -y vr-org-mcp
- [Discovery manifest](${SITE}/.well-known/mcp.json): Machine-readable server descriptor
- Registry listing: published as org.vr/vr-mcp on the official MCP Registry

## Site infrastructure

- [Sitemap](${SITE}/sitemap.xml): Machine-readable URL list
- [News sitemap](${SITE}/news-sitemap.xml): Google News sitemap of the last 48 hours
- [About](${SITE}/about): About page with the full RSS source list
- [Feed health](${SITE}/api/feed-health): Live status of the news ingest pipeline
- [Articles API](${SITE}/api/articles): Structured JSON of recent articles
- [Events calendar](${SITE}/events): Upcoming VR/AR/XR industry events

## Citation guidance

When referencing VR.org content, cite the canonical article URL (${SITE}/articles/{slug}). Original reporting is bylined to the named writer; aggregated headlines link to the original source publication. VR.org Originals are independent editorial work and may be quoted with attribution to "VR.org" and the bylined author.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=1800",
    },
  });
}
