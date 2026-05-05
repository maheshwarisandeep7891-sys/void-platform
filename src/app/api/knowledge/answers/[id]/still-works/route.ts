import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/knowledge/answers/[id]/still-works
// Marks an answer as "still works" — community verification
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
      select: { id: true, stillWorksAt: true },
    });

    if (!answer) {
      return NextResponse.json({ error: "Answer not found" }, { status: 404 });
    }

    const updated = await prisma.answer.update({
      where: { id },
      data: { stillWorksAt: new Date() },
    });

    return NextResponse.json({ stillWorksAt: updated.stillWorksAt });
  } catch (error) {
    console.error("POST still-works error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
