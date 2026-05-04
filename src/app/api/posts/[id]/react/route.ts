import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardReputation } from "@/lib/reputation";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["used_this", "saved_me_hours", "brilliant"]),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { type } = schema.parse(body);

    // Toggle reaction
    const existing = await prisma.postReaction.findUnique({
      where: {
        postId_userId_type: { postId: id, userId: session.user.id, type },
      },
    });

    if (existing) {
      await prisma.postReaction.delete({ where: { id: existing.id } });
      return NextResponse.json({ action: "removed" });
    }

    await prisma.postReaction.create({
      data: { postId: id, userId: session.user.id, type },
    });

    // Award reputation to post author
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (post?.authorId && post.authorId !== session.user.id) {
      await awardReputation(
        post.authorId,
        "post_reaction",
        `Someone reacted "${type}" to your post`
      );
    }

    return NextResponse.json({ action: "added" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/posts/[id]/react error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
