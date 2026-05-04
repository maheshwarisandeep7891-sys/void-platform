import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { deleteCache } from "@/lib/redis";

const updateSchema = z.object({
  name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  websiteUrl: z.string().url().optional().or(z.literal("")),
  twitterUrl: z.string().url().optional().or(z.literal("")),
  techStack: z.array(z.string()).max(20).optional(),
  openToHire: z.boolean().optional(),
  openToCollaborate: z.boolean().optional(),
  openToMentor: z.boolean().optional(),
  openToTrade: z.boolean().optional(),
  image: z.string().url().optional(),
  bannerImage: z.string().url().optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = updateSchema.parse(body);

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name,
        bio: data.bio,
        githubUrl: data.githubUrl || null,
        websiteUrl: data.websiteUrl || null,
        twitterUrl: data.twitterUrl || null,
        techStack: data.techStack,
        openToHire: data.openToHire,
        openToCollaborate: data.openToCollaborate,
        openToMentor: data.openToMentor,
        openToTrade: data.openToTrade,
        image: data.image,
        bannerImage: data.bannerImage,
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        bio: true,
      },
    });

    // Invalidate cache
    await deleteCache(`user:${user.username}`);

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("PATCH /api/users/me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        image: true,
        bannerImage: true,
        bio: true,
        githubUrl: true,
        websiteUrl: true,
        twitterUrl: true,
        techStack: true,
        openToHire: true,
        openToCollaborate: true,
        openToMentor: true,
        openToTrade: true,
        reputation: { select: { score: true, level: true } },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users/me error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
