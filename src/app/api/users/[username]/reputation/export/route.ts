import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exportReputationCredential } from "@/lib/reputation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const credential = await exportReputationCredential(user.id);
    return NextResponse.json(credential);
  } catch (error) {
    console.error("GET reputation export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
