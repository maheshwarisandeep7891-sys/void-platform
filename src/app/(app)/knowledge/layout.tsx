import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Knowledge Base — Q&A for Programmers | VOID",
  description: "Stack Overflow done right. Ask programming questions, get expert answers, vote on quality. Anonymous questions supported. Answers verified by the community.",
  openGraph: {
    title: "VOID Knowledge Base — Developer Q&A",
    description: "Stack Overflow done right. Ask questions, get answers, vote on quality. Anonymous questions supported.",
    url: "https://void-platform.vercel.app/knowledge",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=Knowledge%20Base&subtitle=Developer%20Q%26A%20done%20right", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Knowledge Base", description: "Stack Overflow done right." },
  alternates: { canonical: "https://void-platform.vercel.app/knowledge" },
};

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sr-only">
        <h1>VOID Developer Knowledge Base</h1>
        <p>Stack Overflow done right. Ask programming questions and get expert answers from the developer community.</p>
        <h2>Features of VOID Knowledge Base</h2>
        <ul>
          <li>Ask questions anonymously — no reputation damage for beginner questions</li>
          <li>Vote on answers — upvote helpful answers, downvote incorrect ones</li>
          <li>Accept answers — mark the best answer as accepted</li>
          <li>Still works button — community verifies answers are still current</li>
          <li>Markdown support — format code, lists, and explanations</li>
          <li>Tag system — organize questions by technology</li>
        </ul>
        <h2>Popular topics on VOID Knowledge Base</h2>
        <ul>
          <li>Rust async programming and lifetimes</li>
          <li>Go concurrency patterns and goroutines</li>
          <li>TypeScript type system and generics</li>
          <li>PostgreSQL query optimization and indexing</li>
          <li>Kubernetes deployment and configuration</li>
          <li>Python async/await and FastAPI</li>
          <li>Distributed systems and microservices</li>
        </ul>
      </div>
      {children}
    </>
  );
}
