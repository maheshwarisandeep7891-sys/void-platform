import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardReputation } from "@/lib/reputation";

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

    const answer = await prisma.answer.findUnique({
      where: { id },
      include: { question: { select: { authorId: true } } },
    });

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    // Only question author can accept
    if (answer.question.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const newAccepted = !answer.isAccepted;

    // Unaccept all other answers for this question first
    await prisma.answer.updateMany({
      where: { questionId: answer.questionId },
      data: { isAccepted: false },
    });

    if (newAccepted) {
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
      }
    }

    return NextResponse.json({ isAccepted: newAccepted });
  } catch (error) {
    console.error("POST /api/knowledge/answers/[id]/accept error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
