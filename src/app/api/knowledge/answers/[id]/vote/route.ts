import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardReputation } from "@/lib/reputation";
import { z } from "zod";

const schema = z.object({ value: z.union([z.literal(1), z.literal(-1)]) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { value } = schema.parse(body);

    const existing = await prisma.answerVote.findUnique({
      where: { answerId_userId: { answerId: id, userId: session.user.id } },
    });

    if (existing) {
      if (existing.value === value) {
        // Remove vote
        await prisma.answerVote.delete({ where: { id: existing.id } });
        return NextResponse.json({ action: "removed" });
      }
      // Change vote
      await prisma.answerVote.update({ where: { id: existing.id }, data: { value } });
    } else {
      await prisma.answerVote.create({
        data: { answerId: id, userId: session.user.id, value },
      });
    }

    // Award reputation to answer author
    if (value === 1) {
      const answer = await prisma.answer.findUnique({
        where: { id },
        select: { authorId: true },
      });
      if (answer?.authorId && answer.authorId !== session.user.id) {
        await awardReputation(answer.authorId, "answer_upvote", "Your answer was upvoted");
      }
    }

    return NextResponse.json({ action: "voted", value });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/knowledge/answers/[id]/vote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
