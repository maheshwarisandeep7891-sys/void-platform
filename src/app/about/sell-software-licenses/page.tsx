import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Sell Unused Software Licenses | VOID",
  description: "Sell unused software licenses on VOID developer marketplace. IDE licenses, design tools, productivity apps — turn idle licenses into cash with built-in escrow.",
  alternates: { canonical: "https://void-platform.vercel.app/about/sell-software-licenses" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Sell Unused Software Licenses</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>Turn idle software licenses into cash. Sell unused IDE licenses, design tools, productivity apps, and developer software on VOID — the marketplace built for developers, with built-in escrow and zero Stripe setup.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>You bought a JetBrains license and switched to VS Code. You have a Sketch license but your team moved to Figma. You have a Sublime Text license you haven't opened in years. VOID lets you sell these to developers who actually need them.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>List your license →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>Software licenses sold on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>JetBrains IDE licenses (IntelliJ, PyCharm, WebStorm, etc.)</li>
        <li>Sublime Text licenses</li>
        <li>Sketch design tool licenses</li>
        <li>Affinity Designer and Photo licenses</li>
        <li>Tower Git client licenses</li>
        <li>Proxyman and Charles Proxy licenses</li>
        <li>TablePlus database client licenses</li>
        <li>Dash documentation browser licenses</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>How to sell software licenses on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Check your license terms — most perpetual licenses are transferable</li>
        <li>Create a listing with the license details and proof of purchase</li>
        <li>Set your price — you keep the majority</li>
        <li>Buyer pays into escrow</li>
        <li>Transfer the license key or account</li>
        <li>Buyer confirms → payment releases instantly</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Buy discounted software licenses</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>Looking to save on developer tools? Browse VOID marketplace for discounted software licenses from developers who switched tools. Same software, lower price, legitimate transfer.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/marketplace" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse marketplace →</Link>
        <Link href="/marketplace/new" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Sell your license →</Link>
      </div>
    </main>
  );
}
