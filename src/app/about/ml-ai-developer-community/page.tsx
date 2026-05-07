import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "ML/AI Developer Community — Machine Learning Engineers | VOID",
  description: "ML and AI developer community on VOID. Share model code, discuss LLMs, ask questions anonymously, find ML bounties, buy GPU access. Join ML engineers on VOID.",
  alternates: { canonical: "https://void-platform.vercel.app/about/ml-ai-developer-community" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>ML/AI Developer Community</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>The machine learning and AI developer community on VOID. Share model code, discuss LLM architectures, ask questions anonymously, find ML bounties, and buy discounted GPU access and API credits.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>ML development is expensive and fast-moving. VOID helps ML engineers share knowledge, find affordable compute, and connect with other practitioners — from researchers fine-tuning foundation models to indie developers building AI-powered products.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Join the ML community →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What ML developers do on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Share model training code and evaluation scripts</li>
        <li>Ask ML questions anonymously — no judgment for "dumb" questions</li>
        <li>Post ML bounties — get paid to solve AI/ML problems</li>
        <li>Buy discounted GPU access and API credits</li>
        <li>Discuss LLM fine-tuning, RAG, and inference optimization</li>
        <li>Share research findings and experiment results</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Popular ML/AI topics on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>LLM fine-tuning with LoRA and QLoRA</li>
        <li>RAG (Retrieval-Augmented Generation) architectures</li>
        <li>PyTorch and JAX model development</li>
        <li>Hugging Face Transformers and Diffusers</li>
        <li>LLM inference optimization (vLLM, llama.cpp)</li>
        <li>Vector databases (Pinecone, Weaviate, Chroma)</li>
        <li>ML ops and model deployment</li>
        <li>Prompt engineering and evaluation</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>ML resources on VOID marketplace</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>Buy discounted GPU access, API credits, and ML tools from other developers. Save on compute costs while supporting the community.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse ML Guild →</Link>
        <Link href="/marketplace" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Buy GPU/API credits →</Link>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Find ML bounties →</Link>
      </div>
    </main>
  );
}
