import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { awardReputation } from "@/lib/reputation";

const schema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

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
    const body = await req.json();
    const { rating, comment } = schema.parse(body);

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      select: { buyerId: true, sellerId: true, status: true, review: true },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }
    if (transaction.status !== "COMPLETED") {
      return NextResponse.json({ error: "Can only review completed transactions" }, { status: 400 });
    }
    if (transaction.buyerId !== session.user.id) {
      return NextResponse.json({ error: "Only the buyer can leave a review" }, { status: 403 });
    }
    if (transaction.review) {
      return NextResponse.json({ error: "Already reviewed" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        transactionId: id,
        reviewerId: session.user.id,
        revieweeId: transaction.sellerId,
      },
    });

    // Award reputation to seller for completed sale
    await awardReputation(
      transaction.sellerId,
      "sale_completed",
      `Received a ${rating}-star review`
    );

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST review error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
