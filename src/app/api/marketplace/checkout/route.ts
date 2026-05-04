import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createEscrowTransaction,
  calculatePrice,
  getTransactionSummary,
} from "@/lib/payments";
import { z } from "zod";

const schema = z.object({
  listingId: z.string(),
  rentalDays: z.number().positive().optional(),
});

// POST /api/marketplace/checkout — initiate a purchase
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, rentalDays } = schema.parse(body);

    const listing = await prisma.listing.findUnique({
      where: { id: listingId, status: "ACTIVE" },
      select: {
        id: true,
        title: true,
        type: true,
        price: true,
        hourlyRate: true,
        dailyRate: true,
        weeklyRate: true,
        monthlyRate: true,
        currency: true,
        sellerId: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found or not active" }, { status: 404 });
    }

    if (listing.sellerId === session.user.id) {
      return NextResponse.json(
        { error: "You cannot purchase your own listing" },
        { status: 400 }
      );
    }

    const amount = calculatePrice(listing, rentalDays);

    if (amount <= 0 && listing.type !== "FOR_BORROW" && listing.type !== "OPEN_TO_TRADE") {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    // For free listings (borrow/trade), create a zero-amount transaction
    if (amount === 0) {
      const tx = await prisma.transaction.create({
        data: {
          amount: 0,
          platformFee: 0,
          sellerPayout: 0,
          currency: listing.currency,
          stripePaymentId: `void_free_${Date.now()}`,
          listingId,
          buyerId: session.user.id,
          sellerId: listing.sellerId,
          status: "COMPLETED",
          completedAt: new Date(),
        },
      });
      return NextResponse.json({
        transactionId: tx.id,
        amount: 0,
        platformFee: 0,
        sellerPayout: 0,
        status: "COMPLETED",
        isFree: true,
      });
    }

    const result = await createEscrowTransaction({
      listingId,
      buyerId: session.user.id,
      sellerId: listing.sellerId,
      amount,
      currency: listing.currency,
      rentalDays,
    });

    // Create notifications
    await Promise.all([
      prisma.notification.create({
        data: {
          userId: session.user.id,
          type: "TRANSACTION_UPDATE",
          title: "Purchase initiated",
          body: `Your purchase of "${listing.title}" is in escrow. Awaiting delivery.`,
          link: `/marketplace/transactions/${result.transactionId}`,
        },
      }),
      prisma.notification.create({
        data: {
          userId: listing.sellerId,
          type: "TRANSACTION_UPDATE",
          title: "New sale! 🎉",
          body: `Someone purchased "${listing.title}". Deliver to release payment.`,
          link: `/marketplace/transactions/${result.transactionId}`,
        },
      }),
    ]);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/marketplace/checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
