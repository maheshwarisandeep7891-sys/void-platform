import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardReputation } from "@/lib/reputation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug } = await params;

    const guild = await prisma.guild.findUnique({
      where: { slug },
      select: { id: true, visibility: true },
    });

    if (!guild) {
      return NextResponse.json({ error: "Guild not found" }, { status: 404 });
    }

    if (guild.visibility === "INVITE_ONLY") {
      return NextResponse.json({ error: "This guild is invite-only" }, { status: 403 });
    }

    const existing = await prisma.guildMember.findUnique({
      where: { guildId_userId: { guildId: guild.id, userId: session.user.id } },
    });

    if (existing) {
      // Leave guild
      await prisma.guildMember.delete({
        where: { guildId_userId: { guildId: guild.id, userId: session.user.id } },
      });
      return NextResponse.json({ joined: false });
    }

    // Join guild
    await prisma.guildMember.create({
      data: {
        guildId: guild.id,
        userId: session.user.id,
        role: "MEMBER",
      },
    });

    return NextResponse.json({ joined: true });
  } catch (error) {
    console.error("POST /api/guilds/[slug]/join error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
