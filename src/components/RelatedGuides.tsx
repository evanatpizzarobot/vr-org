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
};

const TAG_TO_GUIDES: Record<string, string[]> = {
  gaming: ["best-vr-games-2026", "best-vr-games", "best-vr-headsets"],
  hardware: ["best-vr-headsets", "ar-glasses", "vr-for-beginners"],
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
