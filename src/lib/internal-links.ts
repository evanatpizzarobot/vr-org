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
  // Headset comparisons -> dedicated /x-vs-y pages (literal "vs" phrasing, most specific first)
  { pattern: /\b(?:Meta )?Quest 3S? vs\.? (?:the |Meta )?Quest 3S?\b/i, href: "/quest-3-vs-quest-3s" },
  { pattern: /\b(?:Meta )?Quest 3 vs\.? (?:the |Apple )?Vision Pro\b/i, href: "/quest-3-vs-vision-pro" },
  { pattern: /\b(?:Apple )?Vision Pro vs\.? (?:the |Meta )?Quest 3\b/i, href: "/quest-3-vs-vision-pro" },
  { pattern: /\bPSVR ?2 vs\.? (?:the |Meta )?Quest 3\b/i, href: "/psvr2-vs-quest-3" },
  { pattern: /\b(?:Valve )?Steam Frame vs\.? (?:the |Meta )?Quest 3\b/i, href: "/steam-frame-vs-quest-3" },
  { pattern: /\b(?:Meta )?Quest 3 vs\.? (?:the |Valve )?Steam Frame\b/i, href: "/steam-frame-vs-quest-3" },
  { pattern: /\bMeta Connect(?: 2026)?\b(?! 20(?:1\d|2[0-5]))/i, href: "/meta-connect-2026" },
  { pattern: /\b(?:Meta )?Quest 3 vs\.? (?:the )?PSVR ?2\b/i, href: "/psvr2-vs-quest-3" },

  // Headset spokes by segment / intent -> specific spoke pages (BEFORE the generic hub rule)
  { pattern: /\bBigscreen Beyond\b/i, href: "/best-pc-vr-headset" },
  { pattern: /\bPimax\b/i, href: "/best-pc-vr-headset" },
  { pattern: /\bPC ?VR headsets?\b/i, href: "/best-pc-vr-headset" },
  { pattern: /\bSteam Frame\b/i, href: "/steam-frame" },
  { pattern: /\bupcoming VR headsets?\b/i, href: "/upcoming-vr-headsets-2026" },

  // Release-date intent -> /vr-release-dates tracker
  { pattern: /\bVR release dates?\b/i, href: "/vr-release-dates" },
  { pattern: /\brelease dates? (?:for|of) (?:VR|upcoming)\b/i, href: "/vr-release-dates" },
  { pattern: /\b(?:VR|XR) (?:games?|headsets?|hardware) coming (?:out|in|to)\b/i, href: "/vr-release-dates" },
  { pattern: /\bupcoming (?:VR|XR) (?:games?|releases?|launches)\b/i, href: "/vr-release-dates" },
  { pattern: /\bProject Swan\b/i, href: "/highest-resolution-vr-headset" },
  { pattern: /\bmicro-?OLED\b/i, href: "/highest-resolution-vr-headset" },
  { pattern: /\bsim[ -]?racing\b/i, href: "/best-vr-headset-for-sim-racing" },
  { pattern: /\biRacing\b/i, href: "/best-vr-headset-for-sim-racing" },
  { pattern: /\bstandalone (?:VR )?headsets?\b/i, href: "/best-standalone-vr-headset" },
  { pattern: /\bbudget VR headsets?\b/i, href: "/best-budget-vr-headset" },
  { pattern: /\bVR headsets? for kids\b/i, href: "/best-vr-headset-for-kids" },
  { pattern: /\bVR headsets? for (?:movies|watching)\b/i, href: "/best-vr-headset-for-movies" },
  { pattern: /\bVR headset for gaming\b/i, href: "/best-vr-headset-for-gaming" },

  // Flagship headsets + generic -> /best-vr-headsets (hub)
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

// Floor rule: if no RULE above matched in unprotected prose, link the first
// VR/headset mention to the explainer so no article ships with zero in-body
// pillar links. Broader than the rules so it catches articles that only use
// generic terms ("the headset", bare "VR").
const FLOOR_RULE: LinkRule = {
  pattern: /\bvirtual reality\b|\bVR headsets?\b|\bheadsets?\b|\bVR\b/i,
  href: "/what-is-vr",
};

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
  // Cap total auto-injected links per article so listicle-style originals that
  // match many rules are not over-linked. Most articles only match a few.
  const MAX_LINKS = 6;
  for (const rule of RULES) {
    if (usedHrefs.size >= MAX_LINKS) break;
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

  // Floor: some articles only mention linkable terms inside headings/figures
  // (which are protected), so no rule fires and the body would ship with zero
  // in-body links to a pillar page. Guarantee at least one by linking the first
  // unprotected VR/headset mention to the explainer.
  if (usedHrefs.size === 0 && FLOOR_RULE.href !== currentPath) {
    working = working.replace(FLOOR_RULE.pattern, (match) => {
      const wrapped = `<a class="internal-link" href="${FLOOR_RULE.href}">${match}</a>`;
      const idx = protectedBlocks.length;
      protectedBlocks.push(wrapped);
      return placeholder(idx);
    });
  }

  return working.replace(
    PLACEHOLDER_RE,
    (_, i) => protectedBlocks[Number(i)]
  );
}
