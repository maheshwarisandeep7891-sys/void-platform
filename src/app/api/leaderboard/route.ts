import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get("period") ?? "all";
    const cacheKey = `leaderboard:${period}`;

    const cached = await getCache(cacheKey);
    if (cached) return NextResponse.json(cached);

    const dateFilter: any = {};
    if (period === "week") {
      dateFilter.gte = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "month") {
      dateFilter.gte = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    const users = await prisma.user.findMany({
      where: {
        reputation: { score: { gt: 0 } },
        ...(period !== "all" && {
          reputationEvents: {
            some: { createdAt: dateFilter },
          },
        }),
      },
      take: 50,
      orderBy: {
        reputation: { score: "desc" },
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        techStack: true,
        reputation: { select: { score: true, level: true } },
        _count: { select: { posts: true, followers: true } },
      },
    });

    const result = { users };
    await setCache(cacheKey, result, 300); // Cache 5 minutes

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
