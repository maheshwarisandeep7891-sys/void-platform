import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const DISCORD_API = "https://discord.com/api/v10";

// Discord embed templates for VOID content
function buildEmbed(type: string, data: any) {
  const base = {
    color: 0x8b5cf6, // VOID purple
    footer: {
      text: "VOID — Developer Platform",
      icon_url: "https://void-platform.vercel.app/api/og",
    },
    timestamp: new Date().toISOString(),
  };

  if (type === "post") {
    return {
      ...base,
      title: data.title ?? data.content?.slice(0, 80),
      description: data.content?.slice(0, 300) + (data.content?.length > 300 ? "..." : ""),
      url: `https://void-platform.vercel.app/post/${data.id}`,
      author: {
        name: `@${data.author?.username ?? "anonymous"} on VOID`,
        url: `https://void-platform.vercel.app/profile/${data.author?.username}`,
      },
      fields: [
        { name: "Type", value: data.type, inline: true },
        { name: "Reactions", value: String(data._count?.reactions ?? 0), inline: true },
        { name: "Comments", value: String(data._count?.comments ?? 0), inline: true },
      ],
    };
  }

  if (type === "bounty") {
    return {
      ...base,
      color: 0xf59e0b, // yellow for bounties
      title: `💰 Bounty: ${data.title}`,
      description: data.description?.slice(0, 300),
      url: `https://void-platform.vercel.app/bounties/${data.id}`,
      fields: [
        { name: "Reward", value: `$${data.reward}`, inline: true },
        { name: "Status", value: data.status, inline: true },
        { name: "Submissions", value: String(data._count?.submissions ?? 0), inline: true },
      ],
    };
  }

  if (type === "platform_update") {
    return {
      ...base,
      title: "🚀 VOID Platform Update",
      description: data.message,
      url: "https://void-platform.vercel.app",
      fields: data.fields ?? [],
    };
  }

  return base;
}

async function sendToChannel(channelId: string, content: string, embed?: any) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return false;

  const body: any = { content };
  if (embed) body.embeds = [embed];

  const res = await fetch(`${DISCORD_API}/channels/${channelId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bot ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "VOIDPlatformBot (https://void-platform.vercel.app, 1.0)",
    },
    body: JSON.stringify(body),
  });

  return res.ok;
}

async function getBotGuilds() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return [];

  const res = await fetch(`${DISCORD_API}/users/@me/guilds`, {
    headers: {
      Authorization: `Bot ${token}`,
      "User-Agent": "VOIDPlatformBot (https://void-platform.vercel.app, 1.0)",
    },
  });

  if (!res.ok) return [];
  return res.json();
}

async function getGuildChannels(guildId: string) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return [];

  const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
    headers: {
      Authorization: `Bot ${token}`,
      "User-Agent": "VOIDPlatformBot (https://void-platform.vercel.app, 1.0)",
    },
  });

  if (!res.ok) return [];
  return res.json();
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Discord bot token not configured" }, { status: 500 });
  }

  try {
    // Get bot info first
    const meRes = await fetch(`${DISCORD_API}/users/@me`, {
      headers: {
        Authorization: `Bot ${token}`,
        "User-Agent": "VOIDPlatformBot (https://void-platform.vercel.app, 1.0)",
      },
    });

    if (!meRes.ok) {
      const err = await meRes.text();
      return NextResponse.json({ error: "Bot auth failed", details: err });
    }

    const me = await meRes.json();

    // Get guilds the bot is in
    const guilds = await getBotGuilds();

    if (guilds.length === 0) {
      return NextResponse.json({
        success: false,
        bot: me.username,
        message: "Bot is not in any Discord servers yet. Add it to a server first.",
        inviteUrl: `https://discord.com/api/oauth2/authorize?client_id=1501781110361690264&permissions=2048&scope=bot`,
      });
    }

    const results = [];

    // Get platform stats for the message
    const [userCount, postCount, bountyCount] = await Promise.all([
      prisma.user.count({ where: { isBot: false } }),
      prisma.post.count({ where: { publishedAt: { not: null } } }),
      prisma.bounty.count({ where: { status: "OPEN" } }),
    ]);

    // Get trending post from last 24h
    const trendingPost = await prisma.post.findFirst({
      where: {
        publishedAt: { not: null },
        isDarkMode: false,
        createdAt: { gte: new Date(Date.now() - 24 * 3600000) },
      },
      orderBy: { reactions: { _count: "desc" } },
      include: {
        author: { select: { username: true } },
        _count: { select: { reactions: true, comments: true } },
      },
    });

    // Get open bounty
    const openBounty = await prisma.bounty.findFirst({
      where: { status: "OPEN" },
      orderBy: { reward: "desc" },
      include: { _count: { select: { submissions: true } } },
    });

    // Post to each guild's general/announcements channel
    for (const guild of guilds.slice(0, 5)) { // max 5 guilds
      try {
        const channels = await getGuildChannels(guild.id);

        // Find best channel to post in
        const targetChannel = channels.find((c: any) =>
          c.type === 0 && ( // text channel
            c.name?.includes("general") ||
            c.name?.includes("announce") ||
            c.name?.includes("dev") ||
            c.name?.includes("bot") ||
            c.name?.includes("void")
          )
        ) ?? channels.find((c: any) => c.type === 0); // fallback to first text channel

        if (!targetChannel) continue;

        // Rotate between different message types
        const hour = new Date().getHours();
        let sent = false;

        if (hour % 3 === 0 && trendingPost) {
          // Post trending content
          sent = await sendToChannel(
            targetChannel.id,
            `🔥 **Trending on VOID right now:**`,
            buildEmbed("post", trendingPost)
          );
        } else if (hour % 3 === 1 && openBounty) {
          // Post open bounty
          sent = await sendToChannel(
            targetChannel.id,
            `💰 **Open bounty on VOID — can you solve it?**`,
            buildEmbed("bounty", openBounty)
          );
        } else {
          // Post platform stats
          sent = await sendToChannel(
            targetChannel.id,
            ``,
            buildEmbed("platform_update", {
              message: `**VOID** is a developer platform with social feed, marketplace, and anonymous posting.\n\n🖤 **Dark Mode** — go fully anonymous with one click\n🛒 **Marketplace** — buy/sell API credits, SaaS seats, GPU access\n💰 **Bounties** — get paid to solve coding problems\n\n👉 **[Join free → void-platform.vercel.app](https://void-platform.vercel.app)**`,
              fields: [
                { name: "👥 Developers", value: String(userCount), inline: true },
                { name: "📝 Posts", value: String(postCount), inline: true },
                { name: "💰 Open Bounties", value: String(bountyCount), inline: true },
              ],
            })
          );
        }

        results.push({ guild: guild.name, channel: targetChannel.name, sent });
      } catch (err) {
        results.push({ guild: guild.name, error: String(err) });
      }
    }

    return NextResponse.json({
      success: true,
      bot: me.username,
      guildsFound: guilds.length,
      results,
      inviteUrl: `https://discord.com/api/oauth2/authorize?client_id=1501781110361690264&permissions=2048&scope=bot`,
    });
  } catch (error) {
    console.error("Discord cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
