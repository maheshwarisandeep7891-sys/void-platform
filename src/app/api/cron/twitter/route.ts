import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { postTweet } from "@/lib/twitter";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Tweet templates — varied so they don't look like spam
const TWEET_TEMPLATES = {
  // Platform awareness tweets
  awareness: [
    `🖤 VOID — a social network built exclusively for developers.\n\nShare code, sell tools, ask questions, post anonymously.\n\nNo algorithm. No engagement bait. Just builders.\n\nhttps://void-platform.vercel.app`,

    `Developers deserve a better internet.\n\nVOID is a platform where you can:\n→ Share code snippets & threads\n→ Buy/sell dev tools & API credits\n→ Ask questions anonymously\n→ Post bounties with escrow\n\nhttps://void-platform.vercel.app`,

    `What if Stack Overflow, GitHub, and a marketplace had a baby?\n\nThat's VOID.\n\nBuilt for developers who actually ship things.\n\nhttps://void-platform.vercel.app`,

    `🖤 Dark Mode on VOID: go fully anonymous with one click.\n\nAsk the question you've been afraid to ask.\nPost the controversial opinion.\nNo reputation damage.\n\nhttps://void-platform.vercel.app/dark`,

    `VOID marketplace: buy/sell unused\n→ GitHub Copilot seats\n→ OpenAI API credits\n→ JetBrains licenses\n→ GPU access\n→ Side projects\n\nAll with built-in escrow. No Stripe needed.\n\nhttps://void-platform.vercel.app/marketplace`,
  ],

  // Stats-based tweets
  stats: (users: number, posts: number, bounties: number) => [
    `VOID platform stats right now:\n\n👥 ${users} developers\n📝 ${posts} posts\n💰 ${bounties} open bounties\n\nJoin the community → https://void-platform.vercel.app`,

    `${users} developers are already on VOID.\n\nThe platform built exclusively for people who ship code.\n\nhttps://void-platform.vercel.app`,
  ],

  // Feature spotlight tweets
  features: [
    `VOID reputation system:\n\nNEWCOMER → BUILDER → HACKER → ARCHITECT → LEGEND\n\nEarned through real contributions.\nExportable as a signed JSON credential.\nPut it on your resume.\n\nhttps://void-platform.vercel.app`,

    `Keyboard shortcuts on VOID:\n\nG+F → Feed\nG+M → Marketplace\nG+K → Knowledge\nG+B → Bounties\n⌘+K → Search\n⌘+⇧+D → Dark Mode\n\nBuilt for developers who hate mice.\n\nhttps://void-platform.vercel.app`,

    `VOID bounties:\n\nPost a problem → set a reward → community solves it.\n\nEscrow-backed. Anonymous submissions supported.\n\nOpen bounties now → https://void-platform.vercel.app/bounties`,

    `VOID guilds: communities organized by tech stack.\n\n🦀 Rust Guild\n🤖 ML/AI Hackers\n⚙️ DevOps & Platform\n📘 TypeScript Builders\n🔧 Systems Programming\n\nhttps://void-platform.vercel.app/guilds`,
  ],

  // Engagement tweets (questions that get replies)
  engagement: [
    `Hot take: most developers would rather have a platform with no algorithm than one with perfect recommendations.\n\nAgree or disagree?\n\n(VOID has no algorithm → https://void-platform.vercel.app)`,

    `What's the most useful thing you've ever found on Stack Overflow?\n\nWe're building something better → https://void-platform.vercel.app/knowledge`,

    `If you could sell one thing from your dev setup right now, what would it be?\n\n(Unused API credits? SaaS seats? GPU time?)\n\nVOID marketplace → https://void-platform.vercel.app/marketplace`,

    `What's a hot take about software engineering you've been afraid to post publicly?\n\n🖤 VOID Dark Mode lets you post anonymously → https://void-platform.vercel.app/dark`,
  ],
};

// Track what was last tweeted to avoid repetition
// (stored in DB as a simple key-value via a notification record)
async function getLastTweetType(): Promise<string> {
  try {
    const record = await prisma.notification.findFirst({
      where: { type: "SYSTEM", title: "twitter_last_type" },
      orderBy: { createdAt: "desc" },
    });
    return record?.body ?? "awareness";
  } catch {
    return "awareness";
  }
}

async function setLastTweetType(type: string): Promise<void> {
  try {
    await prisma.notification.create({
      data: {
        userId: (await prisma.user.findFirst({ where: { isBot: false }, select: { id: true } }))?.id ?? "system",
        type: "SYSTEM",
        title: "twitter_last_type",
        body: type,
        isRead: true,
      },
    });
  } catch { /* ignore */ }
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check Twitter keys are configured
  if (!process.env.TWITTER_CONSUMER_KEY || !process.env.TWITTER_ACCESS_TOKEN) {
    return NextResponse.json({ error: "Twitter not configured" }, { status: 500 });
  }

  try {
    // Get platform stats for stats tweets
    const [userCount, postCount, bountyCount] = await Promise.all([
      prisma.user.count({ where: { isBot: false } }),
      prisma.post.count({ where: { publishedAt: { not: null } } }),
      prisma.bounty.count({ where: { status: "OPEN" } }),
    ]);

    // Get a trending post from the last 24h to potentially feature
    const trendingPost = await prisma.post.findFirst({
      where: {
        publishedAt: { not: null },
        isDarkMode: false,
        author: { isBot: false },
        createdAt: { gte: new Date(Date.now() - 24 * 3600000) },
      },
      orderBy: { reactions: { _count: "desc" } },
      include: {
        author: { select: { username: true } },
        _count: { select: { reactions: true } },
      },
    });

    // Rotate through tweet types
    const lastType = await getLastTweetType();
    const typeRotation = ["awareness", "stats", "features", "engagement", "awareness", "features"];
    const lastIdx = typeRotation.indexOf(lastType);
    const nextType = typeRotation[(lastIdx + 1) % typeRotation.length];

    let tweetText = "";

    if (nextType === "stats" && userCount > 0) {
      tweetText = pick(TWEET_TEMPLATES.stats(userCount, postCount, bountyCount));
    } else if (nextType === "engagement") {
      tweetText = pick(TWEET_TEMPLATES.engagement);
    } else if (nextType === "features") {
      tweetText = pick(TWEET_TEMPLATES.features);
    } else {
      tweetText = pick(TWEET_TEMPLATES.awareness);
    }

    // If there's a trending real user post, occasionally feature it
    if (trendingPost && trendingPost._count.reactions >= 3 && Math.random() < 0.3) {
      tweetText = `🔥 Trending on VOID right now:\n\n"${trendingPost.title ?? trendingPost.content.slice(0, 80)}..."\n\nby @${trendingPost.author?.username}\n\nhttps://void-platform.vercel.app/post/${trendingPost.id}`;
    }

    // Post the tweet
    const result = await postTweet(tweetText);

    if (result) {
      await setLastTweetType(nextType);
      console.log(`✅ Tweeted (${nextType}): ${result.id}`);
    }

    return NextResponse.json({
      success: !!result,
      tweetId: (result as any)?.id,
      type: nextType,
      preview: tweetText.slice(0, 100) + "...",
    });
  } catch (error) {
    console.error("Twitter cron error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
