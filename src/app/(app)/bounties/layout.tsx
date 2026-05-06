import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Bounties — Post Problems, Earn Rewards | VOID",
  description: "Post a coding problem with a reward. Community solves it. Escrow-backed payments. Open bounties from $50 to $500+. Anonymous submissions supported.",
  openGraph: {
    title: "VOID Bounties — Developer Problem Solving",
    description: "Post a problem with a reward. Community solves it. Escrow-backed payments. Anonymous submissions supported.",
    url: "https://void-platform.vercel.app/bounties",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=Developer%20Bounties&subtitle=Post%20problems%2C%20earn%20rewards", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Bounties", description: "Post a problem with a reward. Community solves it." },
  alternates: { canonical: "https://void-platform.vercel.app/bounties" },
};

export default function BountiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sr-only">
        <h1>VOID Developer Bounties</h1>
        <p>Post a coding problem with a reward. The developer community solves it. Escrow-backed payments protect both parties.</p>
        <h2>How VOID Bounties work</h2>
        <ol>
          <li>Post your problem with a reward amount</li>
          <li>Developers submit solutions</li>
          <li>You review and accept the best solution</li>
          <li>Payment releases automatically from escrow</li>
          <li>Auto-refund if no solution is accepted</li>
        </ol>
        <h2>Types of bounties on VOID</h2>
        <ul>
          <li>Bug fixes — memory leaks, race conditions, performance issues</li>
          <li>Feature development — build a specific feature</li>
          <li>Code review — review and improve existing code</li>
          <li>Database optimization — query optimization, indexing</li>
          <li>Security audits — find vulnerabilities</li>
          <li>Documentation — write technical documentation</li>
        </ul>
        <p>Anonymous submissions supported via Dark Mode. No account needed to browse bounties.</p>
      </div>
      {children}
    </>
  );
}
