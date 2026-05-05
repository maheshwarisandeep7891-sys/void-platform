import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession(req);

    const room = await prisma.hackathonRoom.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true, username: true, name: true, image: true,
                reputation: { select: { score: true, level: true } },
              },
            },
          },
          orderBy: { joinedAt: "asc" },
        },
        _count: { select: { members: true } },
      },
    });

    if (!room) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isMember = session?.user?.id
      ? room.members.some(m => m.userId === session.user.id)
      : false;

    return NextResponse.json({ ...room, isMember });
  } catch (error) {
    console.error("GET /api/hackathons/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
