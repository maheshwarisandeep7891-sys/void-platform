import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Bounties — Post Problems, Earn Rewards | VOID",
  description: "Post a coding problem with a reward. Community solves it. Escrow-backed payments. Open bounties from $50 to $500+. Anonymous submissions supported.",
  alternates: { canonical: "https://void-platform.vercel.app/bounties" },
};

export default function BountiesSEOPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: "40px 20px", background: "#050508", color: "#f0f0ff" }}>
      <nav style={{ marginBottom: 32 }}>
        <Link href="/" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 700, fontSize: 20 }}>← VOID</Link>
      </nav>
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Developer Bounties</h1>
      <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 32 }}>Post a coding problem with a reward. The developer community solves it. Escrow-backed payments protect both parties.</p>
      <Link href="/bounties" style={{ display: "inline-block", background: "#f59e0b", color: "#050508", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>Browse Bounties →</Link>
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>How VOID Bounties work</h2>
        <ol style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li>Post your problem with a reward amount (minimum $10)</li>
          <li>Set an expiry date (optional)</li>
          <li>Developers submit solutions</li>
          <li>You review submissions and accept the best one</li>
          <li>Payment releases automatically from escrow</li>
          <li>Auto-refund if no solution is accepted before expiry</li>
        </ol>
      </section>
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Types of bounties on VOID</h2>
        <ul style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li>Bug fixes — memory leaks, race conditions, performance issues</li>
          <li>Feature development — build a specific feature or component</li>
          <li>Code review — review and improve existing code quality</li>
          <li>Database optimization — query optimization, indexing strategies</li>
          <li>Security audits — find and fix vulnerabilities</li>
          <li>Documentation — write technical documentation or tutorials</li>
          <li>Tree-sitter grammars — build language grammars for editors</li>
          <li>Algorithm optimization — improve time or space complexity</li>
        </ul>
      </section>
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Post a bounty</h2>
        <p style={{ color: "#94a3b8" }}>Free to post. Anonymous submissions supported via Dark Mode. Built-in escrow protects your payment.</p>
        <Link href="/auth/signin" style={{ display: "inline-block", marginTop: 16, background: "#8b5cf6", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Post a bounty →</Link>
      </section>
    </main>
  );
}
