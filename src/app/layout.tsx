import type { Metadata } from "next";
import "./globals.css";
import { ThemeScript } from "@/components/ThemeScript";

export const metadata: Metadata = {
  title: "VR.org — Virtual & Augmented Reality News Feed",
  description:
    "Real-time VR, AR, and XR news aggregated from the world's top sources. Hardware, gaming, software, enterprise — all in one feed.",
  openGraph: {
    title: "VR.org — The Pulse of VR & AR",
    description:
      "Real-time news feed for virtual reality, augmented reality, and spatial computing.",
    type: "website",
    url: "https://vr.org",
  },
  twitter: {
    card: "summary_large_image",
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
      </head>
      <body>
        <div className="ambient-bg" />
        <div className="scanline-overlay" />
        {children}
      </body>
    </html>
  );
}
