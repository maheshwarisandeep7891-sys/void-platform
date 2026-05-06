import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Feed — Code Snippets, Threads & Project Drops | VOID",
  description: "What developers are shipping. Code snippets, threads, project drops, and technical discussions from 500+ builders. No algorithm. Just builders.",
  alternates: { canonical: "https://void-platform.vercel.app/feed" },
};

export default function FeedSEOPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: "40px 20px", background: "#050508", color: "#f0f0ff" }}>
      <nav style={{ marginBottom: 32 }}>
        <Link href="/" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 700, fontSize: 20 }}>← VOID</Link>
      </nav>
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Developer Feed</h1>
      <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 32 }}>What developers are shipping. Code snippets, threads, project drops, and technical discussions. No algorithm. Just builders.</p>
      <Link href="/feed" style={{ display: "inline-block", background: "#8b5cf6", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>Open Feed →</Link>
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>What you can share on VOID Feed</h2>
        <ul style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li><strong style={{ color: "#f0f0ff" }}>Code Snippets</strong> — Share useful code with syntax highlighting and Monaco editor</li>
          <li><strong style={{ color: "#f0f0ff" }}>Threads</strong> — Long-form technical writing with Markdown support</li>
          <li><strong style={{ color: "#f0f0ff" }}>Project Drops</strong> — Announce what you just shipped</li>
          <li><strong style={{ color: "#f0f0ff" }}>Questions</strong> — Ask the community for help</li>
          <li><strong style={{ color: "#f0f0ff" }}>Bounties</strong> — Post problems with rewards attached</li>
        </ul>
      </section>
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Features</h2>
        <ul style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li>No algorithm — chronological feed</li>
          <li>Filter by technology: Rust, Go, TypeScript, Python, Kubernetes, WebAssembly, ML/AI</li>
          <li>Reactions: Used this, Saved me hours, Brilliant</li>
          <li>Anonymous posting via Dark Mode</li>
          <li>Live feed updates every 10 seconds</li>
          <li>Infinite scroll</li>
        </ul>
      </section>
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Join VOID</h2>
        <p style={{ color: "#94a3b8" }}>Free to join. GitHub login. 500+ developers already building in public.</p>
        <Link href="/auth/signin" style={{ display: "inline-block", marginTop: 16, background: "#8b5cf6", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Sign in with GitHub →</Link>
      </section>
    </main>
  );
}
