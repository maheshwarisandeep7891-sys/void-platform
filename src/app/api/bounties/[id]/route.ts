import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const bounty = await prisma.bounty.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true, username: true, name: true, image: true,
            reputation: { select: { score: true, level: true } },
          },
        },
        submissions: {
          include: {
            submitter: {
              select: {
                id: true, username: true, name: true, image: true,
                reputation: { select: { score: true, level: true } },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: { select: { submissions: true } },
      },
    });

    if (!bounty) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(bounty);
  } catch (error) {
    console.error("GET /api/bounties/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
