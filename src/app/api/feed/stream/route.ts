import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// SSE endpoint — streams new posts to connected clients
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  // Get the latest post ID at connection time
  const latestPost = await prisma.post.findFirst({
    where: { publishedAt: { not: null }, isScheduled: false },
    orderBy: { createdAt: "desc" },
    select: { id: true, createdAt: true },
  });

  let lastSeenId = latestPost?.id ?? null;
  let lastSeenTime = latestPost?.createdAt ?? new Date();

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection event
      controller.enqueue(
        encoder.encode(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`)
      );

      // Poll every 8 seconds for new posts
      const interval = setInterval(async () => {
        try {
          const newPosts = await prisma.post.findMany({
            where: {
              publishedAt: { not: null },
              isScheduled: false,
              createdAt: { gt: lastSeenTime },
            },
            orderBy: { createdAt: "desc" },
            take: 5,
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

          if (newPosts.length > 0) {
            lastSeenTime = newPosts[0].createdAt;
            lastSeenId = newPosts[0].id;

            controller.enqueue(
              encoder.encode(
                `event: new_posts\ndata: ${JSON.stringify({ posts: newPosts })}\n\n`
              )
            );
          }

          // Send heartbeat
          controller.enqueue(
            encoder.encode(`event: heartbeat\ndata: ${JSON.stringify({ ts: Date.now() })}\n\n`)
          );
        } catch {
          // Silently ignore poll errors
        }
      }, 8000);

      // Clean up on disconnect
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
