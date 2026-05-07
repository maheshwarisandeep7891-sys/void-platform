import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 3600000);

    // Get top posts of the week
    const topPosts = await prisma.post.findMany({
      where: { publishedAt: { not: null }, isDarkMode: false, createdAt: { gte: oneWeekAgo } },
      orderBy: { reactions: { _count: "desc" } },
      take: 5,
      include: {
        author: { select: { username: true } },
        _count: { select: { reactions: true, comments: true } },
      },
    });

    // Get biggest bounty
    const topBounty = await prisma.bounty.findFirst({
      where: { status: "OPEN" },
      orderBy: { reward: "desc" },
    });

    // Get all real users with email
    const users = await prisma.user.findMany({
      where: { isBot: false, email: { not: { contains: "void-bot.internal" } } },
      select: { email: true, username: true, name: true },
      take: 1000,
    });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ success: false, message: "No Resend API key — digest generated but not sent", users: users.length, posts: topPosts.length });
    }

    const base = "https://void-platform.vercel.app";
    let sent = 0;

    for (const user of users.slice(0, 100)) { // batch of 100
      const postsHtml = topPosts.map((p, i) => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #1a1a2e;">
            <a href="${base}/post/${p.id}" style="color:#a78bfa;text-decoration:none;font-weight:600;font-size:14px;">${p.title ?? p.content.slice(0, 80)}</a>
            <div style="margin-top:4px;font-size:12px;color:#5a5a8a;">by @${p.author?.username} · ⚡${p._count.reactions} reactions · 💬${p._count.comments} comments</div>
          </td>
        </tr>`).join("");

      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#050508;color:#f0f0ff;font-family:system-ui,sans-serif;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="margin-bottom:32px;">
      <a href="${base}" style="font-size:28px;font-weight:900;color:#a78bfa;text-decoration:none;letter-spacing:-2px;">VOID</a>
      <p style="color:#5a5a8a;font-size:13px;margin:4px 0 0;font-family:monospace;">Weekly Developer Digest</p>
    </div>
    
    <h2 style="font-size:20px;font-weight:700;margin-bottom:16px;color:#f0f0ff;">👋 Hey @${user.username},</h2>
    <p style="color:#94a3b8;font-size:14px;line-height:1.6;">Here's what developers were building and discussing on VOID this week.</p>
    
    <h3 style="font-size:16px;font-weight:700;margin:28px 0 12px;color:#f0f0ff;">🔥 Top Posts This Week</h3>
    <table style="width:100%;border-collapse:collapse;">${postsHtml}</table>
    
    ${topBounty ? `
    <div style="margin:28px 0;padding:20px;background:#0f0f18;border:1px solid #f59e0b33;border-radius:12px;">
      <div style="font-size:12px;font-family:monospace;color:#f59e0b;margin-bottom:8px;">💰 OPEN BOUNTY</div>
      <a href="${base}/bounties/${topBounty.id}" style="color:#f0f0ff;text-decoration:none;font-weight:700;font-size:16px;">${topBounty.title}</a>
      <div style="margin-top:8px;font-size:24px;font-weight:900;color:#10b981;">$${topBounty.reward}</div>
      <a href="${base}/bounties/${topBounty.id}" style="display:inline-block;margin-top:12px;background:#f59e0b;color:#050508;padding:8px 16px;border-radius:8px;text-decoration:none;font-weight:700;font-size:13px;">Solve it →</a>
    </div>` : ""}
    
    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #1a1a2e;text-align:center;">
      <a href="${base}/feed" style="display:inline-block;background:#8b5cf6;color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;">Open VOID →</a>
    </div>
    
    <p style="margin-top:24px;font-size:11px;color:#5a5a8a;text-align:center;font-family:monospace;">
      VOID Developer Platform · <a href="${base}" style="color:#5a5a8a;">void-platform.vercel.app</a>
    </p>
  </div>
</body>
</html>`;

      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "VOID <digest@void.dev>",
          to: user.email,
          subject: `🔥 VOID Weekly: Top ${topPosts.length} posts this week`,
          html,
        });
        sent++;
      } catch { /* skip */ }
    }

    return NextResponse.json({ success: true, sent, users: users.length, posts: topPosts.length });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
