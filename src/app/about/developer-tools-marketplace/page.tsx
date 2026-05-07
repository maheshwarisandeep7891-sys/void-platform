import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Developer Tools Marketplace — Buy and Sell Dev Resources | VOID",
  description: "The developer tools marketplace on VOID. Buy and sell dev tools, scripts, templates, boilerplates, and automation. Built-in escrow. Developer-only buyers and sellers.",
  alternates: { canonical: "https://void-platform.vercel.app/about/developer-tools-marketplace" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Developer Tools Marketplace</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>Buy and sell developer tools, scripts, templates, and automation on VOID. The marketplace built exclusively for developers — with built-in escrow, developer-only buyers, and zero Stripe setup required.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>You've built tools that save you hours every week. Other developers would pay for them. VOID marketplace connects developers who build useful tools with developers who need them — from CLI utilities to deployment scripts to SaaS boilerplates.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Browse dev tools →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>Developer tools sold on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>CLI tools and shell scripts</li>
        <li>VS Code extensions and IDE plugins</li>
        <li>Next.js, React, and SaaS boilerplates</li>
        <li>GitHub Actions and CI/CD templates</li>
        <li>Terraform modules and infrastructure templates</li>
        <li>Database schemas and migration scripts</li>
        <li>API clients and SDK wrappers</li>
        <li>Monitoring dashboards and alert configs</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Also available on VOID marketplace</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>API credits — OpenAI, Anthropic, and more</li>
        <li>SaaS seats — GitHub Copilot, JetBrains, Linear</li>
        <li>GPU access — rent compute for ML workloads</li>
        <li>Software licenses — IDEs, design tools, productivity apps</li>
        <li>Side projects and SaaS products</li>
        <li>Consulting time and code review sessions</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Sell your developer tools</h2>
      <p style={{color:"#94a3b8",marginBottom:16}}>List your tools in 2 minutes. Reach thousands of developers actively looking for solutions. Built-in escrow means you get paid when the buyer confirms delivery — no payment processor setup required.</p>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/marketplace" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse marketplace →</Link>
        <Link href="/marketplace/new" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Sell your tools →</Link>
      </div>
    </main>
  );
}
