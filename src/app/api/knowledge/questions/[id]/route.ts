import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const question = await prisma.question.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true, username: true, name: true, image: true,
            reputation: { select: { score: true, level: true } },
          },
        },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
        answers: {
          include: {
            author: {
              select: {
                id: true, username: true, name: true, image: true,
                reputation: { select: { score: true, level: true } },
              },
            },
            votes: { select: { value: true, userId: true } },
            _count: { select: { votes: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!question) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment views
    prisma.question
      .update({ where: { id }, data: { views: { increment: 1 } } })
      .catch(() => {});

    return NextResponse.json(question);
  } catch (error) {
    console.error("GET /api/knowledge/questions/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
