import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/marketplace/transactions — list user's transactions
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") ?? "all"; // "buyer" | "seller" | "all"
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") ?? "1");
    const PAGE_SIZE = 20;

    const where: any = {};
    if (role === "buyer") where.buyerId = session.user.id;
    else if (role === "seller") where.sellerId = session.user.id;
    else where.OR = [{ buyerId: session.user.id }, { sellerId: session.user.id }];

    if (status) where.status = status;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        include: {
          listing: { select: { id: true, title: true, type: true, images: { take: 1 } } },
          buyer: { select: { id: true, username: true, image: true } },
          seller: { select: { id: true, username: true, image: true } },
          escrow: { select: { heldAt: true, releasedAt: true, refundedAt: true } },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    return NextResponse.json({
      transactions,
      total,
      hasMore: page * PAGE_SIZE < total,
    });
  } catch (error) {
    console.error("GET /api/marketplace/transactions error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
