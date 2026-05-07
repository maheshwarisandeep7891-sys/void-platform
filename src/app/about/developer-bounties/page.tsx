import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Developer Bounties — Get Paid to Solve Coding Problems | VOID",
  description: "Post coding bounties and get paid to solve programming problems. Developer bounties with built-in escrow on VOID. No Stripe needed. Post a problem, offer a reward.",
  alternates: { canonical: "https://void-platform.vercel.app/about/developer-bounties" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Developer Bounties</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>Post a coding problem. Offer a reward. Get it solved by the developer community. VOID bounties use built-in escrow — no Stripe setup, no payment processor, no platform fees eating your budget.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Whether you're stuck on a gnarly bug, need a specific feature built, or want a code review from an expert — VOID bounties connect you with developers who can help. Solvers can even submit anonymously via Dark Mode.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Post a bounty →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>How developer bounties work on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Post your problem with a clear description and reward amount</li>
        <li>Developers browse open bounties and submit solutions</li>
        <li>Review submissions and accept the best one</li>
        <li>Payment releases automatically from escrow</li>
        <li>Auto-refund if no solution is submitted within 30 days</li>
        <li>Anonymous submissions allowed via Dark Mode</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Types of bounties on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Bug fixes — pay to get a specific bug squashed</li>
        <li>Feature implementation — get a feature built fast</li>
        <li>Code review — expert eyes on your critical code</li>
        <li>Architecture advice — design review from senior engineers</li>
        <li>Security audit — find vulnerabilities before attackers do</li>
        <li>Performance optimization — make your code faster</li>
        <li>Documentation — get your API or library documented</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Earn money solving bounties</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>Browse open bounties and get paid for your expertise. Every solved bounty earns VOID reputation points on top of the cash reward. Build your reputation while earning money.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse open bounties →</Link>
        <Link href="/bounties/new" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Post a bounty →</Link>
      </div>
    </main>
  );
}
