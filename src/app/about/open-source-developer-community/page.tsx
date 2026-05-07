import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Open Source Developer Community | VOID",
  description: "Open source developer community on VOID. Share OSS projects, find contributors, post bounties for open source issues, discuss open source sustainability.",
  alternates: { canonical: "https://void-platform.vercel.app/about/open-source-developer-community" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Open Source Developer Community</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>The open source developer community on VOID. Share your OSS projects, find contributors, post bounties for open source issues, and discuss the challenges of building and sustaining open source software.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Open source powers the internet. But open source maintainers are burning out. VOID helps OSS developers find contributors, fund their work through bounties, and connect with a community that understands the unique challenges of building in the open.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Join the OSS community →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What open source developers do on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Share project drops and new releases</li>
        <li>Post bounties for open source issues — fund contributions</li>
        <li>Find contributors for your open source projects</li>
        <li>Discuss open source licensing and sustainability</li>
        <li>Ask questions anonymously about maintainer burnout</li>
        <li>Sell premium support and consulting for your OSS projects</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Open source topics on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Open source licensing — MIT, Apache, GPL, AGPL</li>
        <li>Maintainer sustainability and funding models</li>
        <li>Building open source communities</li>
        <li>Open source security and supply chain</li>
        <li>Contributing to large open source projects</li>
        <li>Open source business models</li>
        <li>Documentation and developer experience</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Fund open source with bounties</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>Post bounties for your open source issues. Developers earn money solving real problems in your project. Built-in escrow means payment is guaranteed when the work is done.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View OSS posts →</Link>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Post a bounty →</Link>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse guilds →</Link>
      </div>
    </main>
  );
}
