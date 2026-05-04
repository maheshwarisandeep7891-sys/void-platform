import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// GET /api/messages/[username] — get thread
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
    const otherUser = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!otherUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const messages = await prisma.directMessage.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: otherUser.id },
          { senderId: otherUser.id, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        content: true,
        senderId: true,
        createdAt: true,
        isRead: true,
      },
    });

    // Mark received messages as read
    await prisma.directMessage.updateMany({
      where: {
        senderId: otherUser.id,
        receiverId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("GET /api/messages/[username] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

const schema = z.object({
  content: z.string().min(1).max(10000),
});

// POST /api/messages/[username] — send message
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username } = await params;
    const body = await req.json();
    const { content } = schema.parse(body);

    const receiver = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    });

    if (!receiver) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (receiver.id === session.user.id) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }

    const message = await prisma.directMessage.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId: receiver.id,
        isEncrypted: false, // In production: encrypt with Signal protocol
      },
      select: {
        id: true,
        content: true,
        senderId: true,
        createdAt: true,
        isRead: true,
      },
    });

    // Notify receiver
    await prisma.notification.create({
      data: {
        userId: receiver.id,
        type: "MENTION",
        title: `New message from @${(session.user as any).username}`,
        body: content.slice(0, 100),
        link: `/messages/${(session.user as any).username}`,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/messages/[username] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
