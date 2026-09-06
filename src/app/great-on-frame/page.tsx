import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  StructuredData,
  breadcrumbSchema,
  faqPageSchema,
  itemListSchema,
} from "@/components/StructuredData";
import { RecentArticles } from "@/components/RecentArticles";
import { AllPillarGuides } from "@/components/RelatedGuides";
import { AdSlot } from "@/components/AdSlot";
import { AD_SLOTS } from "@/lib/ads";
import { ComparisonTable, FaqSection } from "@/components/SpokeBlocks";

export const metadata = {
  title: "Great on Frame: Every Verified Steam Frame Game So Far | VR.org",
  description:
    "Valve's Great on Frame page collects every game certified for the Steam Frame headset. The full verified list so far, what the 72 fps certification requires, and every addition tracked as the catalog grows.",
  openGraph: {
    title: "Great on Frame: Every Verified Steam Frame Game So Far | VR.org",
    description:
      "The full Great on Frame list, what Steam Frame Verified certification requires, and every new addition tracked.",
    url: "https://vr.org/great-on-frame",
    siteName: "VR.org",
    images: [
      {
        url: "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
        width: 1920,
        height: 1080,
        alt: "Valve Steam Frame standalone VR headset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Great on Frame: Every Verified Steam Frame Game So Far",
    description:
      "The full Great on Frame list and every new addition, tracked by VR.org.",
    images: ["https://vr.org/article-images/steam-frame/steam-frame-headset.jpg"],
  },
  alternates: {
    canonical: "https://vr.org/great-on-frame",
  },
};

const LAST_UPDATED = "2026-09-06";

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Great on Frame: Every Steam Frame Verified Game, Tracked",
  datePublished: "2026-07-17",
  dateModified: LAST_UPDATED,
  author: { "@type": "Organization", name: "VR.org", url: "https://vr.org" },
  publisher: {
    "@type": "Organization",
    name: "VR.org",
    url: "https://vr.org",
    logo: { "@type": "ImageObject", url: "https://vr.org/logo.png" },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://vr.org/great-on-frame",
  },
  image: "https://vr.org/article-images/steam-frame/steam-frame-headset.jpg",
};

const breadcrumbs = breadcrumbSchema([
  { name: "Home", url: "https://vr.org" },
  { name: "Valve Steam Frame", url: "https://vr.org/steam-frame" },
  { name: "Great on Frame", url: "https://vr.org/great-on-frame" },
]);

interface VerifiedGame {
  name: string;
  developer: string;
  type: "VR" | "Flatscreen";
  added: string;
  status?: "Verified" | "Unsupported";
  note: string;
}

// Source of truth for the verified list. Append on every addition and mirror
// each change in the CHANGELOG below; the audit registry tracks this page on a
// 14-day cadence but the real cadence is every catalog beat until launch.
const VERIFIED_GAMES: VerifiedGame[] = [
  {
    name: "The Lab",
    developer: "Valve",
    type: "VR",
    added: "Jul 13, 2026",
    status: "Unsupported",
    note: "Valve's 2016 VR minigame collection was one of the first titles certified, then cut from category 3 to Unsupported on July 29 and moved onto an ARM64 Proton runtime on August 5. Valve's own VR showcase currently fails the bar a free Half-Life 2 mod cleared.",
  },
  {
    name: "Aperture Hand Lab",
    developer: "Valve",
    type: "VR",
    added: "Jul 13, 2026",
    note: "The 2019 hand-interaction demo built to show off Index controller finger tracking, recertified for the Frame's controllers.",
  },
  {
    name: "Portal 2",
    developer: "Valve",
    type: "Flatscreen",
    added: "Jul 13, 2026",
    note: "Not a VR game at all. Its badge covers standalone flatscreen play on-device through Proton, with full Frame controller support.",
  },
  {
    name: "Into Black",
    developer: "The Binary Mill",
    type: "VR",
    added: "Jul 13, 2026",
    note: "The cave-diving VR adventure was one of the first third-party games certified, a strong pick for showing off on-device rendering.",
  },
  {
    name: "Titan Isles",
    developer: "Psytec Games",
    type: "VR",
    added: "Jul 13, 2026",
    note: "A VR adventure from the studio behind Windlands, a series practically built on smooth locomotion holding a high frame rate.",
  },
  {
    name: "Underdogs",
    developer: "One Hamsa",
    type: "VR",
    added: "Jul 14, 2026",
    note: "The physical mech brawler is one of the most demanding arm-workout games in VR, which makes holding the certification target through a full match a real statement.",
  },
  {
    name: "Ancient Dungeon",
    developer: "Eric Thullen",
    type: "VR",
    added: "Jul 14, 2026",
    note: "The solo-developed voxel roguelite that punches far above its weight. A natural fit for standalone hardware.",
  },
  {
    name: "Slots & Diapers",
    developer: "Independent",
    type: "Flatscreen",
    added: "Jul 14, 2026",
    note: "Like Portal 2, a flatscreen title. Its inclusion signals Valve wants the Frame judged as a general Steam machine, not only a VR headset.",
  },
  {
    name: "Half-Life 2: VR Mod",
    developer: "Source VR Mod Team",
    type: "VR",
    added: "Aug 6, 2026",
    note: "A free community mod, not a Valve product, and the highest-profile title on the list. It cleared certification the same week Valve's own The Lab lost it.",
  },
  {
    name: "SUPERHOT VR",
    developer: "SUPERHOT Team",
    type: "VR",
    added: "By Aug 10, 2026",
    note: "The time-moves-when-you-move shooter is stylized enough to hold frame rate on mobile silicon, which is why it has shipped on essentially every standalone headset.",
  },
  {
    name: "Arizona Sunshine VR Remake",
    developer: "Vertigo Games",
    type: "VR",
    added: "By Aug 10, 2026",
    note: "The 2023 rebuild of the zombie shooter, already tuned for standalone hardware once before.",
  },
  {
    name: "Arizona Sunshine VR 2",
    developer: "Vertigo Games",
    type: "VR",
    added: "By Aug 10, 2026",
    note: "The sequel joining its predecessor means Vertigo certified a back catalog rather than a single showcase title.",
  },
  {
    name: "Deadly Delivery",
    developer: "Flat Head Studio",
    type: "VR",
    added: "By Aug 10, 2026",
    note: "A smaller independent VR title, the kind of listing that suggests certification is now open to studios without a Valve relationship.",
  },
  {
    name: "Escape Simulator",
    developer: "Pine Studio",
    type: "Flatscreen",
    added: "By Aug 10, 2026",
    note: "Ships with a VR mode, but its badge covers on-device flatscreen play. Its sequel entered open beta this month.",
  },
  {
    name: "Balatro",
    developer: "LocalThunk",
    type: "Flatscreen",
    added: "By Aug 10, 2026",
    note: "The poker roguelike runs on a toaster, so certifying it is less a performance claim than a statement that the Frame is a place you play normal Steam games.",
  },
  {
    name: "Hollow Knight: Silksong",
    developer: "Team Cherry",
    type: "Flatscreen",
    added: "By Aug 10, 2026",
    note: "One of the biggest flatscreen releases of the past year appearing here matters more for the Frame's positioning than any VR title on the list.",
  },
  {
    name: "Hades",
    developer: "Supergiant Games",
    type: "Flatscreen",
    added: "By Aug 10, 2026",
    note: "A Deck Verified staple making the same jump, which is roughly how Valve ran the Steam Deck catalog playbook.",
  },
  {
    name: "Hades II",
    developer: "Supergiant Games",
    type: "Flatscreen",
    added: "By Aug 10, 2026",
    note: "The sequel certified alongside the original.",
  },
  {
    name: "Cuphead",
    developer: "Studio MDHR",
    type: "Flatscreen",
    added: "By Aug 10, 2026",
    note: "Hand-drawn 2D that has never been demanding, and a familiar name on a shelf Valve needs to look stocked.",
  },
  {
    name: "Brotato",
    developer: "Blobfish",
    type: "Flatscreen",
    added: "By Aug 10, 2026",
    note: "A cheap, short-session arena roguelite, the exact profile of a game people actually play on portable hardware.",
  },
  {
    name: "RACCOIN: Coin Pusher Roguelike",
    developer: "Doraccoon",
    type: "Flatscreen",
    added: "By Aug 10, 2026",
    note: "A 2026 release rather than a back-catalog port, which suggests new games are now certifying at launch.",
  },
  {
    name: "Space Pirate Trainer",
    developer: "I-Illusions",
    type: "VR",
    added: "Aug 24, 2026",
    note: "The 2017 arcade wave shooter was on the shelf at the original Vive launch and is one of the few VR games older than the Index still being certified for new hardware. A fixed-position shooter is also the easiest possible case for holding 72 fps.",
  },
  {
    name: "HARD BULLET",
    developer: "GexagonVR",
    type: "VR",
    added: "Aug 24, 2026",
    note: "A physics sandbox built on ragdolls, slow motion and dismemberment, which is a heavier simulation load than anything else certified so far. Its badge is the most surprising entry on the list.",
  },
  {
    name: "Forefront",
    developer: "Triangle Factory",
    type: "VR",
    added: "Aug 24, 2026",
    note: "The large-scale multiplayer shooter from the Breachers studio. Certifying a networked shooter means the target holds with other players in the scene, not just in a demo room.",
  },
  {
    name: "Moss: The Forgotten Relic",
    developer: "Polyarc and Blackbird Interactive",
    type: "Flatscreen",
    added: "Aug 24, 2026",
    note: "Polyarc built its name on the VR Moss games, and the entry it got certified here is the flatscreen July 2026 release. Steam lists no VR category on it at all, which makes a VR-native studio a flatscreen data point.",
  },
  {
    name: "Drunken Rogue",
    developer: "2.6 billion years studio",
    type: "Flatscreen",
    added: "Aug 24, 2026",
    note: "Released August 20 and certified within days, which suggests developers are now submitting at launch rather than being swept up later.",
  },
  {
    name: "DR LIVESEY ROM AND DEATH EDITION",
    developer: "Agafonoff",
    type: "Flatscreen",
    added: "Aug 24, 2026",
    note: "A 2023 meme brawler. Nothing about the certification bar is curatorial; if a flatscreen game runs at 720p30 with working controller support, it qualifies.",
  },
  {
    name: "Funi Raccoon Game",
    developer: "Crayon and Kit",
    type: "Flatscreen",
    added: "Aug 24, 2026",
    note: "One of several small 2026 indies picked up in the August wave, alongside RACCOIN.",
  },
  {
    name: "Beat Saber",
    developer: "Beat Games",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Walkabout Mini Golf VR",
    developer: "Mighty Coconut",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Job Simulator",
    developer: "Owlchemy Labs",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Moss II VR",
    developer: "Polyarc",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Synth Riders",
    developer: "Kluge Interactive",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Vacation Simulator",
    developer: "Owlchemy Labs",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "The Light Brigade: Definitive Edition",
    developer: "Funktronic Labs",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "I Expect You To Die 3: Cog in the Machine",
    developer: "Schell Games",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Pistol Whip",
    developer: "Cloudhead Games Ltd.",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "I Expect You To Die",
    developer: "Schell Games",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "The Room VR: A Dark Matter",
    developer: "Fireproof Games",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "I Expect You To Die 2: The Spy and the Liar",
    developer: "Schell Games",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Red Matter 2",
    developer: "Vertical Robot",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Eleven Table Tennis",
    developer: "For Fun Labs",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Red Matter",
    developer: "Vertical Robot",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "The Last Clockwinder",
    developer: "Pontoco",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "THRASHER",
    developer: "Puddle",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Cubism",
    developer: "Thomas Van Bouwel",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Vendetta Forever",
    developer: "Meatspace Interactive",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Pavlov Shack",
    developer: "Vankrupt Games",
    type: "VR",
    added: "Aug 27, 2026",
    note: "Certified in the late-August wave that brought the first marquee VR names onto the list.",
  },
  {
    name: "Factorio",
    developer: "Wube Software LTD.",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "DAVE THE DIVER",
    developer: "MINTROCKET",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Teenage Mutant Ninja Turtles: Shredder's Revenge",
    developer: "Tribute Games Inc.",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Keep Talking and Nobody Explodes",
    developer: "Steel Crate Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Is This Seat Taken?",
    developer: "Poti Poti Studio",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "ANIMAL WELL",
    developer: "Billy Basso",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Streets of Rage 4",
    developer: "Dotemu, Guard Crush",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "XENOTILT: HOSTILE PINBALL ACTION",
    developer: "WIZNWAR, FLARB LLC",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Dungeons of Eternity",
    developer: "Othergate",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Shelldiver",
    developer: "Gagonfe",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "INSIDE",
    developer: "Playdead",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "IRON REBELLION",
    developer: "Black Beach Studio",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Legends of Dragaea: Idle Dungeons",
    developer: "Blast Programming",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Broforce",
    developer: "Free Lives",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Moss VR",
    developer: "Polyarc",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Dino Party",
    developer: "Studio Nachtwerk",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "ANNO: Mutationem",
    developer: "ThinkingStars",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Puzzling Places - 3D Jigsaw Sim",
    developer: "Realities.io Inc",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "VAIL",
    developer: "AEXLAB",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Little Nightmares VR: Altered Echoes",
    developer: "ICONIK",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Shattered Divinities",
    developer: "星魂游戏",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Whirlight - No Time To Trip",
    developer: "imaginarylab",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Deisim",
    developer: "Myron Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "fpsVR",
    developer: "SBSoftLab",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Zombiehood",
    developer: "Weak Spots, Dead Traveler",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Virtual Fighter Maneuvers",
    developer: "Boundless Dynamics, LLC",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Thumper",
    developer: "Drool",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "XeGrader plus",
    developer: "Tokihiro NAITO",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "APE OUT",
    developer: "Gabe Cuzzillo, Bennett Foddy",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Sphinx and the Cursed Mummy",
    developer: "Eurocom, THQ Nordic",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Sushi Ben",
    developer: "Big Brane Studios, Inc.",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Look Mum No Computer",
    developer: "The Bitfather",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Arcadium - Space Odyssey",
    developer: "Luciano Bercini",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Tiny Lands 2",
    developer: "Hyper Three Studio",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Resist",
    developer: "The Binary Mill",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Shave & Stuff",
    developer: "HyperVR Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Floor Plan 2 VR",
    developer: "Turbo Button",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Sweet Surrender VR",
    developer: "Salmi Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Blast Brigade vs. the Evil Legion of Dr. Cread",
    developer: "MY.GAMES",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Space Control",
    developer: "MoonMonster Studios",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Underworld Overseer",
    developer: "Myron Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "BAZOOKA: Rhythm Game",
    developer: "Gregory Seguru, Codrin Bradea",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Plot of the Druid",
    developer: "Yakir Israel, Adventure4Life Studios",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Mini Motor Racing X",
    developer: "The Binary Mill",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "SimplePlanes VR",
    developer: "Jundroo, LLC",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Gun Club VR",
    developer: "The Binary Mill",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Guinea Pig Runaway Together",
    developer: "DVS Interactive",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Climbey",
    developer: "Brian Lindenhof",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "GrowRilla VR",
    developer: "Salmi Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Vengeance Hunters",
    developer: "Nalua Studio SLU",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Spirit Talk - Cozy Visual Novel",
    developer: "Tortita Studio",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "E.Z",
    developer: "Totally Normal Creature",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Half-Life 2: VR Mod - Episode One",
    developer: "Source VR Mod Team",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Pixel Heroes: Byte & Magic",
    developer: "The Bitfather",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Bakahazard 3",
    developer: "流比奈梦工厂",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Ink Inside",
    developer: "Blackfield Entertainment LLC",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Forgotten Fragments",
    developer: "Binary Phoenix",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Racket Fury: Table Tennis VR",
    developer: "Pixel Edge Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Unloop",
    developer: "ThreeTrees.eu",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "First Person Hooper",
    developer: "Ejo",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Windlands",
    developer: "Psytec Games Ltd",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Connected Clue",
    developer: "Alpheratz Games ",
    type: "Flatscreen",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Quest for Runia",
    developer: "Cykyria",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Crystal Rift",
    developer: "Psytec Games Ltd",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Table Space: Board and Card Game Sandbox",
    developer: "Boxtree, Inc.",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Enigmo",
    developer: "Fortell Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "NotiVR",
    developer: "Matterworks Interactive",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "StarDrone: Sling Star (with VR mode)",
    developer: "Fortell Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Action Hero",
    developer: "Fast Travel Games",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Fruit Golf",
    developer: "Coal Car Studio Ltd.",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
  {
    name: "Stellar Cafe",
    developer: "AstroBeam",
    type: "VR",
    added: "Sep 6, 2026",
    note: "Observed on Valve's Great on Frame page on September 6, 2026, in the wave that took the count from 98 to 117.",
  },
];

interface ChangelogEntry {
  date: string;
  text: string;
}

const CHANGELOG: ChangelogEntry[] = [
  {
    date: "Sep 6, 2026",
    text: "Valve's page reports 117 matches, up from 98 on August 27. The filter counts read 75 Action, 55 Adventure, 50 Casual, 32 Simulation and 19 RPG. Titles now on the page that this table had not yet listed include Factorio, DAVE THE DIVER, Streets of Rage 4, ANIMAL WELL, INSIDE, Broforce and Teenage Mutant Ninja Turtles: Shredder's Revenge on the flatscreen side, and Windlands, Racket Fury, Dungeons of Eternity, IRON REBELLION and Puzzling Places in VR. Two of the headset's Steam backend packages were revised on September 3, the first change since May.",
  },
  {
    date: "Aug 27, 2026",
    text: "Valve's page reports 98 matches, up from 89 on August 24. The count matters less than the names: Beat Saber, Job Simulator, Vacation Simulator, Walkabout Mini Golf VR, Pistol Whip, Synth Riders, Red Matter and Red Matter 2, Moss II VR, The Room VR: A Dark Matter, The Last Clockwinder, Cubism, Eleven Table Tennis, THRASHER, Vendetta Forever, The Light Brigade: Definitive Edition and all three I Expect You To Die games are now certified. Pavlov Shack is on the list having only reached Steam on August 21.",
  },
  {
    date: "Aug 24, 2026",
    text: "Valve's page reports 89 matches, up from 65 on August 10. Every genre count moved: 55 Action, 41 Adventure, 32 Casual, 24 Simulation, and 16 RPG. Space Pirate Trainer, HARD BULLET and Forefront are the notable VR additions, and Polyarc's flatscreen Moss: The Forgotten Relic is certified while its VR games are not.",
  },
  {
    date: "Aug 10, 2026",
    text: "Valve's page reports 65 matches, up from eight on July 17. The filter panel breaks down to 40 Action, 32 Adventure, 24 Casual, 16 Simulation, and 8 RPG titles. Flatscreen catalog games now outnumber native VR ones.",
  },
  {
    date: "Aug 6, 2026",
    text: "Half-Life 2: VR Mod certified, the first community mod on the list and the highest-profile title on it.",
  },
  {
    date: "Aug 5, 2026",
    text: "The Lab moved onto an ARM64 Proton runtime, a week after losing its certification.",
  },
  {
    date: "Aug 3, 2026",
    text: "Road to VR counted more than 50 games and apps on the page.",
  },
  {
    date: "Jul 29, 2026",
    text: "The Lab downgraded from category 3 to Unsupported, making Valve's own VR showcase the most prominent failure on its own list.",
  },
  {
    date: "Jul 28, 2026",
    text: "Outside counts put the list at roughly 42 titles, up from eight in under two weeks.",
  },
  {
    date: "Jul 14, 2026",
    text: "Underdogs, Ancient Dungeon, and Slots & Diapers added, bringing the list to eight.",
  },
  {
    date: "Jul 13, 2026",
    text: "Great on Frame page discovered live on Steam with five titles: Portal 2, The Lab, Aperture Hand Lab, Into Black, and Titan Isles.",
  },
];

const gamesList = itemListSchema(
  "Great on Frame verified Steam Frame games",
  VERIFIED_GAMES.map((g) => ({ name: g.name }))
);

const faq = faqPageSchema([
  {
    question: "What is Great on Frame?",
    answer:
      "Great on Frame is a curated Steam storefront section, live at store.steampowered.com/greatonframe, that collects every game certified to run well on the Steam Frame, Valve's upcoming standalone VR headset. It is the VR sibling of Great on Deck, the label that told Steam Deck buyers which games would actually play well on the hardware.",
  },
  {
    question: "Which games are Great on Frame right now?",
    answer:
      "Valve's page reported 117 matches on September 6, 2026, up from 98 on August 27, 89 on August 24, 65 on August 10 and eight on July 17. Confirmed entries include Beat Saber, Job Simulator, Walkabout Mini Golf VR, Pistol Whip, Synth Riders, Red Matter 2, Moss II VR, The Room VR: A Dark Matter, the I Expect You To Die trilogy, Pavlov Shack, The Light Brigade: Definitive Edition, Half-Life 2: VR Mod, SUPERHOT VR, Space Pirate Trainer, HARD BULLET, Forefront, Arizona Sunshine VR Remake and VR 2, Into Black, Titan Isles, Underdogs, Ancient Dungeon, and Deadly Delivery on the VR side, plus flatscreen titles including Portal 2, Balatro, Hollow Knight: Silksong, Hades, Hades II, Cuphead, Brotato, Escape Simulator, and Moss: The Forgotten Relic. Flatscreen catalog games still outnumber native VR ones. Valve's own The Lab was downgraded to Unsupported on July 29.",
  },
  {
    question: "What does Steam Frame Verified require?",
    answer:
      "Standalone VR titles must hold at least 72 fps at 1728x1728 per eye during normal play, and anything rendering below 1440x1440 is marked Unsupported outright. Valve announced a 90 FPS target at GDC 2026 but quietly revised the published requirement down to 72 fps. Standalone flatscreen titles need at least 720p at 30 FPS with full Steam Frame controller support and a working default configuration. The badge is a recommendation rather than a gate.",
  },
  {
    question: "Why are flatscreen games like Portal 2 on a VR headset list?",
    answer:
      "The Steam Frame runs SteamOS and plays regular Steam games on-device through Proton, displayed on a virtual screen, with controllers that double as a gamepad. Certifying flatscreen titles signals that Valve wants the Frame treated as a portable Steam machine that also does VR, not a VR-only device.",
  },
  {
    question: "Do streamed PC VR games need the Great on Frame badge?",
    answer:
      "No. The certification applies to games running on the headset itself. Anything streamed from a gaming PC over the Frame's dedicated 6GHz wireless dongle is exempt, because performance there depends on your PC, not the headset.",
  },
  {
    question: "When does the Steam Frame come out?",
    answer:
      "Valve has confirmed summer 2026 but has not named a day or a price as of September 6, 2026, and summer ends September 22, which leaves 16 days. On September 3 two of the headset's Steam backend packages were revised for the first time since May, and Steam Machine packages changed six days before its lottery opened. The catalog going from eight titles to 117 in seven weeks is the other strong launch signal on the board, and Valve's own unboxing and setup videos leaked out of the Steam client on August 19. Storefront shelves fill weeks before a product ships, not quarters. Our Steam Frame hub tracks every release date and price signal.",
  },
]);

export default function GreatOnFramePage() {
  return (
    <>
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbs} />
      <StructuredData data={gamesList} />
      <StructuredData data={faq} />
      <Header articleCount={0} lastUpdated="" />

      <main
        className="max-w-[720px] mx-auto px-6 py-16"
        style={{ color: "var(--text-primary)" }}
      >
        <h1
          className="font-display text-4xl font-bold mb-3"
          style={{ letterSpacing: "-0.5px" }}
        >
          Great on Frame: Every Steam Frame Verified Game, Tracked
        </h1>

        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>
          Last updated: September 6, 2026
        </p>

        <p className="text-[13px] mb-8" style={{ color: "var(--text-muted)" }}>
          Part of our{" "}
          <a
            href="/steam-frame"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame hub
          </a>
          . For the launch picture, see the{" "}
          <a
            href="/steam-frame-release-date"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            release date tracker
          </a>{" "}
          and{" "}
          <a
            href="/steam-frame-price"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            price tracker
          </a>
          .
        </p>

        {/* Definitional lede for AI Overview capture */}
        <p
          className="text-[15px] leading-[1.7] mb-8"
          style={{ color: "var(--text-secondary)" }}
        >
          Great on Frame is Valve&apos;s curated Steam section for games
          certified to run well on the Steam Frame headset, the VR sibling of
          the Great on Deck label that shaped Steam Deck buying for four years.
          The page went live in mid July 2026 with eight titles and reported 117
          matches on September 6, more than a fourteenfold increase in seven weeks.
          Most of that growth is flatscreen catalog games rather than native VR,
          and Valve&apos;s own The Lab lost its certification along the way. This
          page tracks the confirmed titles, what the certification actually
          requires, and every change as Valve fills the shelves ahead of launch.
        </p>

        <figure className="pillar-figure">
          <img
            src="/article-images/steam-frame/steam-frame-headset.jpg"
            alt="Valve Steam Frame standalone VR headset shown at a three-quarter angle with the Valve logo on the head strap"
            width={1920}
            height={1080}
            loading="lazy"
          />
          <figcaption>Image: Valve</figcaption>
        </figure>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          The Great on Frame list, and how fast it grew
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Valve&apos;s page reported 117 matches on September 6, 2026. It launched
          with five titles the week of July 13, reached eight within a day, sat
          around 42 by late July, passed 50 on August 3, hit 65 on August 10, 89
          on August 24, 98 on August 27, and is at 117 now. You can confirm the running total
          yourself by appending frame_compatibility=3 to a Steam store search,
          which is how the figures on this page are taken. What changed most
          recently is the composition rather than the count: Beat Saber, Job
          Simulator, Walkabout Mini Golf VR, Pistol Whip, Synth Riders, Red
          Matter 2, Moss II VR and all three I Expect You To Die games are now
          certified, which is a meaningful shift from a list once dominated by
          Valve demos and flatscreen catalog titles.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Valve does not publish a plain-text index of the catalog, and the
          storefront grid loads in pages, so the table below covers the titles
          VR.org has individually confirmed rather than all 117. The remainder
          are being added as they are verified.
        </p>
        <ComparisonTable
          caption="Confirmed games on Valve's Great on Frame page, oldest listing first. Dates are when VR.org first observed the title. VR titles must hold 72 fps at 1728x1728 on-device; flatscreen titles need 720p at 30 FPS with full controller support."
          columns={["Game", "Developer", "Type", "Listed", "Status"]}
          rows={VERIFIED_GAMES.map((g) => [
            g.name,
            g.developer,
            g.type,
            g.added,
            g.status ?? "Verified",
          ])}
        />

        <div className="mb-6">
          {VERIFIED_GAMES.map((g) => (
            <div key={g.name} className="release-row">
              <span className="release-date" style={{ marginLeft: 0 }}>
                {g.name}
              </span>
              <span className="release-meta">{g.note}</span>
            </div>
          ))}
        </div>

        <div className="my-8">
          <AdSlot slot={AD_SLOTS.pillar} format="horizontal" />
        </div>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          What the badge actually certifies
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Great on Frame is the shop window for the{" "}
          <a
            href="/articles/steam-frame-verified-72fps-valve-quietly-cut-requirement-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Steam Frame Verified program
          </a>{" "}
          Valve announced at GDC 2026, though the bar has moved since. A
          standalone VR title has to hold at least 72 frames per second at
          1728x1728 per eye on the headset&apos;s Snapdragon 8 Gen 3. Valve
          originally set that number at 90 and revised the published
          requirement down without an announcement. Rendering below 1440x1440
          fails outright and earns an Unsupported badge. The reasoning behind
          having a floor at all is physiological rather than cosmetic: on a
          Steam Deck a frame dip is an annoyance, but in a headset it is a fast
          route to motion sickness. The badge is Valve personally vouching that
          a game will not make you queasy.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Flatscreen games have their own track: at least 720p at 30 FPS
          on-device, a working default control scheme, and full support for the
          Frame controllers, which put a D-pad on the left hand and face
          buttons on the right precisely so they can double as a gamepad.
          Streamed PC VR content is exempt from all of it, because performance
          over the 6GHz dongle depends on the PC doing the rendering.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          Why this list is worth tracking
        </h2>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Deck Verified quietly became one of the most influential systems
          Valve ever shipped. It changed the performance targets developers
          aimed at and changed what people bought, because a green checkmark on
          a store page moves units. Valve is now running the same play for VR,
          a category that has always struggled to tell newcomers which of its
          thousands of titles are actually worth buying.{" "}
          <a
            href="/articles/valve-great-on-frame-steam-page-steam-frame-launch-signal"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            We covered why the page&apos;s existence is itself a launch signal
          </a>
          : Valve does not build customer-facing storefront sections for
          products it plans to sell next year.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The growth rate of this list is also the best public proxy for launch
          timing. The Frame has{" "}
          <a
            href="/articles/steam-frame-no-launch-game-reckoning-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            no first-party launch game
          </a>
          , so the certified catalog is the launch lineup. Eight titles was not
          a lineup. Sixty-five is the beginning of one, and the shape of it is
          the interesting part: most of the growth has come from flatscreen
          catalog games like Balatro, Cuphead, and Hollow Knight: Silksong
          rather than native VR. Valve appears to be stocking the Frame the way
          it stocked the Steam Deck, with the VR list as the smaller specialty
          shelf inside a general Steam machine.
        </p>
        <p
          className="text-[15px] leading-[1.7] mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          The awkward detail in the current list is that Valve&apos;s own The Lab
          is no longer on it. The 2016 showcase was certified on July 13, cut to{" "}
          <a
            href="/articles/valve-the-lab-unsupported-steam-frame-arm64-proton-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Unsupported on July 29 and moved to an ARM64 Proton runtime
          </a>{" "}
          on August 5. In the same stretch a free community mod,{" "}
          <a
            href="/articles/half-life-2-vr-mod-steam-frame-verified-2026"
            className="no-underline hover:underline"
            style={{ color: "var(--accent-cyan)" }}
          >
            Half-Life 2: VR Mod, cleared certification
          </a>
          . Whatever the badge measures, it is not measuring who made the game.
        </p>

        <h2 className="font-display text-2xl font-bold mt-10 mb-3">
          List changelog
        </h2>
        <p
          className="text-[14px] leading-[1.6] mb-4"
          style={{ color: "var(--text-muted)" }}
        >
          Every change to the Great on Frame catalog since the page appeared,
          newest first.
        </p>
        <div className="mb-6">
          {CHANGELOG.map((entry) => (
            <div key={entry.date + entry.text.slice(0, 12)} className="release-row">
              <span className="release-date" style={{ marginLeft: 0 }}>
                {entry.date}
              </span>
              <span className="release-meta">{entry.text}</span>
            </div>
          ))}
        </div>

        <FaqSection schema={faq} />

        <RecentArticles heading="Latest Gaming News" limit={5} tag="gaming" />
        <AllPillarGuides exclude="great-on-frame" />
      </main>

      <Footer />
    </>
  );
}
