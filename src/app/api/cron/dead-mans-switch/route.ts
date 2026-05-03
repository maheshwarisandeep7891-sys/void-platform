import { NextRequest, NextResponse } from "next/server";
import { processDeadMansSwitches } from "@/lib/payments";

// Vercel Cron: runs daily
// Add to vercel.json: "crons": [{"path": "/api/cron/dead-mans-switch", "schedule": "0 0 * * *"}]
export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const refunded = await processDeadMansSwitches();
    return NextResponse.json({
      success: true,
      refunded,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Dead man's switch cron error:", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
