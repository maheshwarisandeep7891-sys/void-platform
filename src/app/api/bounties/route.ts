import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") ?? "OPEN";
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") ?? "1");
    const PAGE_SIZE = 20;

    const where: any = { status };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const [bounties, total] = await Promise.all([
      prisma.bounty.findMany({
        where,
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              reputation: { select: { score: true, level: true } },
            },
          },
          _count: { select: { submissions: true } },
        },
      }),
      prisma.bounty.count({ where }),
    ]);

    return NextResponse.json({ bounties, total, hasMore: page * PAGE_SIZE < total });
  } catch (error) {
    console.error("GET /api/bounties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createBountySchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(20).max(10000),
  reward: z.number().positive(),
  currency: z.string().default("USD"),
  tags: z.array(z.string()).max(5).optional(),
  expiresAt: z.string().datetime().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createBountySchema.parse(body);

    const bounty = await prisma.bounty.create({
      data: {
        title: data.title,
        description: data.description,
        reward: data.reward,
        currency: data.currency,
        tags: data.tags ?? [],
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        authorId: session.user.id,
      },
      include: {
        author: { select: { id: true, username: true } },
        _count: { select: { submissions: true } },
      },
    });

    return NextResponse.json(bounty, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/bounties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
