import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Kubernetes Developer Community — DevOps Engineers | VOID",
  description: "Kubernetes and DevOps community on VOID. Share K8s configs, ask questions anonymously, find Kubernetes bounties, discuss Helm, Argo, and cloud-native tools.",
  alternates: { canonical: "https://void-platform.vercel.app/about/kubernetes-community" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>Kubernetes Community</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>The Kubernetes and cloud-native community on VOID. Share K8s manifests, Helm charts, and Terraform configs. Ask questions anonymously. Find DevOps bounties. Connect with SREs and platform engineers.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>Kubernetes is complex. Production incidents happen at 3am. VOID is where DevOps engineers and SREs share hard-won knowledge, post anonymously about outages, and find experts to help solve infrastructure problems.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Join the K8s community →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What K8s engineers do on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Share Kubernetes manifests and Helm charts</li>
        <li>Ask K8s questions anonymously — no judgment for production mistakes</li>
        <li>Post DevOps bounties — get paid to solve infrastructure problems</li>
        <li>Discuss cloud-native architecture and best practices</li>
        <li>Share post-mortems and incident learnings</li>
        <li>Connect with SREs and platform engineers</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Popular Kubernetes topics on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Kubernetes networking — CNI, ingress, service mesh</li>
        <li>Helm chart development and best practices</li>
        <li>ArgoCD and GitOps workflows</li>
        <li>Kubernetes operators and CRDs</li>
        <li>K8s security — RBAC, network policies, pod security</li>
        <li>Kubernetes on EKS, GKE, and AKS</li>
        <li>Observability — Prometheus, Grafana, OpenTelemetry</li>
        <li>Terraform and infrastructure as code</li>
      </ul>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse DevOps Guild →</Link>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View K8s posts →</Link>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Find DevOps bounties →</Link>
      </div>
    </main>
  );
}
