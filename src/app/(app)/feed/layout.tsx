import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feed — VOID Developer Platform",
  description: "What developers are shipping. Code snippets, threads, project drops, and technical discussions from 500+ builders.",
  openGraph: {
    title: "VOID Feed — Developer Social Network",
    description: "What developers are shipping. Code snippets, threads, project drops, and technical discussions.",
    url: "https://void-platform.vercel.app/feed",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=Developer%20Feed&subtitle=What%20builders%20are%20shipping", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Feed", description: "What developers are shipping right now." },
  alternates: { canonical: "https://void-platform.vercel.app/feed" },
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
