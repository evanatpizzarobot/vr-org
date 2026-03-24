import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "VR Software News — Platforms, SDKs & Apps | VR.org",
  description:
    "Latest VR and AR software news. Platform updates, SDK releases, social VR, developer tools, and application launches.",
  openGraph: {
    title: "VR Software News | VR.org",
    description: "Latest VR and AR software news — platforms, SDKs, apps, and tools.",
    url: "https://vr.org/software",
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
