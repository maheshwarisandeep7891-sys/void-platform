import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { awardReputation } from "@/lib/reputation";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; submissionId: string }> }
) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, submissionId } = await params;

    const bounty = await prisma.bounty.findUnique({
      where: { id },
      select: { authorId: true, status: true },
    });

    if (!bounty) {
      return NextResponse.json({ error: "Bounty not found" }, { status: 404 });
    }
    if (bounty.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (bounty.status !== "OPEN") {
      return NextResponse.json({ error: "Bounty is not open" }, { status: 400 });
    }

    const submission = await prisma.bountySubmission.findUnique({
      where: { id: submissionId },
      select: { submitterId: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Accept submission and close bounty
    await prisma.$transaction([
      prisma.bountySubmission.update({
        where: { id: submissionId },
        data: { isAccepted: true },
      }),
      prisma.bounty.update({
        where: { id },
        data: { status: "COMPLETED" },
      }),
    ]);

    // Award reputation to submitter
    await awardReputation(
      submission.submitterId,
      "bounty_completed",
      "Your bounty submission was accepted"
    );

    // Notify submitter
    await prisma.notification.create({
      data: {
        userId: submission.submitterId,
        type: "BOUNTY_SUBMISSION",
        title: "Your submission was accepted!",
        body: "Congratulations! Your bounty solution was accepted.",
        link: `/bounties/${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST accept submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
