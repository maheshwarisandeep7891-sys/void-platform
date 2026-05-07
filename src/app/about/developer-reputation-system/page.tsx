import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Developer Reputation System — Exportable Credentials | VOID",
  description: "VOID's developer reputation system tracks your contributions and lets you export verifiable credentials. Earn points, level up, and prove your expertise to employers.",
  alternates: { canonical: "https://void-platform.vercel.app/about/developer-reputation-system" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Developer Reputation System</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>VOID's reputation system tracks your real contributions to the developer community — not just job titles or GitHub commit counts. Earn points, level up, and export verifiable credentials you can put on your resume.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Your GitHub shows code. Your LinkedIn shows job titles. Neither shows your actual impact on the developer community. VOID reputation is portable, verifiable, and earned through genuine contributions — not gaming algorithms.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Start building reputation →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>How you earn reputation on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Post a code snippet or technical thread → +1 pt</li>
        <li>Someone reacts to your post → +2 pts</li>
        <li>Your answer gets accepted in Knowledge → +25 pts</li>
        <li>Complete a bounty → +50 pts</li>
        <li>Sell on the marketplace → +10 pts per transaction</li>
        <li>Receive a positive review → +15 pts</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Reputation levels</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>🌱 NEWCOMER — just getting started</li>
        <li>🔨 BUILDER — active contributor</li>
        <li>💻 HACKER — established community member</li>
        <li>🏗️ ARCHITECT — respected expert</li>
        <li>⚡ LEGEND — top 1% of contributors</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Export your reputation credentials</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>Export your VOID reputation as a signed JSON credential. Put it on your resume, link it from your GitHub profile, or share it with potential employers. Verifiable proof of your developer contributions.</p>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Signed JSON credential with your score and level</li>
        <li>Verifiable by anyone with the VOID public key</li>
        <li>Includes contribution breakdown by category</li>
        <li>Timestamped and tamper-proof</li>
      </ul>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/leaderboard" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View leaderboard →</Link>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Start contributing →</Link>
      </div>
    </main>
  );
}
