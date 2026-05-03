import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { awardReputation } from "@/lib/reputation";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const sort = searchParams.get("sort") ?? "newest";
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const skip = (page - 1) * PAGE_SIZE;
    const where: any = {};

    if (tag) {
      where.tags = {
        some: { tag: { slug: tag } },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any =
      sort === "unanswered"
        ? { answers: { _count: "asc" } }
        : sort === "popular"
        ? { views: "desc" }
        : { createdAt: "desc" };

    const [questions, total] = await Promise.all([
      prisma.question.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy,
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
          tags: { include: { tag: { select: { name: true, slug: true } } } },
          _count: { select: { answers: true } },
        },
      }),
      prisma.question.count({ where }),
    ]);

    return NextResponse.json({
      questions,
      total,
      hasMore: skip + PAGE_SIZE < total,
    });
  } catch (error) {
    console.error("GET /api/knowledge/questions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createQuestionSchema = z.object({
  title: z.string().min(10).max(300),
  content: z.string().min(20).max(50000),
  tags: z.array(z.string()).max(5).optional(),
  isDarkMode: z.boolean().optional(),
  darkHandle: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createQuestionSchema.parse(body);

    const tagConnections = [];
    if (data.tags && data.tags.length > 0) {
      for (const tagName of data.tags) {
        const slug = tagName.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const tag = await prisma.tag.upsert({
          where: { slug },
          create: { name: tagName, slug },
          update: {},
        });
        tagConnections.push({ tagId: tag.id });
      }
    }

    const question = await prisma.question.create({
      data: {
        title: data.title,
        content: data.content,
        isDarkMode: data.isDarkMode ?? false,
        darkHandle: data.darkHandle,
        authorId: session.user.id,
        tags: { create: tagConnections },
      },
      include: {
        author: { select: { id: true, username: true } },
        tags: { include: { tag: true } },
        _count: { select: { answers: true } },
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/knowledge/questions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
