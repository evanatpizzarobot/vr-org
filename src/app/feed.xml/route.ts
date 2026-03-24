import { NextResponse } from "next/server";
import { getCache, startFeedEngine } from "@/lib/rss/engine";

startFeedEngine();

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const cache = getCache();
  const articles = cache.articles.slice(0, 50);
  const lastBuild = cache.lastUpdated || new Date().toISOString();

  const items = articles
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(a.link)}</link>
      <description>${escapeXml(a.snippet)}</description>
      <pubDate>${new Date(a.pubDate).toUTCString()}</pubDate>
      <source url="${escapeXml(a.link)}">${escapeXml(a.sourceName)}</source>
      <category>${escapeXml(a.category)}</category>
      <guid isPermaLink="false">${a.id}</guid>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>VR.org — Virtual Reality &amp; Augmented Reality News</title>
    <link>https://vr.org</link>
    <description>Real-time VR, AR, and XR news aggregated from the world's top sources.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="https://vr.org/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://vr.org/logo.png</url>
      <title>VR.org</title>
      <link>https://vr.org</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=900",
    },
  });
}
