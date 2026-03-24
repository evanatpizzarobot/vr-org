export interface TopListItem {
  rank: number;
  title: string;
  subtitle: string;
}

export interface TopList {
  title: string;
  icon: string;
  href: string;
  items: TopListItem[];
}

export const TOP_VR_GAMES_2026: TopList = {
  title: "Top VR Games 2026",
  icon: "\uD83C\uDFAE",
  href: "/best-vr-games-2026",
  items: [
    { rank: 1, title: "Batman: Arkham Shadow", subtitle: "Quest" },
    { rank: 2, title: "Resident Evil Requiem", subtitle: "PC VR (mod)" },
    { rank: 3, title: "Little Nightmares VR", subtitle: "TBA" },
    { rank: 4, title: "Star Trek: Infection", subtitle: "Quest / PC VR" },
    { rank: 5, title: "TMNT VR", subtitle: "Quest" },
    { rank: 6, title: "Aces of Thunder", subtitle: "PC VR / PSVR 2" },
    { rank: 7, title: "MS Flight Sim VR", subtitle: "PSVR 2" },
    { rank: 8, title: "Skydance's Behemoth", subtitle: "Quest / PC VR" },
    { rank: 9, title: "Alien: Rogue Incursion", subtitle: "Quest / PC VR" },
    { rank: 10, title: "Metro Awakening VR", subtitle: "Quest / PC VR" },
  ],
};

export const TOP_VR_APPS: TopList = {
  title: "Top VR Apps & Utilities",
  icon: "\uD83D\uDEE0\uFE0F",
  href: "/best-vr-apps",
  items: [
    { rank: 1, title: "Virtual Desktop", subtitle: "Wireless PC VR streaming" },
    { rank: 2, title: "Immersed", subtitle: "Multi-monitor workspace" },
    { rank: 3, title: "VRChat", subtitle: "Social VR platform" },
    { rank: 4, title: "Bigscreen", subtitle: "Virtual cinema & desktop" },
    { rank: 5, title: "Gravity Sketch", subtitle: "3D design & modeling" },
    { rank: 6, title: "Wander", subtitle: "Explore the world in VR" },
    { rank: 7, title: "ShapesXR", subtitle: "Spatial design prototyping" },
    { rank: 8, title: "Rec Room", subtitle: "Social creation platform" },
    { rank: 9, title: "FitXR", subtitle: "VR fitness workouts" },
    { rank: 10, title: "Resolve", subtitle: "VR meditation & wellness" },
  ],
};
