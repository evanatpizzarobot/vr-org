import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";
import { HeroBackground } from "@/components/HeroBackground";
import {
  StructuredData,
  ORGANIZATION_SCHEMA,
  WEBSITE_SCHEMA,
} from "@/components/StructuredData";

export const metadata: Metadata = {
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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <StructuredData data={ORGANIZATION_SCHEMA} />
        <StructuredData data={WEBSITE_SCHEMA} />
      </head>
      <body>
        <div className="ambient-bg" />
        <div className="scanline-overlay" />
        <HeroBackground mouse={false} />
        <div className="page-stack">{children}</div>
      </body>
    </html>
  );
}
