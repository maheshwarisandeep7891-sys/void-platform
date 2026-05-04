import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const PAGE_SIZE = 24;

    const where: any = { visibility: { not: "PRIVATE" } };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [guilds, total] = await Promise.all([
      prisma.guild.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { members: { _count: "desc" } },
        include: {
          _count: { select: { members: true } },
        },
      }),
      prisma.guild.count({ where }),
    ]);

    return NextResponse.json({ guilds, total });
  } catch (error) {
    console.error("GET /api/guilds error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createGuildSchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(500).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE", "INVITE_ONLY"]).default("PUBLIC"),
  techStack: z.array(z.string()).max(10).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createGuildSchema.parse(body);

    let slug = slugify(data.name);
    let counter = 1;
    while (await prisma.guild.findUnique({ where: { slug } })) {
      slug = `${slugify(data.name)}-${counter++}`;
    }

    const guild = await prisma.guild.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        visibility: data.visibility,
        techStack: data.techStack ?? [],
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
          },
        },
      },
      include: {
        _count: { select: { members: true } },
      },
    });

    return NextResponse.json(guild, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/guilds error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
