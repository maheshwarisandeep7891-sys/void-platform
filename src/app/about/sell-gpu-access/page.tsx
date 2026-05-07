import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Sell GPU Access — Rent GPU Time to ML Developers | VOID",
  description: "Sell idle GPU access to ML developers and researchers. Rent out your GPU time on VOID marketplace. Built-in escrow, developer-only buyers, easy listing.",
  alternates: { canonical: "https://void-platform.vercel.app/about/sell-gpu-access" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Sell GPU Access</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>Your GPU sits idle 20 hours a day. ML developers and researchers need compute. VOID marketplace connects GPU owners with developers who need affordable compute time — with built-in escrow and zero setup friction.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Cloud GPU costs are brutal. A single A100 hour on AWS costs $3-4. Developers with gaming rigs, workstations, or home servers can offer compute at a fraction of cloud prices — and earn money from hardware that would otherwise sit idle.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>List your GPU →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What GPU sellers offer on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>NVIDIA RTX 3090/4090 compute time</li>
        <li>NVIDIA A100 and H100 access</li>
        <li>AMD RX 7900 XTX compute</li>
        <li>Multi-GPU workstation access</li>
        <li>SSH access to GPU servers</li>
        <li>Jupyter notebook environments with GPU</li>
        <li>Docker containers with CUDA pre-installed</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Who buys GPU access on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>ML engineers fine-tuning language models</li>
        <li>Researchers running experiments on a budget</li>
        <li>Indie developers training custom models</li>
        <li>Startups avoiding expensive cloud GPU bills</li>
        <li>Students working on ML projects</li>
        <li>Developers testing GPU-accelerated code</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>How GPU rental works on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>List your GPU with specs, availability, and hourly rate</li>
        <li>Buyer pays into escrow for the agreed time block</li>
        <li>Provide SSH access or remote desktop</li>
        <li>Buyer confirms usage → payment releases</li>
        <li>Built-in dispute resolution for issues</li>
      </ul>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/marketplace" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse GPU listings →</Link>
        <Link href="/marketplace/new" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>List your GPU →</Link>
      </div>
    </main>
  );
}
