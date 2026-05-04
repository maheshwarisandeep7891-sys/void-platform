import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

    await prisma.answer.update({
      where: { id },
      data: { stillWorksAt: new Date() },
    });

    return NextResponse.json({ success: true, year: new Date().getFullYear() });
  } catch (error) {
    console.error("POST /api/knowledge/answers/[id]/still-works error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
