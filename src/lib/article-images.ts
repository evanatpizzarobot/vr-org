// Runtime failsafe for article body images.
//
// Article bodies are rendered via dangerouslySetInnerHTML and pull from
// external CDNs (YouTube thumbs, Wikimedia, Steam, etc.). When a URL is
// missing the user otherwise sees a broken-image icon and a busted layout.
// We inject two handlers that remove the entire <figure>:
//   - onerror: fires on HTTP errors / decode failures
//   - onload + naturalWidth check: catches placeholder responses that
//     return HTTP 200/404 with a valid tiny image body. YouTube does
//     this for missing video IDs (1097-byte 120x90 gray JPEG with HTTP
//     404). The browser decodes it fine, so onerror never fires.
//
// 200px threshold: article body figures are expected to be 1024px+. Any
// image rendering at <200px wide on the source is almost certainly a
// CDN placeholder, not real content.
//
// Runs on every body read in lib/articles.ts so it covers every render
// site (article page, related cards, etc.) without per-site work.

const IMG_TAG = /<img\b([^>]*)>/gi;
const REMOVE = "var f=this.closest('figure');if(f){f.remove()}else{this.remove()}";

export function withImageFailsafe(html: string): string {
  return html.replace(IMG_TAG, (match, attrs: string) => {
    if (/\sonerror\s*=/i.test(attrs) || /\sonload\s*=/i.test(attrs)) return match;
    const cleaned = attrs.replace(/\s*\/\s*$/, "");
    const onerror = `onerror="${REMOVE}"`;
    const onload = `onload="if(this.naturalWidth&&this.naturalWidth<200){${REMOVE}}"`;
    return `<img${cleaned} ${onerror} ${onload}>`;
  });
}
