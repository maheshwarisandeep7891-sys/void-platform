import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Developer Knowledge Base — Programming Q&A | VOID",
  description: "Stack Overflow done right. Ask programming questions, get expert answers. Anonymous questions supported. Answers verified by the community with Still Works button.",
  alternates: { canonical: "https://void-platform.vercel.app/knowledge" },
};

export default function KnowledgeSEOPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: "40px 20px", background: "#050508", color: "#f0f0ff" }}>
      <nav style={{ marginBottom: 32 }}>
        <Link href="/" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 700, fontSize: 20 }}>← VOID</Link>
      </nav>
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Developer Knowledge Base</h1>
      <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 32 }}>Stack Overflow done right. Ask programming questions and get expert answers from the developer community. Anonymous questions supported.</p>
      <Link href="/knowledge" style={{ display: "inline-block", background: "#06b6d4", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>Browse Questions →</Link>
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>What makes VOID Knowledge Base different</h2>
        <ul style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li><strong style={{ color: "#f0f0ff" }}>Anonymous questions</strong> — Ask anything without reputation damage</li>
          <li><strong style={{ color: "#f0f0ff" }}>Still Works button</strong> — Community verifies answers are still current in 2026</li>
          <li><strong style={{ color: "#f0f0ff" }}>Vote on quality</strong> — Upvote helpful answers, downvote incorrect ones</li>
          <li><strong style={{ color: "#f0f0ff" }}>Accept answers</strong> — Question author marks the best answer</li>
          <li><strong style={{ color: "#f0f0ff" }}>No hostile moderation</strong> — Questions don't get closed for being too basic</li>
          <li><strong style={{ color: "#f0f0ff" }}>Markdown support</strong> — Format code, lists, and explanations properly</li>
        </ul>
      </section>
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Popular programming topics</h2>
        <ul style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li>Rust async programming, lifetimes, and borrow checker</li>
          <li>Go concurrency patterns, goroutines, and channels</li>
          <li>TypeScript type system, generics, and advanced patterns</li>
          <li>PostgreSQL query optimization, indexing, and MVCC</li>
          <li>Kubernetes deployment, configuration, and troubleshooting</li>
          <li>Python async/await, FastAPI, and SQLAlchemy</li>
          <li>Distributed systems, consensus, and CAP theorem</li>
          <li>WebAssembly, WASI, and browser integration</li>
        </ul>
      </section>
      <section style={{ marginTop: 40 }}>
        <Link href="/knowledge/ask" style={{ display: "inline-block", background: "#8b5cf6", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Ask a question →</Link>
      </section>
    </main>
  );
}
