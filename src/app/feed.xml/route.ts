import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/articles";
import {
  absolutizeImages,
  escapeXmlAttr,
  feedImageForArticle,
  imageMimeType,
} from "@/lib/feed-media";

// RSS 2.0 feed of VR.org Original editorial articles. Every item links to an
// on-site https://vr.org/articles/<slug> permalink so sister sites that blend
// this feed (e.g. TerminalFeed) drive real traffic back to VR.org. Mirrors
// the sitemap.xml route's data source (getAllArticles, newest-first).
//
// Items carry media:thumbnail/media:content and full content:encoded because
// card surfaces (MSN and the Windows new tab, Google Discover, feed readers,
// chat unfurls) render from the feed rather than the page. Without an image
// element they emit a text-only card, which competes badly against feeds that
// ship one. This also satisfies the MSN partner feed spec, which requires both
// a 16:9 thumbnail of at least 640x360 and the full article body.

const SITE = "https://vr.org";
const MAX_ITEMS = 30;

function cdata(value: string): string {
  // Guard against a stray "]]>" closing the CDATA section early.
  return `<![CDATA[${(value || "").replace(/\]\]>/g, "]]]]><![CDATA[>")}]]>`;
}

export async function GET() {
  const articles = getAllArticles().slice(0, MAX_ITEMS);

  const lastBuild = (
    articles.length > 0
      ? new Date(articles[0].updatedDate || articles[0].publishDate)
      : new Date()
  ).toUTCString();

  const items = articles
    .map((a) => {
      const url = `${SITE}/articles/${a.slug}`;
      const pub = new Date(a.publishDate).toUTCString();
      const image = escapeXmlAttr(feedImageForArticle(a));
      const mime = imageMimeType(image);
      return `    <item>
      <title>${cdata(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pub}</pubDate>
      <dc:creator>${cdata(a.author)}</dc:creator>
      <category>${cdata(a.category)}</category>
      <description>${cdata(a.snippet)}</description>
      <media:thumbnail url="${image}"/>
      <media:content url="${image}" medium="image" type="${mime}"/>
      <enclosure url="${image}" type="${mime}" length="0"/>
      <content:encoded>${cdata(absolutizeImages(a.body))}</content:encoded>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>VR.org Originals</title>
    <link>${SITE}</link>
    <description>Original VR, AR and XR editorial from the VR.org team.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
