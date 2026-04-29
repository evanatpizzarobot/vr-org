// Auto-linking helper for VR.org Originals.
// Scans article body HTML for high-value keywords and links the FIRST
// occurrence of each to the matching pillar / category page. Existing
// anchors, headings, and figure blocks are protected from being touched.
// One auto-link per destination URL per article (no spammy repetition).

interface LinkRule {
  pattern: RegExp;
  href: string;
}

// Order matters: longest / most specific patterns must come before shorter
// substrings to avoid "Meta Quest 3" being eaten by a generic "Quest" rule.
// Each pattern is tried in order; the first one that finds an unprotected
// match wins for that destination.
const RULES: LinkRule[] = [
  { pattern: /\bMeta Quest 3 Pro\b/i, href: "/best-vr-headsets" },
  { pattern: /\bMeta Quest 3\b/i, href: "/best-vr-headsets" },
  { pattern: /\bMeta Quest 2\b/i, href: "/best-vr-headsets" },
  { pattern: /\bApple Vision Pro\b/i, href: "/best-vr-headsets" },
  { pattern: /\bVision Pro\b/i, href: "/best-vr-headsets" },
  { pattern: /\bPSVR ?2\b/i, href: "/best-vr-headsets" },
  { pattern: /\bPlayStation VR2\b/i, href: "/best-vr-headsets" },
  { pattern: /\bValve Index\b/i, href: "/best-vr-headsets" },
  { pattern: /\bBigscreen Beyond\b/i, href: "/best-vr-headsets" },
  { pattern: /\bPico 4(?: Ultra)?\b/i, href: "/best-vr-headsets" },
  { pattern: /\bbest VR headsets?\b/i, href: "/best-vr-headsets" },

  { pattern: /\bAndroid XR\b/i, href: "/xr" },
  { pattern: /\bSamsung Galaxy Glasses\b/i, href: "/xr" },
  { pattern: /\bspatial computing\b/i, href: "/xr" },
  { pattern: /\bWebXR\b/i, href: "/xr" },
  { pattern: /\bOpenXR\b/i, href: "/xr" },

  { pattern: /\bRay-Ban Meta\b/i, href: "/ar-glasses" },
  { pattern: /\bsmart glasses\b/i, href: "/ar-glasses" },
  { pattern: /\bAR glasses\b/i, href: "/ar-glasses" },

  { pattern: /\bBeat Saber\b/i, href: "/best-vr-games" },
  { pattern: /\bHalf-Life: Alyx\b/i, href: "/best-vr-games" },
  { pattern: /\bAsgard'?s Wrath 2\b/i, href: "/best-vr-games" },
  { pattern: /\bbest VR games?\b/i, href: "/best-vr-games-2026" },

  { pattern: /\bHorizon Worlds\b/i, href: "/software" },
  { pattern: /\bbest VR apps\b/i, href: "/best-vr-apps" },
  { pattern: /\bVR fitness\b/i, href: "/best-vr-fitness" },
];

const PROTECTED_BLOCK =
  /<a\b[^>]*>[\s\S]*?<\/a>|<h[1-6]\b[^>]*>[\s\S]*?<\/h[1-6]>|<figure\b[^>]*>[\s\S]*?<\/figure>/gi;

// Sentinel placeholder for protected blocks. The prefix is unique enough
// not to collide with article content, and brackets keep keyword regexes
// (all of which use \b word boundaries) from matching across it.
const PLACEHOLDER_RE = /\[\[VRORGLINKPH(\d+)\]\]/g;

export function injectInternalLinks(
  html: string,
  currentPath?: string
): string {
  const protectedBlocks: string[] = [];
  const placeholder = (i: number) => `[[VRORGLINKPH${i}]]`;

  let working = html.replace(PROTECTED_BLOCK, (m) => {
    const idx = protectedBlocks.length;
    protectedBlocks.push(m);
    return placeholder(idx);
  });

  const usedHrefs = new Set<string>();
  for (const rule of RULES) {
    if (currentPath && rule.href === currentPath) continue;
    if (usedHrefs.has(rule.href)) continue;

    let replaced = false;
    working = working.replace(rule.pattern, (match) => {
      replaced = true;
      const wrapped = `<a class="internal-link" href="${rule.href}">${match}</a>`;
      const idx = protectedBlocks.length;
      protectedBlocks.push(wrapped);
      return placeholder(idx);
    });
    if (replaced) usedHrefs.add(rule.href);
  }

  return working.replace(
    PLACEHOLDER_RE,
    (_, i) => protectedBlocks[Number(i)]
  );
}
