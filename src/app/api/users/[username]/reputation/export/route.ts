import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { exportReputationCredential } from "@/lib/reputation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await params;

    // Only allow exporting your own reputation
    if ((session.user as any).username !== username) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const credential = await exportReputationCredential(session.user.id);

    return NextResponse.json(credential, {
      headers: {
        "Content-Disposition": `attachment; filename="void-reputation-${username}.json"`,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("GET /api/users/[username]/reputation/export error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
