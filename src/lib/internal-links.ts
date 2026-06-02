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
  // Headsets -> /best-vr-headsets (most specific names first)
  { pattern: /\bMeta Quest 3 Pro\b/i, href: "/best-vr-headsets" },
  { pattern: /\bMeta Quest 3S\b/i, href: "/best-vr-headsets" },
  { pattern: /\bMeta Quest 3\b/i, href: "/best-vr-headsets" },
  { pattern: /\bMeta Quest 2\b/i, href: "/best-vr-headsets" },
  { pattern: /\bQuest 4\b/i, href: "/best-vr-headsets" },
  { pattern: /\bApple Vision Pro\b/i, href: "/best-vr-headsets" },
  { pattern: /\bVision Pro\b/i, href: "/best-vr-headsets" },
  { pattern: /\bPSVR ?2\b/i, href: "/best-vr-headsets" },
  { pattern: /\bPlayStation VR2\b/i, href: "/best-vr-headsets" },
  { pattern: /\bValve Index\b/i, href: "/best-vr-headsets" },
  { pattern: /\bSteam Frame\b/i, href: "/best-vr-headsets" },
  { pattern: /\bBigscreen Beyond\b/i, href: "/best-vr-headsets" },
  { pattern: /\bPico 4(?: Ultra)?\b/i, href: "/best-vr-headsets" },
  { pattern: /\bbest VR headsets?\b/i, href: "/best-vr-headsets" },

  // AR glasses -> /ar-glasses
  { pattern: /\bRay-Ban (?:Meta|Display)\b/i, href: "/ar-glasses" },
  { pattern: /\bsmart glasses\b/i, href: "/ar-glasses" },
  { pattern: /\bAR glasses\b/i, href: "/ar-glasses" },
  { pattern: /\bXreal\b/i, href: "/ar-glasses" },
  { pattern: /\bRokid\b/i, href: "/ar-glasses" },
  { pattern: /\bViture\b/i, href: "/ar-glasses" },

  // XR / spatial -> /xr
  { pattern: /\bAndroid XR\b/i, href: "/xr" },
  { pattern: /\bSamsung Galaxy (?:Glasses|XR)\b/i, href: "/xr" },
  { pattern: /\bProject Moohan\b/i, href: "/xr" },
  { pattern: /\bspatial computing\b/i, href: "/xr" },
  { pattern: /\bWebXR\b/i, href: "/xr" },
  { pattern: /\bOpenXR\b/i, href: "/xr" },

  // First-time buyers -> /vr-for-beginners
  { pattern: /\bnew to VR\b/i, href: "/vr-for-beginners" },
  { pattern: /\bfirst VR headset\b/i, href: "/vr-for-beginners" },
  { pattern: /\bgetting started (?:with|in) VR\b/i, href: "/vr-for-beginners" },
  { pattern: /\bVR for beginners\b/i, href: "/vr-for-beginners" },

  // All-time greats -> /best-vr-games
  { pattern: /\bHalf-Life: Alyx\b/i, href: "/best-vr-games" },
  { pattern: /\bBeat Saber\b/i, href: "/best-vr-games" },
  { pattern: /\bAsgard'?s Wrath 2\b/i, href: "/best-vr-games" },

  // 2026 releases -> /best-vr-games-2026 (distinctive titles only, to avoid mislinking common words)
  { pattern: /\bBatman: Arkham Shadow\b/i, href: "/best-vr-games-2026" },
  { pattern: /\bMetro Awakening\b/i, href: "/best-vr-games-2026" },
  { pattern: /\bAlien: Rogue Incursion\b/i, href: "/best-vr-games-2026" },
  { pattern: /\bDeadpool VR\b/i, href: "/best-vr-games-2026" },
  { pattern: /\bbest VR games?\b/i, href: "/best-vr-games-2026" },

  // Fitness apps -> /best-vr-fitness (Supernatural case-sensitive so "supernatural" prose does not match)
  { pattern: /\bSupernatural\b/, href: "/best-vr-fitness" },
  { pattern: /\bFitXR\b/i, href: "/best-vr-fitness" },
  { pattern: /\bLes Mills\b/i, href: "/best-vr-fitness" },
  { pattern: /\bVR fitness\b/i, href: "/best-vr-fitness" },

  // Apps / utilities -> /best-vr-apps (Immersed case-sensitive so "immersed" prose does not match)
  { pattern: /\bVirtual Desktop\b/i, href: "/best-vr-apps" },
  { pattern: /\bVRChat\b/i, href: "/best-vr-apps" },
  { pattern: /\bRec Room\b/i, href: "/best-vr-apps" },
  { pattern: /\bImmersed\b/, href: "/best-vr-apps" },
  { pattern: /\bbest VR apps\b/i, href: "/best-vr-apps" },

  // Social platform -> /software
  { pattern: /\bHorizon Worlds\b/i, href: "/software" },

  // Generic concept fallback -> /what-is-vr (last; fires only if no other rule claimed this href)
  { pattern: /\bvirtual reality\b/i, href: "/what-is-vr" },
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
