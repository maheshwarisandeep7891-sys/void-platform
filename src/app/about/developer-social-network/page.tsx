import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Developer Social Network — Built for Programmers | VOID",
  description: "A social network built exclusively for developers. Share code, discuss tech, post anonymously, find bounties. No algorithm manipulation. GitHub login required.",
  alternates: { canonical: "https://void-platform.vercel.app/about/developer-social-network" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Developer Social Network</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>A social network built exclusively for developers. No influencers. No viral nonsense. No algorithm pushing engagement bait. Just developers sharing code, discussing tech, and helping each other build better software.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Twitter is full of noise. LinkedIn is full of recruiters. Reddit is full of drama. VOID is where developers go when they want signal — real technical discussions, code snippets, project drops, and honest opinions from people who actually write code.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Join VOID →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What makes VOID different</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Developer-only — GitHub login required, no non-technical users</li>
        <li>No algorithm manipulation — chronological feed, no engagement bait</li>
        <li>Anonymous posting — Dark Mode for sensitive questions and opinions</li>
        <li>Code-first — syntax highlighting, code blocks, technical formatting</li>
        <li>Guilds — communities organized by tech stack, not hashtags</li>
        <li>Reputation that means something — earned through real contributions</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>What developers share on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Code snippets and technical threads</li>
        <li>Project drops and open source releases</li>
        <li>Technical opinions and hot takes (anonymously if needed)</li>
        <li>Debugging war stories</li>
        <li>Career advice and salary discussions</li>
        <li>Tool recommendations and reviews</li>
        <li>Job opportunities and bounties</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>More than a social network</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>VOID is a full developer platform — social feed, Q&A, bounties, and a marketplace for developer resources. One platform for everything developers need beyond code hosting.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View feed →</Link>
        <Link href="/explore" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Explore →</Link>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse guilds →</Link>
      </div>
    </main>
  );
}
