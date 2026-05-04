import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardReputation } from "@/lib/reputation";

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

    const answer = await prisma.answer.findUnique({
      where: { id },
      include: { question: { select: { authorId: true, id: true } } },
    });

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    // Only question author can accept
    if (answer.question.authorId !== session.user.id) {
      return NextResponse.json({ error: "Only the question author can accept answers" }, { status: 403 });
    }

    // Unaccept all other answers for this question
    await prisma.answer.updateMany({
      where: { questionId: answer.question.id },
      data: { isAccepted: false },
    });

    // Accept this answer
    await prisma.answer.update({
      where: { id },
      data: { isAccepted: true },
    });

    // Award reputation to answer author
    if (answer.authorId !== session.user.id) {
      await awardReputation(
        answer.authorId,
        "answer_accepted",
        "Your answer was accepted as the best answer"
      );

      await prisma.notification.create({
        data: {
          userId: answer.authorId,
          type: "ANSWER_ACCEPTED",
          title: "Your answer was accepted! ✓",
          body: "The question author marked your answer as the best answer.",
          link: `/knowledge/${answer.question.id}`,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/knowledge/answers/[id]/accept error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
