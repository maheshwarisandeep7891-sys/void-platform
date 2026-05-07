import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Python Developer Community | VOID",
  description: "Python developer community on VOID. Share Python code, ask questions anonymously, find Python bounties, discuss ML/AI, web dev, and automation. Join free.",
  alternates: { canonical: "https://void-platform.vercel.app/about/python-developer-community" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Python Developer Community</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>The Python developer community on VOID. From Django backends to PyTorch models, from automation scripts to data pipelines — VOID is where Python developers share code, ask questions, and find paid work.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Python powers everything from web apps to AI research. VOID's Python community spans the full ecosystem — web developers, data scientists, ML engineers, and automation specialists all sharing knowledge on a platform built exclusively for developers.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Join the Python community →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What Python developers do on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Share Python code snippets and scripts</li>
        <li>Ask Python questions anonymously — no judgment</li>
        <li>Post Python bounties — get paid to solve Python problems</li>
        <li>Discuss Python packaging, virtual environments, and tooling</li>
        <li>Share Python libraries and open source projects</li>
        <li>Connect with Python ML/AI engineers</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Popular Python topics on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Python async/await and asyncio</li>
        <li>FastAPI and modern Python web development</li>
        <li>Python for machine learning (PyTorch, scikit-learn)</li>
        <li>Python data engineering (Pandas, Polars, DuckDB)</li>
        <li>Python packaging with uv and pyproject.toml</li>
        <li>Python type hints and mypy</li>
        <li>Python automation and scripting</li>
        <li>Django and Flask web frameworks</li>
      </ul>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse Python Guild →</Link>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View Python posts →</Link>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Find Python bounties →</Link>
      </div>
    </main>
  );
}
