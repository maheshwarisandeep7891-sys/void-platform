import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Developer Marketplace — Buy and Sell Dev Tools | VOID",
  description: "The developer marketplace for buying and selling dev tools, API credits, SaaS seats, GPU access, and software licenses. Built-in escrow. No Stripe needed.",
  alternates: { canonical: "https://void-platform.vercel.app/about/developer-marketplace" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Developer Marketplace</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>The marketplace built exclusively for developers. Buy and sell API credits, SaaS seats, GPU access, software licenses, side projects, and developer tools — all with built-in escrow and zero Stripe setup.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Developers waste thousands every year on unused software. VOID marketplace turns that waste into value — connecting developers who have resources they don't need with developers who need them at a fair price.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Browse marketplace →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What you can buy and sell on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>API credits — OpenAI, Anthropic, Google AI, and more</li>
        <li>SaaS seats — GitHub Copilot, JetBrains, Linear, Figma</li>
        <li>GPU access — rent compute time for ML workloads</li>
        <li>Software licenses — IDEs, design tools, productivity apps</li>
        <li>Side projects and SaaS products</li>
        <li>Developer tools, scripts, and automation</li>
        <li>Consulting time and code review sessions</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>How the marketplace works</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>List your item in 2 minutes — no approval process</li>
        <li>Buyer pays into built-in escrow</li>
        <li>You deliver the item or access</li>
        <li>Buyer confirms receipt → payment releases instantly</li>
        <li>Auto-refund if seller disappears after 7 days</li>
        <li>Dispute resolution for edge cases</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Why developers choose VOID marketplace</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>No Stripe setup — built-in payment system</li>
        <li>Developer-only audience — buyers who actually understand what you're selling</li>
        <li>Reputation system — verified sellers with track records</li>
        <li>Low friction — list and sell in minutes</li>
      </ul>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/marketplace" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse marketplace →</Link>
        <Link href="/marketplace/new" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>List an item →</Link>
      </div>
    </main>
  );
}
