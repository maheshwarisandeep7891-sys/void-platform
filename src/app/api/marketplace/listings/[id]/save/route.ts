import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST — save a listing
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    await prisma.savedListing.upsert({
      where: { userId_listingId: { userId: session.user.id, listingId: id } },
      create: { userId: session.user.id, listingId: id },
      update: {},
    });

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("POST save listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE — unsave a listing
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

    await prisma.savedListing.deleteMany({
      where: { userId: session.user.id, listingId: id },
    });

    return NextResponse.json({ saved: false });
  } catch (error) {
    console.error("DELETE save listing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
