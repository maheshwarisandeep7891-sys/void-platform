// NextAuth removed — using custom auth at /api/auth/signin and /api/auth/callback
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ error: "Use /api/auth/signin" }, { status: 404 });
}
export async function POST() {
  return NextResponse.json({ error: "Use /api/auth/signin" }, { status: 404 });
}
