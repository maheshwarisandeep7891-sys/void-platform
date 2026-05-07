import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Sell Unused SaaS Seats — GitHub Copilot, JetBrains | VOID",
  description: "Sell unused SaaS seats for GitHub Copilot, JetBrains, Linear, Notion, and more. Turn idle software licenses into cash on VOID developer marketplace.",
  alternates: { canonical: "https://void-platform.vercel.app/about/sell-saas-seats" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Sell Unused SaaS Seats</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>Turn idle software licenses into cash. Sell unused GitHub Copilot seats, JetBrains licenses, Linear seats, and more on VOID — the developer marketplace built for programmers.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Teams downsize. Projects end. Developers switch tools. Every month, thousands of SaaS seats go unused while companies keep paying for them. VOID lets you recoup that cost by selling to developers who actually need them.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>List your SaaS seats →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>Popular SaaS seats sold on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>GitHub Copilot Individual and Business seats</li>
        <li>JetBrains All Products Pack licenses</li>
        <li>Linear team seats</li>
        <li>Notion team seats</li>
        <li>Figma professional seats</li>
        <li>Vercel Pro and Team seats</li>
        <li>Datadog and monitoring tool seats</li>
        <li>1Password Teams seats</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>How to sell SaaS seats on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Create a listing in 2 minutes — describe what you're selling</li>
        <li>Set your price — you keep the majority</li>
        <li>Buyer pays into escrow — funds held securely</li>
        <li>Transfer the seat or license to the buyer</li>
        <li>Buyer confirms → you get paid instantly</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Buy discounted SaaS seats</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>Looking to save on developer tools? Browse VOID marketplace for discounted SaaS seats from developers who no longer need them. Same tools, lower price.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/marketplace" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse marketplace →</Link>
        <Link href="/marketplace/new" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Sell your seats →</Link>
      </div>
    </main>
  );
}
