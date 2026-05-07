import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Go Developer Community — Golang Developers | VOID",
  description: "The Go developer community on VOID. Share Golang code, ask questions anonymously, find Go bounties, and connect with other Golang developers. Join free.",
  alternates: { canonical: "https://void-platform.vercel.app/about/go-developer-community" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Go Developer Community</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>The best place for Golang developers to share code, ask questions, and connect. VOID is a developer-only platform where Go engineers discuss concurrency patterns, microservices, and everything in between.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>From goroutines to gRPC, from standard library deep dives to production war stories — VOID's Go community covers the full spectrum of Golang development. Ask questions anonymously, post bounties, and share your Go projects.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Join the Go community →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What Go developers do on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Share Go code snippets with syntax highlighting</li>
        <li>Ask Golang questions anonymously — no reputation damage</li>
        <li>Post Go bounties — get paid to solve Go problems</li>
        <li>Join the Go Guild — community of Golang developers</li>
        <li>Discuss Go modules, tooling, and best practices</li>
        <li>Share open source Go projects and libraries</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Popular Go topics on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Go concurrency — goroutines, channels, select</li>
        <li>Go microservices with gRPC and Protobuf</li>
        <li>Go web frameworks (Gin, Echo, Chi, Fiber)</li>
        <li>Go error handling patterns</li>
        <li>Go generics (1.18+)</li>
        <li>Go performance profiling and optimization</li>
        <li>Go testing and benchmarking</li>
        <li>Go for cloud-native and Kubernetes operators</li>
      </ul>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse Go Guild →</Link>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View Go posts →</Link>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Find Go bounties →</Link>
      </div>
    </main>
  );
}
