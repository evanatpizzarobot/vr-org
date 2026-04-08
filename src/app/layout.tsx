import type { Metadata } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";
import {
  StructuredData,
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
} from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "VR.org | Virtual Reality & Augmented Reality News",
  description:
    "Real-time VR, AR, and XR news aggregated from the world's top sources. Hardware, gaming, software, enterprise - all in one live feed.",
  openGraph: {
    title: "VR.org | Virtual Reality & Augmented Reality News",
    description:
      "Real-time VR, AR, and XR news aggregated from the world's top sources. Hardware, gaming, software, enterprise - all in one live feed.",
    type: "website",
    url: "https://vr.org/",
    siteName: "VR.org",
    images: [{ url: "https://vr.org/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vrdotorg",
    creator: "@vrdotorg",
    title: "VR.org | Virtual Reality & Augmented Reality News",
    description:
      "Real-time VR, AR, and XR news aggregated from the world's top sources.",
    images: ["https://vr.org/og-image.png"],
  },
  alternates: {
    canonical: "https://vr.org/",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
  other: {
    "theme-color": "#0891B2",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <meta name="google-site-verification" content="cfkAakzduCtr-941_j8S-6S9ZGXylJLE1r9kn1HU1F8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <StructuredData data={ORGANIZATION_SCHEMA} />
        <StructuredData data={WEBSITE_SCHEMA} />
      </head>
      <body>
        <div className="ambient-bg" />
        <div className="scanline-overlay" />
        {children}
      </body>
    </html>
  );
}
