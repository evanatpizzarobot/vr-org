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
  // Legacy / orphan paths
  { source: "/applications", destination: "/best-vr-apps" },
  // We do not run per-author archive pages. Anything under /author/* goes to
  // the originals index, which lists every editorial piece.
  { source: "/author/:slug*", destination: "/originals" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
  },
  async redirects() {
    return REDIRECTS.map((r) => ({ ...r, permanent: true }));
  },
};

export default nextConfig;
