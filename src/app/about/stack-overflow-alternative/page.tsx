import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Stack Overflow Alternative — Better Developer Q&A | VOID",
  description: "A better Stack Overflow alternative. Ask coding questions anonymously, get answers without downvotes, verify answers still work. VOID Knowledge Base for developers.",
  alternates: { canonical: "https://void-platform.vercel.app/about/stack-overflow-alternative" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Stack Overflow Alternative</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>A better place to ask and answer developer questions. VOID Knowledge Base fixes what's broken about Stack Overflow — anonymous questions, no hostile moderation, and a "still works" button to verify answers are current.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Stack Overflow downvotes beginners. Closes questions for being "too basic." Lets stale answers from 2015 sit at the top. VOID Knowledge Base is built for how developers actually work — not how a reputation-obsessed community thinks they should work.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Ask your first question →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What VOID Knowledge Base does differently</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Anonymous questions — ask anything without reputation damage</li>
        <li>No hostile moderation — questions don't get closed for being "too basic"</li>
        <li>"Still works" button — community verifies answers are current</li>
        <li>Upvote/downvote answers based on quality</li>
        <li>Question author marks the accepted answer</li>
        <li>No gamified reputation that rewards speed over quality</li>
        <li>Integrated with the broader VOID developer community</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>The "still works" feature</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>Stack Overflow answers go stale. A solution that worked in 2018 might break your app in 2025. VOID's "still works" button lets the community timestamp-verify answers:</p>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>✓ Still works · verified 2 days ago</li>
        <li>⚠️ May be outdated · last verified 2 years ago</li>
        <li>❌ Broken · reported by 3 developers</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Beyond Q&A</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>VOID is more than a Q&A site. Post bounties for problems you need solved. Share code in the feed. Buy and sell developer tools. Join guilds organized by tech stack. It's a full developer platform.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/knowledge" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse Knowledge Base →</Link>
        <Link href="/knowledge/ask" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Ask a question →</Link>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Post a bounty →</Link>
      </div>
    </main>
  );
}
