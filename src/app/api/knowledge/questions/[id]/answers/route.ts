import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardReputation } from "@/lib/reputation";
import { z } from "zod";

const schema = z.object({
  content: z.string().min(10).max(50000),
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
    const { content } = schema.parse(body);

    const question = await prisma.question.findUnique({
      where: { id },
      select: { id: true, authorId: true },
    });

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        questionId: id,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true, username: true, name: true, image: true,
            reputation: { select: { score: true, level: true } },
          },
        },
        votes: { select: { value: true, userId: true } },
      },
    });

    // Notify question author
    if (question.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: question.authorId,
          type: "COMMENT",
          title: "New answer on your question",
          body: `@${(session.user as any).username} answered your question`,
          link: `/knowledge/${id}`,
        },
      });
    }

    return NextResponse.json(answer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/knowledge/questions/[id]/answers error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
