import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Buy API Credits — OpenAI, Anthropic, Google AI | VOID",
  description: "Buy discounted API credits for OpenAI, Anthropic, Google AI, and more. Developers sell unused API credits on VOID marketplace. Save money on AI API costs.",
  alternates: { canonical: "https://void-platform.vercel.app/about/buy-api-credits" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Buy API Credits</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>Buy discounted API credits for OpenAI, Anthropic, Google AI, and other AI services. Developers with unused credits sell them on VOID — often at a significant discount.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Projects get cancelled. Budgets change. Developers end up with API credits they'll never use. VOID's developer marketplace connects buyers and sellers with built-in escrow — no Stripe required, no platform fees eating into your savings.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Browse API credits →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>API credits available on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>OpenAI API credits (GPT-4, GPT-4o, o1)</li>
        <li>Anthropic Claude API credits</li>
        <li>Google AI / Gemini API credits</li>
        <li>Cohere API credits</li>
        <li>Replicate credits for image and video models</li>
        <li>AWS Bedrock credits</li>
        <li>Azure OpenAI credits</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>How buying API credits on VOID works</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Browse listings from verified developers</li>
        <li>Pay into built-in escrow — funds held until delivery confirmed</li>
        <li>Seller transfers credits or shares account access</li>
        <li>Confirm receipt → payment releases automatically</li>
        <li>Auto-refund if seller doesn't deliver within 7 days</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Also sell your unused API credits</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>Have leftover API credits from a cancelled project? List them on VOID in 2 minutes. Reach thousands of developers actively looking to buy.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/marketplace" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse marketplace →</Link>
        <Link href="/marketplace/new" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Sell your credits →</Link>
      </div>
    </main>
  );
}
