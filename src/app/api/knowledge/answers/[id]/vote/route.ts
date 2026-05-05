import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { awardReputation } from "@/lib/reputation";

const schema = z.object({
  value: z.union([z.literal(1), z.literal(-1)]),
});

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
      } else {
        // Change vote
        await prisma.answerVote.update({
          where: { id: existing.id },
          data: { value },
        });
      }
    } else {
      await prisma.answerVote.create({
        data: { answerId: id, userId: session.user.id, value },
      });

      // Award reputation to answer author
      const answer = await prisma.answer.findUnique({
        where: { id },
        select: { authorId: true },
      });
      if (answer?.authorId && answer.authorId !== session.user.id) {
        await awardReputation(
          answer.authorId,
          value === 1 ? "answer_upvote" : "answer_downvote",
          `Your answer received a ${value === 1 ? "upvote" : "downvote"}`
        );
      }
    }

    const votes = await prisma.answerVote.findMany({
      where: { answerId: id },
      select: { value: true, userId: true },
    });

    return NextResponse.json({ votes });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/knowledge/answers/[id]/vote error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
