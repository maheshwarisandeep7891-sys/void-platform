import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/messages — list conversations
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all unique conversation partners
    const messages = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: session.user.id },
          { receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        sender: { select: { id: true, username: true, name: true, image: true } },
        receiver: { select: { id: true, username: true, name: true, image: true } },
      },
    });

    // Build conversation list (deduplicated by partner)
    const conversationMap = new Map<string, any>();
    const userId = session.user!.id;
    for (const msg of messages) {
      const partner = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!conversationMap.has(partner.id)) {
        const unread = messages.filter(
          (m) => m.senderId === partner.id && m.receiverId === userId && !m.isRead
        ).length;
        conversationMap.set(partner.id, {
          userId: partner.id,
          username: partner.username,
          name: partner.name,
          image: partner.image,
          lastMessage: msg.content.slice(0, 80),
          lastMessageAt: msg.createdAt,
          unread,
        });
      }
    }

    return NextResponse.json({ conversations: Array.from(conversationMap.values()) });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
