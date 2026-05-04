import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const rooms = await prisma.hackathonRoom.findMany({
      where: { isActive: true },
      orderBy: { startAt: "asc" },
      include: {
        _count: { select: { members: true } },
      },
    });
    return NextResponse.json({ rooms });
  } catch (error) {
    console.error("GET /api/hackathons error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createSchema.parse(body);

    const room = await prisma.hackathonRoom.create({
      data: {
        name: data.name,
        description: data.description,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        members: {
          create: { userId: session.user.id, role: "LEAD" },
        },
      },
      include: { _count: { select: { members: true } } },
    });

    return NextResponse.json(room, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/hackathons error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
