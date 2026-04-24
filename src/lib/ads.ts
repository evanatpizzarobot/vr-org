// AdSense slot IDs. Replace the placeholder strings below with real slot IDs
// from the AdSense console once the ad units are created. These strings are
// the literal `data-ad-slot` values AdSense will render.
//
// Publisher ID: pub-7224757913262984 (set in AdSlot component).
//
// Steps to configure:
//   1. Go to https://adsense.google.com
//   2. Create these four ad units (Display ad, In-feed, In-article, Display):
//      - VR.org Sidebar      (Display, responsive rectangle)
//      - VR.org In-Feed      (In-feed ad, responsive horizontal)
//      - VR.org In-Article   (In-article ad)
//      - VR.org Side Rail    (Display, 160x600 vertical)
//   3. Copy each slot ID here.
export const AD_SLOTS = {
  sidebar: "5198848799",
  feed: "5007277106",
  article: "3311052050",
  rail: "1380479557",
};

// In-Feed ads are "fluid" format and require a layout key that AdSense
// generates when the ad unit is created. One key per in-feed unit.
export const AD_LAYOUT_KEYS = {
  feed: "-h3-5+1v-2l-d",
};
