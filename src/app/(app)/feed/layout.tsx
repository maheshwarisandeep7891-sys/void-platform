import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Feed — Code Snippets, Threads & Project Drops | VOID",
  description: "What developers are shipping. Code snippets, threads, project drops, and technical discussions from 500+ builders. No algorithm. Just builders.",
  openGraph: {
    title: "VOID Feed — Developer Social Network",
    description: "What developers are shipping. Code snippets, threads, project drops, and technical discussions from 500+ builders.",
    url: "https://void-platform.vercel.app/feed",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=Developer%20Feed&subtitle=What%20builders%20are%20shipping", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Feed", description: "What developers are shipping right now." },
  alternates: { canonical: "https://void-platform.vercel.app/feed" },
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Static content for Google crawlers — hidden visually but readable by bots */}
      <div className="sr-only">
        <h1>VOID Developer Feed</h1>
        <p>What developers are shipping. Share code snippets, threads, project drops, and technical discussions. No algorithm manipulation. No engagement bait. Just builders building things.</p>
        <p>Features: Code snippet sharing with syntax highlighting, Markdown support, Anonymous posting via Dark Mode, Reactions and comments, Infinite scroll feed, Filter by technology stack</p>
        <p>Join 500+ developers already on VOID. Free to join with GitHub login.</p>
      </div>
      {children}
    </>
  );
}
