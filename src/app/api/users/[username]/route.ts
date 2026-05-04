import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getCache, setCache } from "@/lib/redis";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const cacheKey = `user:${username}`;

    // Try cache first
    const cached = await getCache(cacheKey);
    if (cached) return NextResponse.json(cached);

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        bannerImage: true,
        bio: true,
        githubUrl: true,
        websiteUrl: true,
        twitterUrl: true,
        techStack: true,
        openToHire: true,
        openToCollaborate: true,
        openToMentor: true,
        openToTrade: true,
        createdAt: true,
        reputation: { select: { score: true, level: true } },
        _count: {
          select: {
            posts: true,
            followers: true,
            following: true,
            listings: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if current user follows this user
    const session = await getSession(req);
    let isFollowing = false;
    if (session?.user?.id && session.user.id !== user.id) {
      const follow = await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: user.id,
          },
        },
      });
      isFollowing = !!follow;
    }

    const result = { ...user, isFollowing };
    await setCache(cacheKey, result, 60); // Cache for 1 minute

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/users/[username] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
