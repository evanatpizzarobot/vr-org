interface Guide {
  label: string;
  href: string;
  description: string;
}

const PILLAR_GUIDES: Record<string, Guide> = {
  "best-vr-headsets": {
    label: "Best VR Headsets 2026",
    href: "/best-vr-headsets",
    description: "Our complete buyer's guide to every major VR headset.",
  },
  "best-budget-vr-headset": {
    label: "Best Budget VR Headset 2026",
    href: "/best-budget-vr-headset",
    description: "The cheapest ways into VR under $400, new and used.",
  },
  "best-vr-games": {
    label: "Top 10 VR Games of All Time",
    href: "/best-vr-games",
    description: "The definitive ranking of the greatest VR games ever made.",
  },
  "best-vr-games-2026": {
    label: "Best VR Games of 2026",
    href: "/best-vr-games-2026",
    description: "The top VR games and upcoming releases for 2026.",
  },
  "best-vr-apps": {
    label: "Best VR Apps & Utilities",
    href: "/best-vr-apps",
    description: "Essential VR software for productivity, social, and fitness.",
  },
  "best-vr-fitness": {
    label: "Best VR Fitness Apps 2026",
    href: "/best-vr-fitness",
    description: "Top VR workout apps that actually replace the gym.",
  },
  "ar-glasses": {
    label: "Best AR Glasses 2026",
    href: "/ar-glasses",
    description: "Every major AR smart glasses device compared.",
  },
  "vr-for-beginners": {
    label: "VR for Beginners",
    href: "/vr-for-beginners",
    description: "Everything a first-time VR buyer needs to know.",
  },
  "what-is-vr": {
    label: "What is Virtual Reality?",
    href: "/what-is-vr",
    description: "A plain-English explainer on how VR actually works.",
  },
  "quest-3-vs-quest-3s": {
    label: "Quest 3 vs Quest 3S",
    href: "/quest-3-vs-quest-3s",
    description: "Same chip and games, $250 apart. Which Quest to buy.",
  },
  "quest-3-vs-vision-pro": {
    label: "Quest 3 vs Apple Vision Pro",
    href: "/quest-3-vs-vision-pro",
    description: "A $599 gaming headset versus a $3,499 spatial computer.",
  },
  "psvr2-vs-quest-3": {
    label: "PSVR2 vs Quest 3",
    href: "/psvr2-vs-quest-3",
    description: "OLED that needs a PS5 versus standalone freedom.",
  },
  "best-vr-headset-for-kids": {
    label: "Best VR Headset for Kids",
    href: "/best-vr-headset-for-kids",
    description: "Safe, age-appropriate VR picks and what to avoid.",
  },
  "best-pc-vr-headset": {
    label: "Best PC VR Headset 2026",
    href: "/best-pc-vr-headset",
    description: "Top headsets for SteamVR and PC gaming, wired and wireless.",
  },
  "best-standalone-vr-headset": {
    label: "Best Standalone VR Headset 2026",
    href: "/best-standalone-vr-headset",
    description: "All-in-one VR with no PC or console required.",
  },
  "upcoming-vr-headsets-2026": {
    label: "Upcoming VR Headsets 2026",
    href: "/upcoming-vr-headsets-2026",
    description: "New releases and what's coming next, tracked.",
  },
  "vr-release-dates": {
    label: "VR Release Dates 2026",
    href: "/vr-release-dates",
    description: "Every upcoming headset, game, and accessory, dated and tracked.",
  },
  "steam-frame": {
    label: "Valve Steam Frame: Everything We Know",
    href: "/steam-frame",
    description: "Release date signals, price expectations, and specs, updated.",
  },
  "best-vr-headset-for-gaming": {
    label: "Best VR Headset for Gaming",
    href: "/best-vr-headset-for-gaming",
    description: "Quest 3, Quest 3S, PSVR2, and PC VR ranked for players.",
  },
  "highest-resolution-vr-headset": {
    label: "Highest Resolution VR Headset",
    href: "/highest-resolution-vr-headset",
    description: "The sharpest displays ranked, and why PPD beats raw pixels.",
  },
  "best-vr-headset-for-movies": {
    label: "Best VR Headset for Movies",
    href: "/best-vr-headset-for-movies",
    description: "A giant personal cinema in VR, top picks for films.",
  },
  "best-vr-headset-for-sim-racing": {
    label: "Best VR Headset for Sim Racing",
    href: "/best-vr-headset-for-sim-racing",
    description: "Clarity and field of view picks for iRacing and ACC.",
  },
};

