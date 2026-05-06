import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dark Mode — Anonymous Posting for Developers | VOID",
  description: "Go fully anonymous with one click. Random handle, zero link to your real identity. Ask anything without reputation damage. Built for developers.",
  openGraph: {
    title: "VOID Dark Mode — Anonymous Developer Posting",
    description: "Go fully anonymous with one click. Ask anything without reputation damage.",
    url: "https://void-platform.vercel.app/dark",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=%F0%9F%96%A4%20Dark%20Mode&subtitle=Anonymous%20posting%20for%20developers", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Dark Mode", description: "Go fully anonymous with one click." },
  alternates: { canonical: "https://void-platform.vercel.app/dark" },
};

export default function DarkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
