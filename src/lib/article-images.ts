// Runtime failsafe for article body images.
//
// Article bodies are rendered via dangerouslySetInnerHTML and pull from
// external CDNs (YouTube thumbs, Wikimedia, Steam, etc.). When a URL
// 404s the user otherwise sees a broken-image icon and a busted layout.
// We inject an onerror handler that removes the entire <figure> so the
// page degrades cleanly to text-only.
//
// This runs on every body read in lib/articles.ts so it covers every
// render site (article page, related cards, etc.) without per-site work.

const IMG_TAG = /<img\b([^>]*)>/gi;

export function withImageFailsafe(html: string): string {
  return html.replace(IMG_TAG, (match, attrs: string) => {
    if (/\sonerror\s*=/i.test(attrs)) return match;
    const cleaned = attrs.replace(/\s*\/\s*$/, "");
    const handler =
      `onerror="var f=this.closest('figure');if(f){f.remove()}else{this.remove()}"`;
    return `<img${cleaned} ${handler}>`;
  });
}
