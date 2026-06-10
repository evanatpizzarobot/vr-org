import type { Metadata } from "next";
import { CategoryHub } from "@/components/CategoryHub";
import { getCategoryOriginalSummaries } from "@/lib/articles";

export const revalidate = 300;

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
    images: [{ url: "https://vr.org/og-image.png", width: 1200, height: 630 }],
  },
  alternates: {
    canonical: "https://vr.org/xr",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://vr.org/og-image.png"],
    title: "XR & Mixed Reality News | VR.org",
    description:
      "Extended reality news - XR platforms, mixed reality, spatial computing, and immersive tech.",
  },
};

export default function XRPage() {
  const initialEditorial = getCategoryOriginalSummaries("xr", 8);
  return (
    <CategoryHub
      category="xr"
      title="XR / Extended Reality"
      description="Extended reality encompasses VR, AR, and everything in between. Platform launches, industry analysis, developer ecosystems, and the convergence of immersive technologies. Android XR, WebXR, mixed reality headsets, and cross-platform frameworks all fall under this umbrella."
      initialEditorial={initialEditorial}
    />
  );
}
