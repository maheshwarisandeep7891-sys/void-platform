import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getSession(req);

    const guild = await prisma.guild.findUnique({
      where: { slug },
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

    if (!guild) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const isMember = session?.user?.id
      ? guild.members.some(m => m.userId === session.user.id)
      : false;

    return NextResponse.json({ ...guild, isMember });
  } catch (error) {
    console.error("GET /api/guilds/[slug] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
