import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { releaseEscrow, refundEscrow, openDispute } from "@/lib/payments";
import { z } from "zod";

// GET /api/marketplace/transactions/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            type: true,
            images: { take: 1 },
          },
        },
        buyer: { select: { id: true, username: true, image: true } },
        seller: { select: { id: true, username: true, image: true } },
        escrow: true,
        review: true,
      },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Only buyer or seller can view
    if (
      transaction.buyerId !== session.user.id &&
      transaction.sellerId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(transaction);
  } catch (error) {
    console.error("GET /api/marketplace/transactions/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const actionSchema = z.object({
  action: z.enum(["release", "refund", "dispute"]),
});

// PATCH /api/marketplace/transactions/[id] — release/refund/dispute
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { action } = actionSchema.parse(body);

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      select: { buyerId: true, sellerId: true, status: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const isBuyer = transaction.buyerId === session.user.id;
    const isSeller = transaction.sellerId === session.user.id;

    if (!isBuyer && !isSeller) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    switch (action) {
      case "release":
        // Only buyer can release escrow (confirms delivery)
        if (!isBuyer) {
          return NextResponse.json(
            { error: "Only the buyer can release escrow" },
            { status: 403 }
          );
        }
        await releaseEscrow(id);
        break;

      case "refund":
        // Buyer can request refund while in escrow
        if (!isBuyer) {
          return NextResponse.json(
            { error: "Only the buyer can request a refund" },
            { status: 403 }
          );
        }
        await refundEscrow(id);
        break;

      case "dispute":
        // Either party can open a dispute
        await openDispute(id);
        break;
    }

    // Notify the other party
    const notifyUserId = isBuyer ? transaction.sellerId : transaction.buyerId;
    const messages: Record<string, string> = {
      release: "Buyer confirmed delivery — payment released to you!",
      refund: "Buyer requested a refund on the transaction.",
      dispute: "A dispute has been opened on the transaction.",
    };

    await prisma.notification.create({
      data: {
        userId: notifyUserId,
        type: "TRANSACTION_UPDATE",
        title: `Transaction ${action}d`,
        body: messages[action],
        link: `/marketplace/transactions/${id}`,
      },
    });

    return NextResponse.json({ success: true, action });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("PATCH /api/marketplace/transactions/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
