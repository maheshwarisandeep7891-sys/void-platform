import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "GitHub Alternative for Developer Community | VOID",
  description: "VOID is a GitHub alternative focused on developer community — not just code hosting. Share code, ask questions, find bounties, buy dev tools. Built for programmers.",
  alternates: { canonical: "https://void-platform.vercel.app/about/github-alternative" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>GitHub Alternative for Developer Community</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>GitHub is great for code hosting. It's terrible for developer community. VOID fills the gap — a platform where developers share knowledge, ask questions, find paid work, and connect with other builders.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>GitHub has no feed for sharing ideas. No Q&A. No marketplace for developer resources. No anonymous posting. No bounties. VOID is the community layer that GitHub never built — and it uses GitHub login so you're already signed in.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Sign in with GitHub →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What VOID adds that GitHub doesn't have</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Developer social feed — share code snippets, threads, project drops</li>
        <li>Anonymous posting — ask anything without reputation damage</li>
        <li>Knowledge Base — Q&A with "still works" verification</li>
        <li>Bounties — post problems, offer rewards, get solutions</li>
        <li>Marketplace — buy and sell API credits, SaaS seats, GPU access</li>
        <li>Guilds — communities organized by tech stack</li>
        <li>Exportable reputation credentials</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>VOID is not a GitHub replacement</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>VOID doesn't host your code repositories. It's the community and marketplace layer that sits alongside GitHub. Use GitHub for code. Use VOID for everything else — community, Q&A, bounties, and developer commerce.</p>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Sign in with your existing GitHub account</li>
        <li>Your GitHub profile links to your VOID profile</li>
        <li>Share GitHub repos in the VOID feed</li>
        <li>Post bounties for your open source issues</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Developer-only platform</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>VOID requires GitHub login. That means everyone on the platform is a developer. No noise from non-technical users. No algorithm pushing viral content. Just developers helping developers.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View developer feed →</Link>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse guilds →</Link>
        <Link href="/marketplace" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse marketplace →</Link>
      </div>
    </main>
  );
}
