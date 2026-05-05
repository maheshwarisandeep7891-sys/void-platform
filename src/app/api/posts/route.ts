import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { awardReputation } from "@/lib/reputation";

const PAGE_SIZE = 20;

// GET /api/posts — fetch feed
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const filter = searchParams.get("filter") ?? "all";
    const tech = searchParams.get("tech") ?? "All";
    const type = searchParams.get("type");

    const session = await getSession(req);
    const skip = (page - 1) * PAGE_SIZE;

    const where: any = {
      publishedAt: { not: null },
      isScheduled: false,
    };

    if (type) where.type = type;

    // Filter by author username
    const author = searchParams.get("author");
    if (author) {
      const authorUser = await prisma.user.findUnique({
        where: { username: author },
        select: { id: true },
      });
      if (authorUser) {
        where.authorId = authorUser.id;
      } else {
        return NextResponse.json({ posts: [], total: 0, hasMore: false, page });
      }
    }

    if (tech !== "All") {
      where.tags = {
        some: {
          tag: {
            name: { contains: tech, mode: "insensitive" },
          },
        },
      };
    }

    if (filter === "following" && session?.user?.id) {
      const following = await prisma.follow.findMany({
        where: { followerId: session.user.id },
        select: { followingId: true },
      });
      where.authorId = { in: following.map((f) => f.followingId) };
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy:
          filter === "trending"
            ? [{ reactions: { _count: "desc" } }, { createdAt: "desc" }]
            : { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              isBot: true,
              reputation: { select: { score: true, level: true } },
            },
          },
          tags: {
            include: { tag: { select: { name: true, slug: true } } },
          },
          _count: { select: { reactions: true, comments: true } },
          reactions: session?.user?.id
            ? { where: { userId: session.user.id }, select: { type: true } }
            : false,
        },
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      total,
      hasMore: skip + PAGE_SIZE < total,
      page,
    });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createPostSchema = z.object({
  type: z.enum(["THREAD", "SNIPPET", "DROP", "BOUNTY", "QUESTION"]),
  title: z.string().max(200).optional(),
  content: z.string().min(1).max(50000),
  codeSnippet: z.string().max(100000).optional(),
  language: z.string().max(50).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  links: z.array(z.string().url()).max(5).optional(),
  tags: z.array(z.string()).max(5).optional(),
  isDarkMode: z.boolean().optional(),
  darkSessionId: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
});

// POST /api/posts — create post
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createPostSchema.parse(body);

    // Handle tags — create if not exists
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

    // Resolve dark handle from session if dark mode
    let resolvedDarkHandle: string | undefined;
    if (data.isDarkMode && data.darkSessionId) {
      const { validateDarkModeSession } = await import("@/lib/dark-mode");
      const validation = await validateDarkModeSession(data.darkSessionId);
      if (validation.valid) {
        resolvedDarkHandle = validation.handle;
      }
    }

    const post = await prisma.post.create({
      data: {
        type: data.type,
        title: data.title,
        content: data.content,
        codeSnippet: data.codeSnippet,
        language: data.language,
        images: data.images ?? [],
        links: data.links ?? [],
        isDarkMode: data.isDarkMode ?? false,
        darkHandle: resolvedDarkHandle,
        darkSessionId: data.darkSessionId,
        authorId: data.isDarkMode ? null : session.user.id,
        publishedAt: data.scheduledAt ? null : new Date(),
        isScheduled: !!data.scheduledAt,
        scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : null,
        tags: { create: tagConnections },
      },
      include: {
        author: {
          select: { id: true, username: true, name: true, image: true },
        },
        tags: { include: { tag: true } },
        _count: { select: { reactions: true, comments: true } },
      },
    });

    // Award reputation for posting
    if (!data.isDarkMode) {
      await awardReputation(
        session.user.id,
        "post_created",
        `Created a ${data.type.toLowerCase()} post`
      );
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
