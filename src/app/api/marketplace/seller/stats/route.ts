import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [transactions, activeListings] = await Promise.all([
      prisma.transaction.findMany({
        where: { sellerId: session.user.id },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          listing: { select: { title: true } },
          buyer: { select: { username: true } },
        },
      }),
      prisma.listing.count({
        where: { sellerId: session.user.id, status: "ACTIVE" },
      }),
    ]);

    const completedTx = transactions.filter((t) => t.status === "COMPLETED");
    const escrowTx = transactions.filter((t) => t.status === "IN_ESCROW");

    return NextResponse.json({
      totalSales: completedTx.length,
      totalRevenue: completedTx.reduce((sum, t) => sum + t.sellerPayout, 0),
      activeListings,
      pendingPayouts: escrowTx.reduce((sum, t) => sum + t.sellerPayout, 0),
      transactions,
    });
  } catch (error) {
    console.error("GET /api/marketplace/seller/stats error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
