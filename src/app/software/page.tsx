import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "VR & AR Software News — Platforms, Apps & Tools | VR.org",
  description:
    "Virtual reality and augmented reality software news. Platform updates, SDK releases, social VR, creator tools, and spatial computing applications.",
  openGraph: {
    title: "VR & AR Software News — Platforms, Apps & Tools | VR.org",
    description: "Virtual reality and augmented reality software news. Platform updates, SDK releases, and spatial computing applications.",
    url: "https://vr.org/software",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/software",
  },
  twitter: {
    card: "summary_large_image",
    title: "VR & AR Software News | VR.org",
    description: "VR and AR software news — platforms, SDKs, apps, and tools.",
  },
};

export default function SoftwarePage() {
  return (
    <CategoryHub
      category="software"
      title="Software"
      description="Platforms, SDKs, apps, social VR, and developer tools shaping the immersive ecosystem."
    />
  );
}
