import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = undefined; // removed

export const metadata: Metadata = {
  metadataBase: new URL("https://void-platform.vercel.app"),
  title: {
    default: "VOID — The internet's home for people who actually build things.",
    template: "%s | VOID",
  },
  description:
    "VOID is the combined social network, marketplace, and knowledge platform built exclusively for developers and hackers. Share code, sell tools, ask questions, build together.",
  keywords: [
    "developers",
    "hackers",
    "marketplace",
    "code",
    "tools",
    "open source",
    "programming",
    "tech community",
  ],
  authors: [{ name: "VOID Platform" }],
  creator: "VOID Platform",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://void-platform.vercel.app",
    title: "VOID — Build. Share. Sell.",
    description:
      "The internet's home for people who actually build things. Social network + marketplace + knowledge base for developers.",
    siteName: "VOID",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "VOID Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VOID — Build. Share. Sell.",
    description: "The internet's home for people who actually build things.",
    images: ["/api/og"],
  },
  verification: {
    google: ["bb5190fe79d7b552", "1B2mGO_qsXe3vHGAZlRME_C2AiHPGPG9wsuTSE3TauA"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://void-platform.vercel.app/feed.xml",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${spaceGrotesk.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Premium font: Geist for headings */}
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="alternate" type="application/rss+xml" title="VOID Developer Feed" href="https://void-platform.vercel.app/feed.xml" />
      </head>
      <body className="bg-void-bg text-void-text antialiased bg-gradient-void">
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
