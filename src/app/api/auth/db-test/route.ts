import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    // Simple query to test connection
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, message: "Database connected!" });
  } catch (err: any) {
    return NextResponse.json({ 
      ok: false, 
      error: err.message,
      code: err.code 
    }, { status: 500 });
  }
}
