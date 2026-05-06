import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Marketplace — Buy & Sell API Credits, SaaS Seats, GPU Access | VOID",
  description: "Buy and sell unused developer resources. API credits, SaaS seats, GPU access, side projects, software licenses. Built-in escrow. No Stripe needed.",
  alternates: { canonical: "https://void-platform.vercel.app/marketplace" },
};

export default function MarketplaceSEOPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: "40px 20px", background: "#050508", color: "#f0f0ff" }}>
      <nav style={{ marginBottom: 32 }}>
        <Link href="/" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 700, fontSize: 20 }}>← VOID</Link>
      </nav>
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Developer Marketplace</h1>
      <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 32 }}>Buy and sell unused developer resources. The marketplace built exclusively for developers. Built-in escrow. No Stripe needed.</p>
      <Link href="/marketplace" style={{ display: "inline-block", background: "#10b981", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>Browse Marketplace →</Link>
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>What you can buy and sell</h2>
        <ul style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li><strong style={{ color: "#f0f0ff" }}>SaaS Seats</strong> — GitHub Copilot, JetBrains, Linear, Figma, Notion seats</li>
          <li><strong style={{ color: "#f0f0ff" }}>API Credits</strong> — OpenAI, Anthropic, Google AI, AWS credits</li>
          <li><strong style={{ color: "#f0f0ff" }}>GPU Access</strong> — Rent GPU time by the hour for ML training</li>
          <li><strong style={{ color: "#f0f0ff" }}>Side Projects</strong> — Buy and sell complete SaaS products with revenue</li>
          <li><strong style={{ color: "#f0f0ff" }}>Software Licenses</strong> — Unused software licenses</li>
          <li><strong style={{ color: "#f0f0ff" }}>Domain Names</strong> — Developer-relevant domain names</li>
          <li><strong style={{ color: "#f0f0ff" }}>CLI Tools</strong> — Command line tools and utilities</li>
          <li><strong style={{ color: "#f0f0ff" }}>Datasets</strong> — Developer and ML training datasets</li>
        </ul>
      </section>
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>How the escrow system works</h2>
        <ol style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li>Seller lists item (free to list)</li>
          <li>Buyer pays into escrow</li>
          <li>Seller delivers the item</li>
          <li>Buyer confirms delivery — payment releases</li>
          <li>Auto-refund if seller disappears after 7 days</li>
        </ol>
        <p style={{ color: "#94a3b8", marginTop: 16 }}>7% platform fee. No Stripe setup. No external payment processor needed.</p>
      </section>
      <section style={{ marginTop: 40 }}>
        <Link href="/auth/signin" style={{ display: "inline-block", background: "#8b5cf6", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Start selling on VOID →</Link>
      </section>
    </main>
  );
}
