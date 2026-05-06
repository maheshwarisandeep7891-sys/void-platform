import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const base = "https://void-platform.vercel.app";

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        name: true,
        bio: true,
        image: true,
        techStack: true,
        reputation: { select: { score: true, level: true } },
        _count: { select: { posts: true, followers: true } },
      },
    });

    if (!user) return {};

    const title = `@${username} — ${user.reputation?.level ?? "NEWCOMER"} on VOID`;
    const description = user.bio ?? `${user.name ?? username} is a developer on VOID. ${user._count.posts} posts · ${user._count.followers} followers · ${user.techStack.slice(0, 3).join(", ")}`;
    const ogImage = `${base}/api/og?title=${encodeURIComponent(`@${username}`)}&subtitle=${encodeURIComponent(`${user.reputation?.level ?? "NEWCOMER"} · ${user.reputation?.score ?? 0} pts`)}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${base}/profile/${username}`,
        siteName: "VOID",
        images: [{ url: user.image ?? ogImage, width: 400, height: 400 }],
        type: "profile",
      },
      twitter: {
        card: "summary",
        title,
        description,
        images: [user.image ?? ogImage],
      },
    };
  } catch {
    return {};
  }
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
