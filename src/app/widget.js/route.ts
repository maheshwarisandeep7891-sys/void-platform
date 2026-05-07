import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("user");

  try {
    let posts: any[] = [];
    
    if (username) {
      const user = await prisma.user.findUnique({ where: { username }, select: { id: true } });
      if (user) {
        posts = await prisma.post.findMany({
          where: { authorId: user.id, publishedAt: { not: null } },
          orderBy: { createdAt: "desc" },
          take: 3,
          select: { id: true, title: true, content: true, type: true, createdAt: true },
        });
      }
    } else {
      posts = await prisma.post.findMany({
        where: { publishedAt: { not: null }, isDarkMode: false },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: { id: true, title: true, content: true, type: true, createdAt: true },
      });
    }

    const js = `
(function() {
  var base = 'https://void-platform.vercel.app';
  var posts = ${JSON.stringify(posts)};
  var container = document.getElementById('void-widget') || document.currentScript.parentElement;
  
  var html = '<div style="font-family:system-ui,sans-serif;background:#0f0f18;border:1px solid #1a1a2e;border-radius:12px;padding:16px;max-width:400px;">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">';
  html += '<a href="' + base + '" target="_blank" style="font-weight:900;font-size:18px;color:#a78bfa;text-decoration:none;letter-spacing:-1px;">VOID</a>';
  html += '<span style="font-size:11px;color:#5a5a8a;font-family:monospace;">developer platform</span>';
  html += '</div>';
  
  posts.forEach(function(post) {
    var title = post.title || post.content.slice(0, 60);
    html += '<div style="padding:10px 0;border-top:1px solid #1a1a2e;">';
    html += '<a href="' + base + '/post/' + post.id + '" target="_blank" style="color:#f0f0ff;text-decoration:none;font-size:13px;font-weight:600;display:block;margin-bottom:4px;">' + title.slice(0, 70) + '</a>';
    html += '<span style="font-size:11px;color:#5a5a8a;font-family:monospace;">' + post.type + '</span>';
    html += '</div>';
  });
  
  html += '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #1a1a2e;">';
  html += '<a href="' + base + '" target="_blank" style="font-size:12px;color:#8b5cf6;text-decoration:none;font-family:monospace;">View all on VOID \u2192</a>';
  html += '</div></div>';
  
  container.innerHTML = html;
})();
`;

    return new NextResponse(js, {
      headers: {
        "Content-Type": "application/javascript",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("// Widget error", { status: 500 });
  }
}
