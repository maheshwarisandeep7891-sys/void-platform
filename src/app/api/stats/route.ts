import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";

export async function GET() {
  try {
    const cacheKey = "platform:stats";
    const cached = await getCache(cacheKey);
    if (cached) return NextResponse.json(cached);

    const [users, posts, questions, bounties, listings, guilds] = await Promise.all([
      prisma.user.count(),
      prisma.post.count({ where: { publishedAt: { not: null } } }),
      prisma.question.count(),
      prisma.bounty.count(),
      prisma.listing.count({ where: { status: "ACTIVE" } }),
      prisma.guild.count(),
    ]);

    // Sum bounty rewards
    const bountyRewards = await prisma.bounty.aggregate({
      _sum: { reward: true },
      where: { status: "COMPLETED" },
    });

    const stats = {
      users,
      posts,
      questions,
      bounties,
      listings,
      guilds,
      bountyRewardsPaid: bountyRewards._sum.reward ?? 0,
    };

    await setCache(cacheKey, stats, 300); // cache 5 min
    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/stats error:", error);
    // Return fallback stats on error
    return NextResponse.json({
      users: 0, posts: 0, questions: 0,
      bounties: 0, listings: 0, guilds: 0, bountyRewardsPaid: 0,
    });
  }
}
