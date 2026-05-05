import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  content: z.string().min(10).max(50000),
  links: z.array(z.string()).max(5).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { content, links } = schema.parse(body);

    const bounty = await prisma.bounty.findUnique({
      where: { id },
      select: { id: true, status: true, authorId: true },
    });

    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }
    if (bounty.status !== "OPEN") {
      return NextResponse.json({ error: "Bounty is not open" }, { status: 400 });
    }

    const submission = await prisma.bountySubmission.create({
      data: {
        content,
        links: links ?? [],
        bountyId: id,
        submitterId: session.user.id,
      },
      include: {
        submitter: {
          select: {
            id: true, username: true, name: true, image: true,
            reputation: { select: { score: true, level: true } },
          },
        },
      },
    });

    // Notify bounty author
    if (bounty.authorId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: bounty.authorId,
          type: "BOUNTY_SUBMISSION",
          title: "New bounty submission",
          body: `@${(session.user as any).username} submitted a solution`,
          link: `/bounties/${id}`,
        },
      });
    }

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/bounties/[id]/submit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
