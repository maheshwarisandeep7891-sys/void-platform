import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createDarkModeSession, endDarkModeSession } from "@/lib/dark-mode";

// POST /api/dark-mode — start a dark mode session
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId, handle } = await createDarkModeSession(session.user.id);

    return NextResponse.json({ sessionId, handle });
  } catch (error) {
    console.error("POST /api/dark-mode error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/dark-mode — end dark mode session
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    await endDarkModeSession(sessionId);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/dark-mode error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
