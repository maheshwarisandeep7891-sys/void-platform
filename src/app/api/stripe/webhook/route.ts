import { NextResponse } from "next/server";

/**
 * Stripe webhook endpoint — disabled (using internal payment system).
 * Kept for future Stripe integration.
 */
export async function POST() {
  return NextResponse.json({ received: true });
}
