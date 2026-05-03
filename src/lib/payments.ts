/**
 * VOID Internal Payment System
 * 
 * Free, no external API keys needed.
 * Implements escrow logic, platform fees, and payout simulation
 * entirely within the database. In production you'd swap this
 * for a real processor (Stripe, Lemon Squeezy, etc.) but this
 * works fully out of the box.
 */

import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";

export const PLATFORM_FEE_PERCENT = 0.07; // 7%

export type PaymentStatus =
  | "PENDING"
  | "IN_ESCROW"
  | "COMPLETED"
  | "REFUNDED"
  | "DISPUTED"
  | "CANCELLED";

export interface CreateTransactionInput {
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  currency?: string;
  rentalDays?: number;
}

export interface TransactionResult {
  transactionId: string;
  amount: number;
  platformFee: number;
  sellerPayout: number;
  currency: string;
  paymentRef: string; // internal reference
  status: PaymentStatus;
}

/**
 * Create a new escrow transaction (funds "held" internally)
 */
export async function createEscrowTransaction(
  input: CreateTransactionInput
): Promise<TransactionResult> {
  const { listingId, buyerId, sellerId, amount, currency = "USD" } = input;

  const platformFee = parseFloat((amount * PLATFORM_FEE_PERCENT).toFixed(2));
  const sellerPayout = parseFloat((amount - platformFee).toFixed(2));
  const paymentRef = `void_pay_${uuidv4().replace(/-/g, "").slice(0, 24)}`;

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      platformFee,
      sellerPayout,
      currency,
      // Store our internal ref in the stripe field (repurposed)
      stripePaymentId: paymentRef,
      listingId,
      buyerId,
      sellerId,
      status: "IN_ESCROW",
      // Dead man's switch: auto-refund after 7 days if seller disappears
      autoRefundAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sellerLastSeen: new Date(),
      escrow: {
        create: {
          amount,
          stripeEscrowId: paymentRef,
          heldAt: new Date(),
        },
      },
    },
  });

  return {
    transactionId: transaction.id,
    amount,
    platformFee,
    sellerPayout,
    currency,
    paymentRef,
    status: "IN_ESCROW",
  };
}

/**
 * Release escrow — buyer confirms delivery, seller gets paid
 */
export async function releaseEscrow(transactionId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({
      where: { id: transactionId },
      include: { escrow: true },
    });

    if (!transaction) throw new Error("Transaction not found");
    if (transaction.status !== "IN_ESCROW") {
      throw new Error(`Cannot release: transaction is ${transaction.status}`);
    }

    // Mark transaction complete
    await tx.transaction.update({
      where: { id: transactionId },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Mark escrow released
    if (transaction.escrow) {
      await tx.escrow.update({
        where: { id: transaction.escrow.id },
        data: { releasedAt: new Date() },
      });
    }

    // Update listing status
    const listing = await tx.listing.findUnique({
      where: { id: transaction.listingId },
    });
    if (listing && listing.type === "FOR_SALE") {
      await tx.listing.update({
        where: { id: transaction.listingId },
        data: { status: "SOLD" },
      });
    }
  });
}

/**
 * Refund escrow — buyer gets money back
 */
export async function refundEscrow(
  transactionId: string,
  reason = "Buyer requested refund"
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const transaction = await tx.transaction.findUnique({
      where: { id: transactionId },
      include: { escrow: true },
    });

    if (!transaction) throw new Error("Transaction not found");
    if (!["IN_ESCROW", "DISPUTED"].includes(transaction.status)) {
      throw new Error(`Cannot refund: transaction is ${transaction.status}`);
    }

    await tx.transaction.update({
      where: { id: transactionId },
      data: { status: "REFUNDED" },
    });

    if (transaction.escrow) {
      await tx.escrow.update({
        where: { id: transaction.escrow.id },
        data: { refundedAt: new Date() },
      });
    }
  });
}

/**
 * Open a dispute
 */
export async function openDispute(transactionId: string): Promise<void> {
  await prisma.transaction.update({
    where: { id: transactionId, status: "IN_ESCROW" },
    data: { status: "DISPUTED" },
  });
}

/**
 * Dead man's switch — auto-refund transactions where seller disappeared
 * Run this as a cron job (e.g. via Vercel Cron)
 */
export async function processDeadMansSwitches(): Promise<number> {
  const now = new Date();

  const staleTransactions = await prisma.transaction.findMany({
    where: {
      status: "IN_ESCROW",
      autoRefundAt: { lte: now },
    },
    select: { id: true },
  });

  for (const tx of staleTransactions) {
    await refundEscrow(tx.id, "Seller inactive for 7 days — auto-refunded");
  }

  return staleTransactions.length;
}

/**
 * Calculate price for a listing
 */
export function calculatePrice(
  listing: {
    type: string;
    price?: number | null;
    hourlyRate?: number | null;
    dailyRate?: number | null;
    weeklyRate?: number | null;
    monthlyRate?: number | null;
  },
  rentalDays?: number
): number {
  if (listing.type === "FOR_BORROW") return 0;
  if (listing.type === "OPEN_TO_TRADE") return 0;

  if (listing.type === "FOR_RENT" && rentalDays) {
    if (rentalDays >= 30 && listing.monthlyRate) {
      return listing.monthlyRate * Math.ceil(rentalDays / 30);
    }
    if (rentalDays >= 7 && listing.weeklyRate) {
      return listing.weeklyRate * Math.ceil(rentalDays / 7);
    }
    if (listing.dailyRate) {
      return listing.dailyRate * rentalDays;
    }
    if (listing.hourlyRate) {
      return listing.hourlyRate * rentalDays * 24;
    }
  }

  return listing.price ?? 0;
}

/**
 * Get transaction summary for display
 */
export function getTransactionSummary(amount: number, currency = "USD") {
  const platformFee = parseFloat((amount * PLATFORM_FEE_PERCENT).toFixed(2));
  const sellerPayout = parseFloat((amount - platformFee).toFixed(2));
  return { amount, platformFee, sellerPayout, currency };
}
