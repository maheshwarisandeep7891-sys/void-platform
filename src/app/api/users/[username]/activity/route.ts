import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const events = await prisma.reputationEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: {
        id: true,
        type: true,
        points: true,
        description: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("GET /api/users/[username]/activity error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
