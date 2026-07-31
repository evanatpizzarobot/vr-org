// Run: npx --yes tsx src/lib/feed-media.test.ts
// Standalone assertions (repo has no test framework). Exits non-zero on failure.
import {
  absoluteUrl,
  absolutizeImages,
  escapeXmlAttr,
  feedImageForArticle,
  firstImageUrl,
  imageMimeType,
} from "./feed-media";

let failures = 0;
function eq(label: string, actual: unknown, expected: unknown) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) {
    failures++;
    console.error(`FAIL ${label}: expected ${e}, got ${a}`);
  } else {
    console.log(`ok   ${label}`);
  }
}

// absoluteUrl
eq("absolute URL passes through",
  absoluteUrl("https://upload.wikimedia.org/a/b.jpg"), "https://upload.wikimedia.org/a/b.jpg");
eq("root-relative gets the origin",
  absoluteUrl("/article-images/x.jpg"), "https://vr.org/article-images/x.jpg");
eq("protocol-relative becomes https",
  absoluteUrl("//cdn.example.com/x.jpg"), "https://cdn.example.com/x.jpg");
eq("empty stays empty", absoluteUrl(""), "");

// firstImageUrl
eq("picks the first image, not a later one",
  firstImageUrl('<p>hi</p><figure><img src="https://a.test/1.jpg" /></figure><img src="https://a.test/2.jpg" />'),
  "https://a.test/1.jpg");
eq("absolutises a self-hosted lead image",
  firstImageUrl('<figure><img loading="lazy" src="/article-images/steam-frame/a.jpg" /></figure>'),
  "https://vr.org/article-images/steam-frame/a.jpg");
eq("single-quoted src is handled",
  firstImageUrl("<img src='https://a.test/q.png' />"), "https://a.test/q.png");
eq("no image returns null", firstImageUrl("<p>text only</p>"), null);

// feedImageForArticle
eq("uses the article's own lead image",
  feedImageForArticle({ body: '<img src="https://a.test/lead.jpg" />', slug: "s" }),
  "https://a.test/lead.jpg");
eq("falls back to the generated OG card",
  feedImageForArticle({ body: "<p>no images here</p>", slug: "my-slug" }),
  "https://vr.org/articles/my-slug/opengraph-image");

// imageMimeType
eq("jpg maps to image/jpeg", imageMimeType("https://a.test/x.jpg"), "image/jpeg");
eq("png maps to image/png", imageMimeType("https://a.test/x.PNG"), "image/png");
eq("webp maps to image/webp", imageMimeType("https://a.test/x.webp"), "image/webp");
eq("extensionless OG card defaults to jpeg",
  imageMimeType("https://vr.org/articles/s/opengraph-image"), "image/jpeg");

// escapeXmlAttr
eq("ampersands are escaped for attributes",
  escapeXmlAttr("https://a.test/x.jpg?w=1&h=2"), "https://a.test/x.jpg?w=1&amp;h=2");
eq("quotes are escaped", escapeXmlAttr('a"b'), "a&quot;b");

// absolutizeImages
eq("rewrites root-relative img src in the body",
  absolutizeImages('<img src="/article-images/a.jpg" />'),
  '<img src="https://vr.org/article-images/a.jpg" />');
eq("rewrites root-relative internal links",
  absolutizeImages('<a href="/articles/other">x</a>'),
  '<a href="https://vr.org/articles/other">x</a>');
eq("leaves already-absolute URLs untouched",
  absolutizeImages('<img src="https://upload.wikimedia.org/a.jpg" />'),
  '<img src="https://upload.wikimedia.org/a.jpg" />');
eq("does not touch non-URL attributes",
  absolutizeImages('<img alt="/not/a/url" src="/a.jpg" />'),
  '<img alt="/not/a/url" src="https://vr.org/a.jpg" />');

console.log(failures === 0 ? "\nAll feed-media tests passed." : `\n${failures} failure(s).`);
process.exit(failures === 0 ? 0 : 1);
