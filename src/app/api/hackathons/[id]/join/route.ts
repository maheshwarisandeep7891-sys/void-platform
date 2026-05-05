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

    const room = await prisma.hackathonRoom.findUnique({
      where: { id },
      select: { id: true, isActive: true, endAt: true },
    });

    if (!room) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }

    if (new Date(room.endAt) < new Date()) {
      return NextResponse.json({ error: "Hackathon has ended" }, { status: 400 });
    }

    const existing = await prisma.hackathonMember.findUnique({
      where: { roomId_userId: { roomId: id, userId: session.user.id } },
    });

    if (existing) {
      await prisma.hackathonMember.delete({
        where: { roomId_userId: { roomId: id, userId: session.user.id } },
      });
      return NextResponse.json({ joined: false });
    }

    await prisma.hackathonMember.create({
      data: { roomId: id, userId: session.user.id, role: "MEMBER" },
    });

    return NextResponse.json({ joined: true });
  } catch (error) {
    console.error("POST /api/hackathons/[id]/join error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
