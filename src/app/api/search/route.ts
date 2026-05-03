import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return NextResponse.json({ posts: [], listings: [], questions: [], users: [] });
    }

    const cacheKey = `search:${q.toLowerCase().slice(0, 50)}`;
    const cached = await getCache(cacheKey);
    if (cached) return NextResponse.json(cached);

    const searchFilter = { contains: q, mode: "insensitive" as const };

    const [posts, listings, questions, users] = await Promise.all([
      prisma.post.findMany({
        where: {
          publishedAt: { not: null },
          OR: [
            { title: searchFilter },
            { content: searchFilter },
          ],
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          type: true,
          title: true,
          content: true,
          createdAt: true,
          author: { select: { username: true } },
        },
      }),
      prisma.listing.findMany({
        where: {
          status: "ACTIVE",
          OR: [
            { title: searchFilter },
            { description: searchFilter },
          ],
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          type: true,
          price: true,
          seller: { select: { username: true } },
        },
      }),
      prisma.question.findMany({
        where: {
          OR: [
            { title: searchFilter },
            { content: searchFilter },
          ],
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          author: { select: { username: true } },
          _count: { select: { answers: true } },
        },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { username: searchFilter },
            { name: searchFilter },
            { bio: searchFilter },
          ],
        },
        take: 5,
        select: {
          id: true,
          username: true,
          name: true,
          image: true,
          reputation: { select: { score: true, level: true } },
        },
      }),
    ]);

    const result = { posts, listings, questions, users };
    await setCache(cacheKey, result, 60);

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
