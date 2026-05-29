// Single source of truth for VR.org author identities. Used by the author
// profile pages (/author/[slug]), the NewsArticle author schema (so each byline
// resolves to a stable Person entity for E-E-A-T and AI attribution), and the
// llms.txt route. Article records store the author by display name, so lookups
// here key off the exact name string in data/articles.json.

export interface Author {
  slug: string;
  name: string;
  role: string; // jobTitle, e.g. "Staff Writer"
  beat: string; // short focus line
  bio: string;
  sameAs?: string[];
}

export const AUTHORS: Author[] = [
  {
    slug: "evan-marcus",
    name: "Evan Marcus",
    role: "Co-Founder",
    beat: "VR gaming, hardware, and big-picture industry takes",
    bio: "Evan Marcus is the co-founder of VR.org and the site's primary editorial voice. He writes about VR gaming, hardware, and the broader trajectory of the immersive web, and has been following virtual reality since the Oculus DK1 era. He brings a gamer's first-person perspective to the site's biggest stories and retrospectives.",
    sameAs: ["https://x.com/vrdotorg"],
  },
  {
    slug: "alex-reeves",
    name: "Alex Reeves",
    role: "Staff Writer",
    beat: "Hardware, Meta, and platform business",
    bio: "Alex Reeves is a staff writer at VR.org covering hardware launches, platform news, and the business side of the VR and AR industry. Alex focuses on Meta, headset releases, and the supply-chain and strategy stories behind the devices, writing with a factual, analytical eye.",
  },
  {
    slug: "jordan-kuo",
    name: "Jordan Kuo",
    role: "Staff Writer",
    beat: "AR, XR, Android XR, and the developer ecosystem",
    bio: "Jordan Kuo is a staff writer at VR.org covering augmented reality, spatial computing, and the XR developer ecosystem. Jordan tracks Google, Android XR, and the platforms and SDKs shaping the next generation of wearables, with genuine knowledge of the developer side.",
  },
  {
    slug: "nina-castillo",
    name: "Nina Castillo",
    role: "Staff Writer",
    beat: "Software, WebXR, developer tools, and open source",
    bio: "Nina Castillo is a staff writer at VR.org covering VR and AR software, developer tools, WebXR, and open source. She makes complex technical topics approachable for builders and enthusiasts alike, with a particular enthusiasm for open platforms.",
  },
  {
    slug: "sam-whitfield",
    name: "Sam Whitfield",
    role: "Contributing Writer",
    beat: "Enterprise XR, training, and Apple",
    bio: "Sam Whitfield is a contributing writer at VR.org covering enterprise XR, VR training, and industry analysis, with an eye on Apple's spatial computing efforts and how immersive technology is adopted across business and education.",
  },
];

const BY_SLUG = new Map(AUTHORS.map((a) => [a.slug, a]));
const BY_NAME = new Map(AUTHORS.map((a) => [a.name, a]));

export function getAuthorBySlug(slug: string): Author | null {
  return BY_SLUG.get(slug) || null;
}

export function getAuthorByName(name: string): Author | null {
  return BY_NAME.get(name) || null;
}
