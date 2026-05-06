import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "No API key" });

  try {
    // Test 1: Check user
    const userRes = await fetch("https://dev.to/api/users/me", {
      headers: { "api-key": apiKey, "User-Agent": "VOIDPlatformBot/1.0" },
    });
    const userData = await userRes.json();

    // Test 2: Try publishing a draft article
    const articleRes = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "User-Agent": "VOIDPlatformBot/1.0",
      },
      body: JSON.stringify({
        article: {
          title: "VOID — Developer Platform with Anonymous Posting and Marketplace",
          body_markdown: `## What is VOID?

VOID is a platform built exclusively for developers.

**Features:**
- 📝 Social feed for code snippets, threads, project drops
- 🛒 Marketplace for dev tools (API credits, SaaS seats, GPU access)
- 📚 Knowledge base with voting and accepted answers
- 🖤 Anonymous "Dark Mode" posting — zero identity, one click
- 💰 Bounties with built-in escrow
- 🏆 Reputation system: NEWCOMER → BUILDER → HACKER → ARCHITECT → LEGEND

## Try it free

👉 **[https://void-platform.vercel.app](https://void-platform.vercel.app)**

GitHub login. 30 seconds. Free forever.

## The anonymous posting feature

One click → you become \`ghost_0x7f\`. No link to your real account. Ask anything without reputation damage.

## The marketplace

Buy/sell unused developer resources:
- GitHub Copilot seats
- OpenAI API credits  
- JetBrains licenses
- GPU access (rent by the hour)
- Side projects

Built-in escrow. No Stripe needed.

---

*Built by developers, for developers. Join 500+ builders already on VOID.*`,
          published: true,
          tags: ["webdev", "programming", "opensource", "productivity"],
          canonical_url: "https://void-platform.vercel.app",
          description: "VOID is a developer-only platform with social feed, marketplace, knowledge base, and anonymous posting. Free to join.",
        },
      }),
    });

    const articleData = await articleRes.json();

    return NextResponse.json({
      userStatus: userRes.status,
      user: userData,
      articleStatus: articleRes.status,
      article: articleData,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) });
  }
}
