import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Rust Developer Community — Share Code, Ask Questions, Find Jobs | VOID",
  description: "The best Rust developer community. Share Rust code snippets, ask questions anonymously, find Rust jobs and bounties. Join 500+ Rust developers on VOID.",
  alternates: { canonical: "https://void-platform.vercel.app/about/rust-developer-community" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Rust Developer Community</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>The best place for Rust developers to share code, ask questions, and connect. Join 500+ Rust builders on VOID — a developer-only platform built for serious programmers.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>VOID is where Rust developers post code snippets, discuss async runtimes, debate borrow checker patterns, and find paid bounties. No algorithm manipulation. No noise. Just Rust developers helping each other build better software.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Join the Rust community →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What Rust developers do on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Share Rust code snippets with syntax highlighting</li>
        <li>Ask Rust questions anonymously — no reputation damage</li>
        <li>Post Rust bounties — get paid to solve Rust problems</li>
        <li>Join the Rust Guild — community of Rust developers</li>
        <li>Sell Rust consulting time and tools on the marketplace</li>
        <li>Share Rust project drops and open source releases</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Popular Rust topics on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Rust async/await and tokio runtime</li>
        <li>Rust lifetimes and borrow checker</li>
        <li>Rust WebAssembly (WASM)</li>
        <li>Rust systems programming</li>
        <li>Rust web frameworks (Axum, Actix)</li>
        <li>Rust error handling with thiserror and anyhow</li>
        <li>Rust performance optimization</li>
      </ul>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse Rust Guild →</Link>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View Rust posts →</Link>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Find Rust bounties →</Link>
      </div>
    </main>
  );
}
