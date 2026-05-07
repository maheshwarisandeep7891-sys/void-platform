import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { publishedAt: { not: null }, isDarkMode: false, createdAt: { gte: new Date(Date.now() - 2 * 24 * 3600000) } },
      orderBy: { createdAt: "desc" },
      take: 1000,
      include: { author: { select: { username: true } }, tags: { include: { tag: true } } },
    });

    const base = "https://void-platform.vercel.app";

    const items = posts.map(post => {
      const title = (post.title ?? post.content.slice(0, 80)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const keywords = post.tags.map(t => t.tag.name).join(", ");
      return `
  <url>
    <loc>${base}/post/${post.id}</loc>
    <news:news>
      <news:publication>
        <news:name>VOID Developer Platform</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${new Date(post.createdAt).toISOString()}</news:publication_date>
      <news:title>${title}</news:title>
      ${keywords ? `<news:keywords>${keywords}</news:keywords>` : ""}
    </news:news>
  </url>`;
    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items}
</urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return new NextResponse("Error", { status: 500 });
  }
}
