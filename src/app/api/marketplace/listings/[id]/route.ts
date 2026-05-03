import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
            reputation: { select: { score: true, level: true } },
            _count: { select: { listings: true } },
          },
        },
        images: { orderBy: { order: "asc" } },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
        _count: { select: { transactions: true } },
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment view count (fire and forget)
    prisma.listing
      .update({ where: { id }, data: { views: { increment: 1 } } })
      .catch(() => {});

    return NextResponse.json(listing);
  } catch (error) {
    console.error("GET /api/marketplace/listings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
