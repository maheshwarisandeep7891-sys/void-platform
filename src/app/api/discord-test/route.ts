import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return NextResponse.json({ error: "No token" });

  // Get bot guilds
  const guildsRes = await fetch("https://discord.com/api/v10/users/@me/guilds", {
    headers: { Authorization: `Bot ${token}`, "User-Agent": "VOIDBot/1.0" },
  });
  const guilds = await guildsRes.json();

  // Get channels for first guild
  const channels: any[] = [];
  if (guilds.length > 0) {
    const chRes = await fetch(`https://discord.com/api/v10/guilds/${guilds[0].id}/channels`, {
      headers: { Authorization: `Bot ${token}`, "User-Agent": "VOIDBot/1.0" },
    });
    const ch = await chRes.json();
    channels.push(...(Array.isArray(ch) ? ch.filter((c: any) => c.type === 0).map((c: any) => ({ id: c.id, name: c.name })) : []));

    // Send test message to first text channel
    if (channels.length > 0) {
      const msgRes = await fetch(`https://discord.com/api/v10/channels/${channels[0].id}/messages`, {
        method: "POST",
        headers: { Authorization: `Bot ${token}`, "Content-Type": "application/json", "User-Agent": "VOIDBot/1.0" },
        body: JSON.stringify({
          content: "👋 **VOID Bot is working!**\n\nThis is a test message from VOID Platform.\n\n🔗 https://void-platform.vercel.app",
        }),
      });
      const msg = await msgRes.json();
      return NextResponse.json({ guilds: guilds.map((g: any) => g.name), channels, messageSent: msgRes.ok, messageId: msg.id, channelPostedTo: channels[0].name });
    }
  }

  return NextResponse.json({ guilds: guilds.map((g: any) => g.name), channels, error: "No text channels found" });
}
