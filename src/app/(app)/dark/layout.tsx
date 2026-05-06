import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anonymous Developer Posting — Dark Mode | VOID",
  description: "Go fully anonymous with one click. Random handle every session. Zero link to your real identity. Ask anything without reputation damage. Built for developers.",
  openGraph: {
    title: "VOID Dark Mode — Anonymous Developer Posting",
    description: "Go fully anonymous with one click. Ask anything without reputation damage. Zero link to your real identity.",
    url: "https://void-platform.vercel.app/dark",
    siteName: "VOID",
    images: [{ url: "https://void-platform.vercel.app/api/og?title=Dark%20Mode&subtitle=Anonymous%20posting%20for%20developers", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "VOID Dark Mode — Anonymous Posting", description: "Go fully anonymous with one click." },
  alternates: { canonical: "https://void-platform.vercel.app/dark" },
};

export default function DarkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="sr-only">
        <h1>VOID Dark Mode — Anonymous Developer Posting</h1>
        <p>Go fully anonymous with one click. VOID Dark Mode gives you a completely anonymous identity for posting, asking questions, and browsing.</p>
        <h2>How VOID Dark Mode works</h2>
        <ul>
          <li>One click to enable — no setup required</li>
          <li>Random handle generated every session — like ghost_0x7f or null_ptr_42</li>
          <li>Zero link to your real account — ever</li>
          <li>Platform stores no connection between your identity and dark mode sessions</li>
          <li>Posts labeled with dark icon so community knows they are anonymous</li>
          <li>Full platform access — post, ask questions, submit bounties anonymously</li>
        </ul>
        <h2>Why developers use Dark Mode</h2>
        <ul>
          <li>Ask beginner questions without reputation damage</li>
          <li>Post controversial technical opinions</li>
          <li>Share embarrassing debugging stories</li>
          <li>Ask for salary and career advice</li>
          <li>Discuss sensitive workplace topics</li>
        </ul>
        <p>Keyboard shortcut: Cmd+Shift+D to toggle Dark Mode from anywhere on VOID.</p>
      </div>
      {children}
    </>
  );
}
