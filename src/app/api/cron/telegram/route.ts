import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

async function sendTelegramMessage(text: string, parseMode = "HTML") {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) return false;
  
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHANNEL_ID,
      text,
      parse_mode: parseMode,
      disable_web_page_preview: false,
    }),
  });
  return res.ok;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHANNEL_ID) {
    return NextResponse.json({ 
      success: false, 
      message: "Telegram not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHANNEL_ID env vars.",
      setup: "1. Create bot via @BotFather on Telegram\n2. Create a channel\n3. Add bot as admin\n4. Set env vars"
    });
  }

  try {
    const [userCount, postCount, bountyCount] = await Promise.all([
      prisma.user.count({ where: { isBot: false } }),
      prisma.post.count({ where: { publishedAt: { not: null } } }),
      prisma.bounty.count({ where: { status: "OPEN" } }),
    ]);

    const trendingPost = await prisma.post.findFirst({
      where: { publishedAt: { not: null }, isDarkMode: false, createdAt: { gte: new Date(Date.now() - 24 * 3600000) } },
      orderBy: { reactions: { _count: "desc" } },
      include: { author: { select: { username: true } }, _count: { select: { reactions: true } } },
    });

    const openBounty = await prisma.bounty.findFirst({
      where: { status: "OPEN" },
      orderBy: { reward: "desc" },
    });

    const hour = new Date().getHours();
    let message = "";

    if (hour % 3 === 0 && trendingPost) {
      message = `🔥 <b>Trending on VOID</b>\n\n<b>${trendingPost.title ?? trendingPost.content.slice(0, 80)}</b>\n\nby @${trendingPost.author?.username} · ⚡${trendingPost._count.reactions} reactions\n\n👉 https://void-platform.vercel.app/post/${trendingPost.id}`;
    } else if (hour % 3 === 1 && openBounty) {
      message = `💰 <b>Open Bounty: $${openBounty.reward}</b>\n\n${openBounty.title}\n\n${openBounty.description.slice(0, 200)}...\n\n👉 https://void-platform.vercel.app/bounties/${openBounty.id}`;
    } else {
      message = `🖤 <b>VOID Developer Platform</b>\n\n👥 ${userCount} developers\n📝 ${postCount} posts\n💰 ${bountyCount} open bounties\n\n<b>Features:</b>\n• Anonymous posting (Dark Mode)\n• Developer marketplace with escrow\n• Bounties with rewards\n• Knowledge base\n\n👉 https://void-platform.vercel.app`;
    }

    const sent = await sendTelegramMessage(message);
    return NextResponse.json({ success: sent, message: message.slice(0, 100) });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
