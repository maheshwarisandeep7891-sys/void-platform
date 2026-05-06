import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anonymous Developer Posting — Dark Mode | VOID",
  description: "Go fully anonymous with one click. Random handle every session. Zero link to your real identity. Ask anything without reputation damage. Built for developers.",
  alternates: { canonical: "https://void-platform.vercel.app/dark" },
};

export default function DarkSEOPage() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 800, margin: "0 auto", padding: "40px 20px", background: "#050508", color: "#f0f0ff" }}>
      <nav style={{ marginBottom: 32 }}>
        <Link href="/" style={{ color: "#a78bfa", textDecoration: "none", fontWeight: 700, fontSize: 20 }}>← VOID</Link>
      </nav>
      <h1 style={{ fontSize: 36, fontWeight: 900, marginBottom: 16 }}>🖤 Dark Mode — Anonymous Developer Posting</h1>
      <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 32 }}>Go fully anonymous with one click. Random handle every session. Zero link to your real identity. Ask anything without reputation damage.</p>
      <Link href="/dark" style={{ display: "inline-block", background: "#8b5cf6", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700, fontSize: 16 }}>Enable Dark Mode →</Link>
      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>How VOID Dark Mode works</h2>
        <ul style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li>One click to enable — no setup required</li>
          <li>Random handle generated every session — like ghost_0x7f or null_ptr_42</li>
          <li>Zero link to your real account — ever</li>
          <li>Platform stores no connection between your identity and dark mode sessions</li>
          <li>Posts labeled with dark icon so community knows they are anonymous</li>
          <li>Full platform access — post, ask questions, submit bounties anonymously</li>
          <li>Keyboard shortcut: Cmd+Shift+D to toggle from anywhere</li>
        </ul>
      </section>
      <section style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>Why developers use anonymous posting</h2>
        <ul style={{ color: "#94a3b8", lineHeight: 2, paddingLeft: 24 }}>
          <li>Ask beginner questions without reputation damage</li>
          <li>Post controversial technical opinions safely</li>
          <li>Share embarrassing debugging stories</li>
          <li>Ask for salary and career advice</li>
          <li>Discuss sensitive workplace topics</li>
          <li>Submit bounty solutions anonymously</li>
        </ul>
      </section>
      <section style={{ marginTop: 40 }}>
        <p style={{ color: "#94a3b8" }}>Dark Mode is a privacy feature, not the dark web. All content is still subject to community guidelines.</p>
        <Link href="/auth/signin" style={{ display: "inline-block", marginTop: 16, background: "#8b5cf6", color: "white", padding: "12px 24px", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>Join VOID free →</Link>
      </section>
    </main>
  );
}
