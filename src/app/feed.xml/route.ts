import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      where: { publishedAt: { not: null }, isDarkMode: false },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        author: { select: { username: true, name: true } },
        tags: { include: { tag: { select: { name: true } } } },
      },
    });

    const base = "https://void-platform.vercel.app";
    const now = new Date().toUTCString();

    const items = posts.map(post => {
      const title = (post.title ?? post.content.slice(0, 80)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const desc = post.content.slice(0, 300).replace(/[#*`]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const tags = post.tags.map(t => `<category>${t.tag.name}</category>`).join("");
      return `
    <item>
      <title>${title}</title>
      <link>${base}/post/${post.id}</link>
      <description>${desc}...</description>
      <author>${post.author?.username ?? "anonymous"}@void.dev (${post.author?.name ?? post.author?.username ?? "Anonymous"})</author>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <guid isPermaLink="true">${base}/post/${post.id}</guid>
      ${tags}
    </item>`;
    }).join("");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>VOID — Developer Platform</title>
    <link>${base}</link>
    <description>The internet's home for people who actually build things. Code snippets, threads, bounties, and developer discussions.</description>
    <language>en-us</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${base}/api/og</url>
      <title>VOID Developer Platform</title>
      <link>${base}</link>
    </image>
    ${items}
  </channel>
</rss>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new NextResponse("Error generating RSS feed", { status: 500 });
  }
}
