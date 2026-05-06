import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard — Top Developers by Reputation | VOID",
  description: "Top developers ranked by reputation. NEWCOMER → BUILDER → HACKER → ARCHITECT → LEGEND. Earn points through posts, answers, and bounties.",
  openGraph: {
    title: "VOID Leaderboard — Top Developers",
    description: "Top developers ranked by reputation. Earn points through posts, answers, and bounties.",
    url: "https://void-platform.vercel.app/leaderboard",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=Developer%20Leaderboard&subtitle=Top%20builders%20by%20reputation", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Leaderboard", description: "Top developers ranked by reputation." },
  alternates: { canonical: "https://void-platform.vercel.app/leaderboard" },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
