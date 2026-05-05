import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Polling endpoint for new posts — works on Vercel serverless
// Client polls this every 10s instead of SSE (which times out on serverless)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const since = searchParams.get("since");
    const sinceDate = since ? new Date(since) : new Date(Date.now() - 30000);

    const newPosts = await prisma.post.findMany({
      where: {
        publishedAt: { not: null },
        isScheduled: false,
        createdAt: { gt: sinceDate },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        author: {
          select: {
            id: true, username: true, name: true, image: true,
            reputation: { select: { score: true, level: true } },
          },
        },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
        _count: { select: { reactions: true, comments: true } },
      },
    });

    return NextResponse.json({
      posts: newPosts,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/feed/stream error:", error);
    return NextResponse.json({ posts: [], timestamp: new Date().toISOString() });
  }
}
