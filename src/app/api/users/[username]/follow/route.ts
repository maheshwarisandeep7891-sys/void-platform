import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardReputation } from "@/lib/reputation";
import { deleteCache } from "@/lib/redis";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await params;

    const targetUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: targetUser.id,
        },
      },
    });

    if (existing) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: targetUser.id,
          },
        },
      });
      await deleteCache(`user:${username}`);
      return NextResponse.json({ following: false });
    }

    // Follow
    await prisma.follow.create({
      data: { followerId: session.user.id, followingId: targetUser.id },
    });

    // Notify the followed user
    await prisma.notification.create({
      data: {
        userId: targetUser.id,
        type: "FOLLOW",
        title: "New follower",
        body: `@${(session.user as any).username} started following you`,
        link: `/profile/${(session.user as any).username}`,
      },
    });

    await deleteCache(`user:${username}`);
    return NextResponse.json({ following: true });
  } catch (error) {
    console.error("POST /api/users/[username]/follow error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
