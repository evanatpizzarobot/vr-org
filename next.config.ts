import type { NextConfig } from "next";

// Permanent (308) redirects for dead URLs that search engines had indexed.
// Two sources of these 404s:
//   1. Old internal links that pointed at article slugs that were never
//      published. The body links themselves are now fixed in articles.json,
//      but Google still has the old URLs queued, so we 301 them to the real
//      article that ended up covering the topic.
//   2. Legacy / orphan paths (old author archive pages, an /applications
//      route) that nothing on the current site links to. We send those to
//      the closest live hub instead of letting them dead-end on a 404.
const REDIRECTS: { source: string; destination: string }[] = [
  // Dead article slugs -> the article that actually covers the topic
  {
    source: "/articles/apple-vision-pro-2-timeline",
    destination: "/articles/apple-vision-pro-2-years-away-gurman-2028-timeline",
  },
  {
    source: "/articles/android-show-may-2026-xr-recap",
    destination: "/articles/android-show-2026-xr-glasses-recap",
  },
  {
    source: "/articles/h3vr2-announced-quest-steamvr",
    destination: "/articles/h3vr2-hot-dogs-horseshoes-hand-grenades-2-quest-steam",
  },
  {
    source: "/articles/meta-reality-labs-layoffs-pivot-2026",
    destination: "/articles/meta-reality-labs-q1-2026-earnings-vr-smart-glasses-pivot",
  },
  {
    source: "/articles/vr-training-replacing-traditional-methods",
    destination: "/articles/enterprise-vr-training-219-percent-roi",
  },
  {
    source: "/articles/enterprise-vr-training-",
    destination: "/articles/enterprise-vr-training-219-percent-roi",
  },
  {
    source: "/articles/webxr-future-of-xr-development",
    destination: "/articles/webxr-adoption-surge-2026-browsers-vs-apps",
  },
  {
    source: "/articles/apple-vision-pro-enterprise-surprise",
    destination: "/articles/apple-business-app-vision-pro-enterprise",
  },
  // Dead slugs with no single matching article -> closest topic hub
  {
    source: "/articles/niantic-8th-wall-free-open-source",
    destination: "/software",
  },
  {
    source: "/articles/beat-saber-changed-vr-forever",
    destination: "/best-vr-games",
  },
  // Legacy / orphan paths (old WordPress pages, nothing on the site links here)
  { source: "/applications", destination: "/best-vr-apps" },
  { source: "/lg", destination: "/hardware" },
  { source: "/os", destination: "/software" },
  { source: "/kids-series", destination: "/best-vr-games" },
  // We do not run per-author archive pages. Anything under /author/* goes to
  // the originals index, which lists every editorial piece.
  { source: "/author/:slug*", destination: "/originals" },
  // The RSS feed lives at /feed.xml. Readers and users keep trying the common
  // WordPress-style /feed (and /rss) paths, which were dead-ending on a 404.
  { source: "/feed", destination: "/feed.xml" },
  { source: "/rss", destination: "/feed.xml" },
  { source: "/rss.xml", destination: "/feed.xml" },
  // iOS auto-requests the -precomposed apple-touch-icon variant even when a
  // page does not reference it; point it at the icon we actually ship.
  { source: "/apple-touch-icon-precomposed.png", destination: "/apple-touch-icon.png" },
  // No /articles index page exists; the editorial list is /originals.
  { source: "/articles", destination: "/originals" },
  // Some agents request /favicon.png even though pages reference .ico/.svg;
  // point it at a PNG we actually ship.
  { source: "/favicon.png", destination: "/favicon-32x32.png" },
  // Legacy WordPress-era pages. The VR-history page maps to the explainer;
  // everything else under /about-us goes to the live about page.
  { source: "/about-us/history-of-vr", destination: "/what-is-vr" },
  { source: "/about-us/:path*", destination: "/about" },
  // Old WordPress category archives. Entertainment was the gaming-adjacent
  // category; anything else goes to the homepage feed.
  { source: "/category/entertainment", destination: "/gaming" },
  { source: "/category/:slug*", destination: "/" },
  // Old WordPress date permalinks (/2018/08/17/post-slug). Those posts are
  // gone; the originals index is the closest living analog.
  { source: "/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug*", destination: "/originals" },
  // vr.org's pre-2018 hosting-sales pages (VPS and datacenter products).
  // NetActuate is where that business lives now.
  { source: "/datacenters/:path*", destination: "https://netactuate.com" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      ...REDIRECTS.map((r) => ({ ...r, permanent: true })),
      // Humans pasting vr.org/mcp into a browser send Accept: text/html and
      // land on the human connection guide. MCP clients never ask for
      // text/html (they send application/json, text/event-stream), so they
      // fall through to the protocol redirect below. Order matters: first
      // match wins. Temporary (307) so the browser UX can change later.
      {
        source: "/mcp",
        has: [{ type: "header", key: "accept", value: ".*text/html.*" }],
        destination: "/connect",
        permanent: false,
      },
      // Clean public alias for the remote MCP endpoint. A 308 redirect (not a
      // rewrite) so mcp-handler sees its own /api/mcp path; 308 preserves the
      // POST method and body, which the MCP client's fetch follows.
      { source: "/mcp", destination: "/api/mcp", permanent: true },
    ];
  },
  async headers() {
    return [
      // The gated /console (Vantage) is internal-only. Keep it out of every
      // index even though it is auth-gated (the route handlers also send this
      // header; this is belt-and-suspenders, and covers /vantage.js).
      {
        source: "/console/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/console",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/vantage.js",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
