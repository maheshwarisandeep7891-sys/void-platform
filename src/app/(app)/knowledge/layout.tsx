import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge Base — Developer Q&A | VOID",
  description: "Stack Overflow done right. Ask questions, get answers, vote on quality. Anonymous questions supported. Answers verified by the community.",
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
  return <>{children}</>;
}
