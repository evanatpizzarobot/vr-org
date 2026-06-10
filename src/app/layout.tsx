import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import "./globals.css";

// Self-hosted variable fonts (latin subsets, OFL licensed). next/font/local
// keeps the Docker build free of any Google Fonts network dependency and
// removes the render-blocking fonts.googleapis.com stylesheet from <head>.
const outfit = localFont({
  src: "../fonts/outfit-latin-var.woff2",
  display: "swap",
  weight: "300 800",
  variable: "--font-outfit",
});
const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk-latin-var.woff2",
  display: "swap",
  weight: "300 700",
  variable: "--font-space-grotesk",
});
const jetbrainsMono = localFont({
  src: "../fonts/jetbrains-mono-latin-var.woff2",
  display: "swap",
  weight: "100 800",
  variable: "--font-jetbrains-mono",
});
import { ThemeScript } from "@/components/ThemeScript";
import { HeroBackground } from "@/components/HeroBackground";
import {
  StructuredData,
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
} from "@/components/StructuredData";

export const metadata: Metadata = {
  // Resolves relative metadata URLs (like the generated per-article
  // opengraph-image paths) to the production origin instead of localhost.
  metadataBase: new URL("https://vr.org"),
  title: "VR.org | VR News, AR News & XR News Today",
  description:
    "VR news, AR news, and XR news updated in real time. Original articles plus headlines from 38+ trusted sources covering VR hardware, gaming, software, enterprise, and spatial computing.",
  openGraph: {
    title: "VR.org | VR News, AR News & XR News Today",
    description:
      "VR news, AR news, and XR news updated in real time. Original articles plus headlines from 38+ trusted sources covering VR hardware, gaming, software, enterprise, and spatial computing.",
    type: "website",
    url: "https://vr.org/",
    siteName: "VR.org",
    images: [{ url: "https://vr.org/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@vrdotorg",
    creator: "@vrdotorg",
    title: "VR.org | VR News, AR News & XR News Today",
    description:
      "VR news, AR news, and XR news updated in real time from the world's top sources.",
    images: ["https://vr.org/og-image.png"],
  },
  alternates: {
    canonical: "https://vr.org/",
    types: {
      "application/rss+xml": "https://vr.org/feed.xml",
    },
  },
  icons: {
    // iOS does not support SVG touch icons, so Apple devices get a real PNG.
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${outfit.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZNNJ4FV2XN"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZNNJ4FV2XN');
          `}
        </Script>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7224757913262984"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <ThemeScript />
        <meta name="google-site-verification" content="cfkAakzduCtr-941_j8S-6S9ZGXylJLE1r9kn1HU1F8" />
        <StructuredData data={ORGANIZATION_SCHEMA} />
        <StructuredData data={WEBSITE_SCHEMA} />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <div className="ambient-bg" />
        <div className="scanline-overlay" />
        <HeroBackground mouse={false} />
        <div className="page-stack">{children}</div>
      </body>
    </html>
  );
}
