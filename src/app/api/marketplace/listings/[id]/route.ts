import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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

const updateSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  description: z.string().min(10).max(10000).optional(),
  price: z.number().positive().optional().nullable(),
  status: z.enum(["ACTIVE", "EXPIRED", "CANCELLED"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const listing = await prisma.listing.findUnique({ where: { id }, select: { sellerId: true } });
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (listing.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.listing.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("PATCH /api/marketplace/listings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const listing = await prisma.listing.findUnique({ where: { id }, select: { sellerId: true, status: true } });
    if (!listing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (listing.sellerId !== session.user.id && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete — mark as cancelled
    await prisma.listing.update({ where: { id }, data: { status: "CANCELLED" } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/marketplace/listings/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
