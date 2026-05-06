import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace — Buy & Sell Developer Tools | VOID",
  description: "Buy and sell unused developer resources. API credits, SaaS seats, GPU access, side projects, software licenses. Built-in escrow. No Stripe needed.",
  openGraph: {
    title: "VOID Marketplace — Developer Tools Exchange",
    description: "Buy and sell unused developer resources. API credits, SaaS seats, GPU access, side projects. Built-in escrow.",
    url: "https://void-platform.vercel.app/marketplace",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=Developer%20Marketplace&subtitle=Buy%20%26%20sell%20dev%20tools", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Marketplace", description: "Buy and sell unused developer resources." },
  alternates: { canonical: "https://void-platform.vercel.app/marketplace" },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
