import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const base = "https://void-platform.vercel.app";

  try {
    const bounty = await prisma.bounty.findUnique({
      where: { id },
      select: { title: true, description: true, reward: true, currency: true, tags: true },
    });

    if (!bounty) return {};

    const title = `$${bounty.reward} Bounty: ${bounty.title} — VOID`;
    const description = bounty.description.slice(0, 160);
    const ogImage = `${base}/api/og?title=${encodeURIComponent(`$${bounty.reward} Bounty`)}&subtitle=${encodeURIComponent(bounty.title.slice(0, 60))}`;

    return {
      title,
      description,
      openGraph: { title, description, url: `${base}/bounties/${id}`, siteName: "VOID", images: [{ url: ogImage, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", title, description, images: [ogImage] },
    };
  } catch {
    return {};
  }
}

export default function BountyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
