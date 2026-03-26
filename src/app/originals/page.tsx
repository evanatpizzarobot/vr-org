import type { Metadata } from "next";
import { OriginalsHub } from "@/components/OriginalsHub";

export const metadata: Metadata = {
  title: "VR.org Originals - In-Depth VR & AR Articles | VR.org",
  description:
    "Original articles, analysis, and opinion from the VR.org team. In-depth coverage of virtual reality, augmented reality, and spatial computing.",
  openGraph: {
    title: "VR.org Originals - In-Depth VR & AR Articles | VR.org",
    description:
      "Original articles, analysis, and opinion from the VR.org team.",
    url: "https://vr.org/originals",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/originals",
  },
  twitter: {
    card: "summary_large_image",
    title: "VR.org Originals | VR.org",
    description:
      "Original articles, analysis, and opinion from the VR.org team.",
  },
};

export default function OriginalsPage() {
  return <OriginalsHub />;
}
