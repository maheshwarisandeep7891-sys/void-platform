import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const base = "https://void-platform.vercel.app";

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      select: {
        title: true,
        content: true,
        type: true,
        author: { select: { username: true, name: true } },
      },
    });

    if (!post) return {};

    const title = post.title ?? post.content.slice(0, 80);
    const description = post.content.replace(/[#*`]/g, "").slice(0, 160);
    const author = post.author?.username ?? "anonymous";
    const ogTitle = `${title} — by @${author} on VOID`;
    const ogUrl = `${base}/post/${id}`;
    const ogImage = `${base}/api/og?title=${encodeURIComponent(title.slice(0, 60))}&subtitle=${encodeURIComponent(`by @${author} · ${post.type}`)}`;

    return {
      title: ogTitle,
      description,
      openGraph: {
        title: ogTitle,
        description,
        url: ogUrl,
        siteName: "VOID",
        images: [{ url: ogImage, width: 1200, height: 630 }],
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: ogTitle,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return {};
  }
}

export default function PostLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
