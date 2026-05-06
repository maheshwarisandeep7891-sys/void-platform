import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guilds — Developer Communities by Tech Stack | VOID",
  description: "Join communities organized by tech stack. Rust Guild, ML/AI Hackers, DevOps & Platform, TypeScript Builders, Systems Programming and more.",
  openGraph: {
    title: "VOID Guilds — Developer Communities",
    description: "Join communities organized by tech stack. Rust, ML/AI, DevOps, TypeScript, Systems Programming.",
    url: "https://void-platform.vercel.app/guilds",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=Developer%20Guilds&subtitle=Communities%20by%20tech%20stack", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Guilds", description: "Developer communities organized by tech stack." },
  alternates: { canonical: "https://void-platform.vercel.app/guilds" },
};

export default function GuildsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
