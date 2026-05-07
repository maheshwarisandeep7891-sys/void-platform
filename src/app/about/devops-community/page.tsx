import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "DevOps Community — SRE and Platform Engineers | VOID",
  description: "DevOps, SRE, and platform engineering community on VOID. Share infrastructure code, ask questions anonymously, find DevOps bounties. CI/CD, Kubernetes, Terraform.",
  alternates: { canonical: "https://void-platform.vercel.app/about/devops-community" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>DevOps Community</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>The DevOps, SRE, and platform engineering community on VOID. Share infrastructure code, CI/CD pipelines, and Terraform configs. Ask questions anonymously. Find DevOps bounties. Connect with engineers who keep systems running.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>DevOps is where software meets operations. VOID's DevOps community covers the full spectrum — from GitHub Actions workflows to Kubernetes operators, from Terraform modules to incident response playbooks. Share what you've learned so others don't have to learn it the hard way.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Join the DevOps community →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What DevOps engineers do on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Share CI/CD pipeline configs and GitHub Actions workflows</li>
        <li>Ask DevOps questions anonymously — no judgment for production mistakes</li>
        <li>Post infrastructure bounties — get paid to solve DevOps problems</li>
        <li>Share post-mortems and incident learnings</li>
        <li>Discuss cloud architecture and cost optimization</li>
        <li>Connect with SREs and platform engineers</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Popular DevOps topics on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>GitHub Actions and GitLab CI pipelines</li>
        <li>Terraform and OpenTofu infrastructure as code</li>
        <li>Kubernetes and Helm deployments</li>
        <li>Docker and container optimization</li>
        <li>AWS, GCP, and Azure cloud architecture</li>
        <li>Observability — Prometheus, Grafana, Datadog</li>
        <li>Security — secrets management, SAST, DAST</li>
        <li>Platform engineering and internal developer platforms</li>
      </ul>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse DevOps Guild →</Link>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View DevOps posts →</Link>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Find DevOps bounties →</Link>
      </div>
    </main>
  );
}
