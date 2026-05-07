import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "TypeScript Developer Community | VOID",
  description: "TypeScript developer community on VOID. Share TS code, discuss type systems, ask questions anonymously, find TypeScript bounties. Join thousands of TS developers.",
  alternates: { canonical: "https://void-platform.vercel.app/about/typescript-developers" },
};
export default function Page() {
  return (
    <main style={{fontFamily:"system-ui,sans-serif",maxWidth:800,margin:"0 auto",padding:"40px 20px",background:"#050508",color:"#f0f0ff"}}>
      <nav style={{marginBottom:32}}><Link href="/" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700,fontSize:20}}>← VOID</Link></nav>
      <h1 style={{fontSize:36,fontWeight:900,marginBottom:16}}>TypeScript Developer Community</h1>
      <p style={{fontSize:18,color:"#94a3b8",marginBottom:16}}>The TypeScript developer community on VOID. Share type-safe code, debate advanced TS patterns, ask questions without judgment, and connect with other TypeScript engineers building production systems.</p>
      <p style={{fontSize:16,color:"#94a3b8",marginBottom:32}}>TypeScript has become the default for serious JavaScript development. VOID is where TS developers go beyond the basics — discussing conditional types, template literal types, and the dark arts of the TypeScript compiler.</p>
      <Link href="/auth/signin" style={{display:"inline-block",background:"#8b5cf6",color:"white",padding:"12px 24px",borderRadius:12,textDecoration:"none",fontWeight:700,fontSize:16,marginBottom:48}}>Join the TypeScript community →</Link>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16}}>What TypeScript developers do on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Share TypeScript code snippets and type utilities</li>
        <li>Ask TS questions anonymously — no reputation damage</li>
        <li>Post TypeScript bounties — get paid to solve TS problems</li>
        <li>Discuss tsconfig options and compiler settings</li>
        <li>Share TypeScript libraries and open source projects</li>
        <li>Debate type-first vs runtime-first approaches</li>
      </ul>
      <h2 style={{fontSize:24,fontWeight:700,marginBottom:16,marginTop:40}}>Popular TypeScript topics on VOID</h2>
      <ul style={{color:"#94a3b8",lineHeight:2,paddingLeft:24}}>
        <li>Advanced TypeScript types — conditional, mapped, template literal</li>
        <li>TypeScript with React and Next.js</li>
        <li>TypeScript for Node.js backends</li>
        <li>Zod, Valibot, and runtime type validation</li>
        <li>TypeScript monorepos with Turborepo</li>
        <li>tRPC and end-to-end type safety</li>
        <li>TypeScript performance — speeding up tsc</li>
        <li>Migrating JavaScript codebases to TypeScript</li>
      </ul>
      <div style={{marginTop:40,display:"flex",gap:24,flexWrap:"wrap"}}>
        <Link href="/guilds" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Browse TypeScript Guild →</Link>
        <Link href="/feed" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>View TS posts →</Link>
        <Link href="/bounties" style={{color:"#a78bfa",textDecoration:"none",fontWeight:700}}>Find TS bounties →</Link>
      </div>
    </main>
  );
}
