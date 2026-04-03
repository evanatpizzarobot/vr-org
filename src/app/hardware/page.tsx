import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "VR & AR Hardware News - Headsets, Displays & Controllers | VR.org",
  description:
    "Latest virtual reality and augmented reality hardware news. Headset reviews, specs, launches, and teardowns from Quest, Vision Pro, PSVR, Steam Frame, and more.",
  openGraph: {
    title: "VR & AR Hardware News - Headsets, Displays & Controllers | VR.org",
    description: "Latest virtual reality and augmented reality hardware news. Headset reviews, specs, launches, and teardowns.",
    url: "https://vr.org/hardware",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/hardware",
  },
  twitter: {
    card: "summary_large_image",
    title: "VR & AR Hardware News | VR.org",
    description: "Latest VR and AR hardware news - headsets, displays, controllers, and specs.",
  },
};

export default function HardwarePage() {
  return (
    <CategoryHub
      category="hardware"
      title="Hardware"
      description="The latest in VR and AR hardware, from headset launches and spec breakdowns to controller innovations and display technology. We track every major device release and provide in-depth coverage of the hardware shaping spatial computing. Whether it's a new Quest update, a PSVR2 accessory, or a prototype nobody saw coming, you'll find it here first."
    />
  );
}
