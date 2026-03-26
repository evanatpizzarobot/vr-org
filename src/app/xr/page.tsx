import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";

export const metadata: Metadata = {
  title: "XR News - Extended Reality, Mixed Reality & Spatial Computing | VR.org",
  description:
    "Extended reality news covering XR platforms, mixed reality headsets, spatial computing, Android XR, WebXR, and the convergence of VR, AR, and MR technologies.",
  openGraph: {
    title: "XR News - Extended Reality, Mixed Reality & Spatial Computing | VR.org",
    description:
      "Extended reality news covering XR platforms, mixed reality, spatial computing, and the convergence of immersive technologies.",
    url: "https://vr.org/xr",
    siteName: "VR.org",
  },
  alternates: {
    canonical: "https://vr.org/xr",
  },
  twitter: {
    card: "summary_large_image",
    title: "XR & Mixed Reality News | VR.org",
    description:
      "Extended reality news - XR platforms, mixed reality, spatial computing, and immersive tech.",
  },
};

export default function XRPage() {
  return (
    <CategoryHub
      category="xr"
      title="XR / Extended Reality"
      description="Extended reality, mixed reality, spatial computing, and the technologies bridging VR, AR, and the physical world."
    />
  );
}
