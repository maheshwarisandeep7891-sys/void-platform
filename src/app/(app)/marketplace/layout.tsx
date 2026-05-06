import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Marketplace — Buy & Sell API Credits, SaaS Seats, GPU Access | VOID",
  description: "Buy and sell unused developer resources. API credits, SaaS seats, GPU access, side projects, software licenses. Built-in escrow. No Stripe needed. Free to list.",
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
  return (
    <>
      <div className="sr-only">
        <h1>VOID Developer Marketplace</h1>
        <p>Buy and sell unused developer resources. The marketplace built exclusively for developers.</p>
        <h2>What you can buy and sell on VOID Marketplace</h2>
        <ul>
          <li>SaaS Seats — GitHub Copilot, JetBrains, and other developer tools</li>
          <li>API Credits — OpenAI, Anthropic, and other AI API credits</li>
          <li>GPU Access — Rent GPU time by the hour for ML training</li>
          <li>Side Projects — Buy and sell complete SaaS products</li>
          <li>Software Licenses — Unused software licenses</li>
          <li>Domain Names — Developer-relevant domain names</li>
          <li>CLI Tools — Command line tools and utilities</li>
          <li>Datasets — Developer and ML datasets</li>
        </ul>
        <p>Built-in escrow system. No Stripe setup needed. Auto-refund if seller disappears. Free to list. 7% platform fee on sales.</p>
        <p>Join 500+ developers already trading on VOID. Free GitHub login.</p>
      </div>
      {children}
    </>
  );
}
