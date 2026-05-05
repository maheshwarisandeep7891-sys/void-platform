import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/marketplace/saved — get user's saved listings
export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedListing.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          include: {
            seller: {
              select: {
                id: true, username: true, name: true, image: true,
                reputation: { select: { score: true, level: true } },
              },
            },
            images: { take: 1, orderBy: { order: "asc" } },
          },
        },
      },
    });

    return NextResponse.json({ saved });
  } catch (error) {
    console.error("GET /api/marketplace/saved error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
