import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bounties — Solve Problems, Earn Rewards | VOID",
  description: "Post a problem with a reward. Community solves it. Escrow-backed payments. Open bounties from $50 to $500+.",
  openGraph: {
    title: "VOID Bounties — Developer Problem Solving",
    description: "Post a problem with a reward. Community solves it. Escrow-backed payments.",
    url: "https://void-platform.vercel.app/bounties",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=Developer%20Bounties&subtitle=Post%20problems%2C%20earn%20rewards", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Bounties", description: "Post a problem with a reward. Community solves it." },
  alternates: { canonical: "https://void-platform.vercel.app/bounties" },
};

export default function BountiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