const TAG_TO_GUIDES: Record<string, string[]> = {
  gaming: ["best-vr-games-2026", "best-vr-games", "best-vr-headsets"],
  hardware: ["best-vr-headsets", "best-budget-vr-headset", "ar-glasses"],
  software: ["best-vr-apps", "best-vr-fitness", "best-vr-headsets"],
  xr: ["best-vr-apps", "ar-glasses", "best-vr-headsets"],
  ar: ["ar-glasses", "best-vr-headsets", "best-vr-apps"],
  enterprise: ["best-vr-apps", "best-vr-headsets", "what-is-vr"],
  fitness: ["best-vr-fitness", "best-vr-apps", "best-vr-headsets"],
};

function pickGuides(tags: string[], exclude?: string): Guide[] {
  const keys = new Set<string>();
  for (const tag of tags) {
    const mapped = TAG_TO_GUIDES[tag];
    if (!mapped) continue;
    for (const k of mapped) {
      if (exclude && k === exclude) continue;
      keys.add(k);
      if (keys.size >= 3) break;
    }
    if (keys.size >= 3) break;
  }
  if (keys.size === 0) {
    ["best-vr-headsets", "best-vr-games-2026", "what-is-vr"].forEach((k) => {
      if (exclude && k === exclude) return;
      keys.add(k);
    });
  }
  return Array.from(keys)
    .map((k) => PILLAR_GUIDES[k])
    .filter(Boolean);
}

export function RelatedGuides({
  tags,
  exclude,
  heading = "VR.org Guides",
}: {
  tags: string[];
  exclude?: string;
  heading?: string;
}) {
  const guides = pickGuides(tags, exclude);
  if (guides.length === 0) return null;

  return (
    <aside
      className="mt-12 pt-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <h2
        className="font-display text-[13px] font-semibold uppercase tracking-[2px] mb-4"
        style={{ color: "var(--accent-cyan)" }}
      >
        {heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {guides.map((guide) => (
          <a
            key={guide.href}
            href={guide.href}
            className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden hover:translate-y-[-1px]"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
              padding: "16px 20px",
            }}
          >
            <div
              className="font-display font-semibold text-[15px] leading-[1.4] mb-1 group-hover:!text-[var(--accent-cyan)] transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              {guide.label}
            </div>
            <div
              className="text-[12px] leading-[1.5]"
              style={{ color: "var(--text-secondary)" }}
            >
              {guide.description}
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
}

export function AllPillarGuides({
  exclude,
  heading = "More VR Guides",
}: {
  exclude?: string;
  heading?: string;
}) {
  const guides = Object.entries(PILLAR_GUIDES)
    .filter(([key]) => key !== exclude)
    .map(([, guide]) => guide);

  return (
    <aside
      className="mt-12 pt-8"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      <h2
        className="font-display text-[13px] font-semibold uppercase tracking-[2px] mb-4"
        style={{ color: "var(--accent-cyan)" }}
      >
        {heading}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {guides.map((guide) => (
          <a
            key={guide.href}
            href={guide.href}
            className="block rounded-[10px] border no-underline transition-all group relative overflow-hidden hover:translate-y-[-1px]"
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border)",
              padding: "16px 20px",
            }}
          >
            <div
              className="font-display font-semibold text-[15px] leading-[1.4] mb-1 group-hover:!text-[var(--accent-cyan)] transition-colors"
              style={{ color: "var(--text-primary)" }}
            >
              {guide.label}
            </div>
            <div
              className="text-[12px] leading-[1.5]"
              style={{ color: "var(--text-secondary)" }}
            >
              {guide.description}
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
}
