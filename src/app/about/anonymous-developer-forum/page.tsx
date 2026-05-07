import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Anonymous Developer Forum — Ask Anything Without Judgment | VOID",
  description: "Anonymous developer forum where you can ask any coding question without reputation damage. VOID Dark Mode gives you a random identity. No link to your real account.",
  alternates: { canonical: "https://void-platform.vercel.app/about/anonymous-developer-forum" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Anonymous Developer Forum</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>Ask any coding question without judgment. VOID's Dark Mode gives you a completely anonymous identity — one click and you become a random ghost handle with zero link to your real account.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Developers are afraid to ask "dumb" questions publicly. Stack Overflow downvotes. Twitter mocks. VOID Dark Mode lets you ask anything — beginner questions, embarrassing bugs, controversial opinions — without risking your professional reputation.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Try anonymous posting →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>How VOID anonymous posting works</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Click "Dark Mode" — one click, instant anonymous identity</li>
        <li>You become a random ghost handle (e.g. ghost_0x7f)</li>
        <li>Zero cryptographic link to your real account</li>
        <li>Post questions, share opinions, ask for help</li>
        <li>Switch back to your real identity anytime</li>
        <li>Your dark mode history is never connected to you</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>What developers ask anonymously</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>"I've been a senior dev for 5 years and still don't understand X"</li>
        <li>Salary and compensation questions</li>
        <li>Embarrassing bugs that took days to find</li>
        <li>Controversial opinions about frameworks and languages</li>
        <li>Questions about workplace situations</li>
        <li>Beginner questions without fear of being mocked</li>
        <li>Honest feedback requests on code or projects</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Beyond anonymous posting</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>VOID is a full developer platform — not just an anonymous forum. Share code, find bounties, buy and sell dev tools, join guilds organized by tech stack. Anonymous posting is just one feature.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/dark" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Enter Dark Mode →</Link>
        <Link href="/knowledge" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse Q&A →</Link>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View feed →</Link>
      </div>
    </main>
  );
}
