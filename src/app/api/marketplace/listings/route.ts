import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PAGE_SIZE = 24;

// GET /api/marketplace/listings
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") ?? "newest";

    const skip = (page - 1) * PAGE_SIZE;

    const where: any = { status: "ACTIVE" };
    if (category) where.category = category;
    if (type) where.type = type;
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const orderBy: any =
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
        ? { price: "desc" }
        : sort === "popular"
        ? { views: "desc" }
        : { createdAt: "desc" };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: PAGE_SIZE,
        orderBy,
        include: {
          seller: {
            select: {
              id: true,
              username: true,
              name: true,
              image: true,
              reputation: { select: { score: true, level: true } },
            },
          },
          images: { orderBy: { order: "asc" }, take: 1 },
          tags: { include: { tag: { select: { name: true, slug: true } } } },
          _count: { select: { transactions: true } },
        },
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      total,
      hasMore: skip + PAGE_SIZE < total,
      page,
    });
  } catch (error) {
    console.error("GET /api/marketplace/listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const createListingSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(10000),
  category: z.string().min(1),
  type: z.enum(["FOR_SALE", "FOR_RENT", "FOR_BORROW", "OPEN_TO_TRADE"]),
  price: z.number().positive().optional(),
  currency: z.string().default("USD"),
  hourlyRate: z.number().positive().optional(),
  dailyRate: z.number().positive().optional(),
  weeklyRate: z.number().positive().optional(),
  monthlyRate: z.number().positive().optional(),
  techStack: z.array(z.string()).max(10).optional(),
  tags: z.array(z.string()).max(5).optional(),
  images: z.array(z.string()).max(10).optional(),
  uptimeSLA: z.number().min(0).max(100).optional(),
  expiresAt: z.string().datetime().optional(),
});

// POST /api/marketplace/listings
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = createListingSchema.parse(body);

    // Handle tags
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

    const listing = await prisma.listing.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        type: data.type,
        price: data.price,
        currency: data.currency,
        hourlyRate: data.hourlyRate,
        dailyRate: data.dailyRate,
        weeklyRate: data.weeklyRate,
        monthlyRate: data.monthlyRate,
        techStack: data.techStack ?? [],
        sellerId: session.user.id,
        uptimeSLA: data.uptimeSLA,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        tags: { create: tagConnections },
        images: data.images
          ? {
              create: data.images.map((url, i) => ({ url, order: i })),
            }
          : undefined,
      },
      include: {
        seller: { select: { id: true, username: true } },
        images: true,
        tags: { include: { tag: true } },
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/marketplace/listings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
