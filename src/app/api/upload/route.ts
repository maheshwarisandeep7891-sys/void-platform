import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getPresignedUploadUrl } from "@/lib/r2";
import { z } from "zod";

const schema = z.object({
  filename: z.string().min(1).max(255),
  contentType: z.string().min(1),
  category: z.enum(["avatars", "banners", "posts", "listings", "attachments"]),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { filename, contentType, category } = schema.parse(body);

    // Validate content type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images are allowed." },
        { status: 400 }
      );
    }

    const { uploadUrl, publicUrl, key } = await getPresignedUploadUrl(
      category,
      filename,
      contentType,
      session.user.id
    );

    return NextResponse.json({ uploadUrl, publicUrl, key });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
