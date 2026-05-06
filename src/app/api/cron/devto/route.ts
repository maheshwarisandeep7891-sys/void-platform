import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Article templates — realistic dev articles that link back to VOID
function generateArticle(stats: {
  users: number; posts: number; bounties: number; questions: number;
}, topPost: any, topQuestion: any): { title: string; body: string; tags: string[] } {
  const templates = [
    {
      title: "I built a developer-only social network with anonymous posting — here's what I learned",
      tags: ["webdev", "programming", "opensource", "productivity"],
      body: `## The problem with existing developer platforms

Most developer platforms are built for everyone. Stack Overflow is great for Q&A but terrible for sharing projects. GitHub is great for code but has no community. Twitter is full of noise.

I wanted a place where developers could:
- Share code snippets and technical threads
- Buy and sell developer tools (API credits, SaaS seats, GPU access)
- Ask questions anonymously without reputation damage
- Post bounties for problems they need solved

So I built **VOID** — a platform exclusively for developers.

## The anonymous posting feature

The most interesting feature is what I call "Dark Mode" — one click and you get a completely anonymous identity. No link to your real account, ever.

This solves a real problem: developers are afraid to ask "dumb" questions publicly. With anonymous posting, you can ask anything without worrying about your reputation.

\`\`\`
$ void dark
🖤 Dark mode enabled — you are ghost_0x7f
Your identity is completely hidden
\`\`\`

## The marketplace

Developers constantly have unused resources:
- Unused GitHub Copilot seats
- Leftover OpenAI API credits  
- JetBrains licenses they don't need
- GPU access they're not using

VOID has a built-in escrow system so buyers and sellers are protected. No Stripe needed — it's all internal.

## The reputation system

Every contribution earns reputation points:
- **NEWCOMER** → **BUILDER** → **HACKER** → **ARCHITECT** → **LEGEND**

The best part: you can export your reputation as a signed JSON credential and put it on your resume.

## Current stats

- 👥 ${stats.users} developers
- 📝 ${stats.posts} posts
- 💰 ${stats.bounties} open bounties
- ❓ ${stats.questions} questions answered

## Try it

👉 **https://void-platform.vercel.app**

It's free. GitHub login. Takes 30 seconds.

Would love feedback from the dev.to community — what features would make you actually use a developer-specific platform?`,
    },
    {
      title: "The developer marketplace nobody built yet — so I built it",
      tags: ["webdev", "programming", "startup", "tools"],
      body: `## Developers waste thousands of dollars every year

Think about it:
- You buy a $200 JetBrains license and switch to VS Code after 2 months
- You buy $500 in OpenAI credits for a project that gets cancelled
- You have a GitHub Copilot Business seat nobody on your team uses
- You have a GPU sitting idle 20 hours a day

There's no good place to sell any of this.

## I built VOID marketplace

VOID is a marketplace specifically for developer resources:

**What you can sell:**
- SaaS seats (GitHub Copilot, JetBrains, etc.)
- API credits (OpenAI, Anthropic, etc.)
- GPU access (rent by the hour)
- Side projects and SaaS products
- Domain names
- Software licenses

**How it works:**
1. List your item (takes 2 minutes)
2. Buyer pays into escrow
3. You deliver
4. Buyer confirms → you get paid
5. Auto-refund if seller disappears after 7 days

No Stripe setup needed. No external payment processor. Built-in escrow.

## It's also a social network

Beyond the marketplace, VOID has:
- A developer feed (code snippets, threads, project drops)
- Knowledge base (Stack Overflow done right)
- Bounties (post a problem, offer a reward)
- Anonymous posting (ask anything without reputation damage)
- Guilds organized by tech stack

## Current listings

There are currently **${stats.posts}** posts and **${stats.bounties}** open bounties on the platform.

## Try it free

👉 **https://void-platform.vercel.app**

GitHub login, completely free. What would you list first?`,
    },
    {
      title: "Why developers need their own internet — and what I'm building",
      tags: ["programming", "webdev", "community", "discuss"],
      body: `## The developer internet is broken

**Stack Overflow** — great answers, terrible community. One wrong question and you get downvoted into oblivion.

**GitHub** — perfect for code, zero community features.

**Twitter/X** — too much noise, algorithm pushes engagement bait.

**LinkedIn** — nobody wants to be there.

**Discord** — ephemeral, unsearchable, chaotic.

**Reddit** — good communities but terrible for code sharing.

None of these were built for developers specifically. They were built for everyone, then developers showed up.

## What developers actually need

After talking to hundreds of developers, here's what they want:

1. **A feed without algorithm manipulation** — just chronological posts from people you follow
2. **Anonymous posting** — to ask "dumb" questions without reputation damage  
3. **A marketplace** — to buy/sell the dev tools they're not using
4. **A knowledge base** — where answers don't go stale
5. **Reputation that means something** — earned through real contributions, not upvotes

## I built VOID

VOID is my attempt at the developer internet done right.

**Feed:** Share code snippets, threads, project drops. No algorithm. Chronological.

**Dark Mode:** One click → completely anonymous. New random handle every session. Zero link to your real identity.

**Marketplace:** Buy/sell API credits, SaaS seats, GPU access, side projects. Built-in escrow.

**Knowledge:** Q&A with voting, accepted answers, "still works" verification.

**Bounties:** Post a problem with a reward. Community solves it.

**Reputation:** NEWCOMER → BUILDER → HACKER → ARCHITECT → LEGEND. Exportable as a signed credential.

## The numbers so far

- ${stats.users} developers signed up
- ${stats.posts} posts published
- ${stats.questions} questions answered
- ${stats.bounties} open bounties

## Try it

👉 **https://void-platform.vercel.app**

Free. GitHub login. 30 seconds.

I'd genuinely love feedback from the dev.to community — you're exactly the people I built this for.`,
    },
    {
      title: "Why I built a reputation system that you can export to your resume",
      tags: ["career", "programming", "webdev", "discuss"],
      body: `## The problem with developer credentials

Your GitHub profile shows your code. Your LinkedIn shows your job titles. But neither shows your actual contribution to the developer community.

Stack Overflow reputation is the closest thing — but it's locked inside Stack Overflow.

## VOID reputation is portable

On VOID, every contribution earns points:
- Post a code snippet → +1 pt
- Someone reacts to your post → +2 pts
- Your answer gets accepted → +25 pts
- Complete a bounty → +50 pts

You level up: **NEWCOMER → BUILDER → HACKER → ARCHITECT → LEGEND**

The best part: you can export it as a **signed JSON credential**:

\`\`\`json
{
  "@context": "https://void.dev/credentials/v1",
  "type": "VoidReputationCredential",
  "credentialSubject": {
    "username": "your_handle",
    "score": 2847,
    "level": "ARCHITECT",
    "memberSince": "2026-01-01"
  }
}
\`\`\`

Put it on your resume. Link it from your GitHub. It's verifiable proof of your developer contributions.

## Current leaderboard

${stats.users} developers are building reputation on VOID right now.

Top levels:
- 🏆 LEGEND: 10,000+ pts
- 🔮 ARCHITECT: 2,000+ pts  
- 💻 HACKER: 500+ pts
- 🔨 BUILDER: 100+ pts

## Join free

👉 **https://void-platform.vercel.app**

GitHub login. Start earning reputation immediately.`,
    },
    {
      title: "I added anonymous posting to my developer platform — here's why",
      tags: ["webdev", "programming", "discuss", "community"],
      body: `## The problem nobody talks about

Developers are afraid to ask questions publicly.

Not because they're bad developers. Because the internet is brutal. One "dumb" question on Stack Overflow and you get downvoted, closed, and mocked.

So developers stay stuck. They spend hours on a problem they could solve in minutes if they just asked.

## Dark Mode — anonymous posting for developers

I built a feature called Dark Mode on VOID. One click:

\`\`\`
🖤 Dark mode enabled — you are ghost_0x7f
Your identity is completely hidden
\`\`\`

You get a random handle. No link to your real account. Ever. The platform stores no connection between your identity and your dark mode sessions.

**What people use it for:**
- Asking "beginner" questions without reputation damage
- Posting controversial technical opinions
- Sharing embarrassing debugging stories
- Asking for salary advice

## The reaction

Since launching Dark Mode, it's become the most-used feature on VOID. Turns out developers have a lot they want to say anonymously.

Some of the best technical discussions on the platform happen in Dark Mode.

## Try it

👉 **https://void-platform.vercel.app/dark**

One click. Zero identity. Ask anything.

Currently ${stats.users} developers on the platform, ${stats.posts} posts published.`,
    },
  ];

  // Rotate based on day of month for more variety
  const dayOfMonth = new Date().getDate();
  return templates[dayOfMonth % templates.length];
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Dev.to API key not configured" }, { status: 500 });
  }

  try {
    // Get platform stats
    const [userCount, postCount, bountyCount, questionCount] = await Promise.all([
      prisma.user.count({ where: { isBot: false } }),
      prisma.post.count({ where: { publishedAt: { not: null } } }),
      prisma.bounty.count({ where: { status: "OPEN" } }),
      prisma.question.count(),
    ]);

    // Get top post and question for featuring
    const topPost = await prisma.post.findFirst({
      where: { publishedAt: { not: null }, isDarkMode: false, author: { isBot: false } },
      orderBy: { reactions: { _count: "desc" } },
      select: { title: true, content: true, id: true },
    });

    const topQuestion = await prisma.question.findFirst({
      orderBy: { views: "desc" },
      select: { title: true, id: true },
    });

    const article = generateArticle(
      { users: userCount, posts: postCount, bounties: bountyCount, questions: questionCount },
      topPost,
      topQuestion
    );

    // Check if we already posted in last 3 days (avoid spam ban)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600000);
    const recentPost = await prisma.notification.findFirst({
      where: {
        type: "SYSTEM",
        title: "devto_last_post",
        createdAt: { gte: threeDaysAgo },
      },
    });

    if (recentPost) {
      return NextResponse.json({
        success: false,
        message: "Already posted in last 3 days — protecting account from spam ban",
        nextPost: new Date(recentPost.createdAt.getTime() + 3 * 24 * 3600000).toISOString(),
      });
    }

    // Publish to Dev.to
    const res = await fetch("https://dev.to/api/articles", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        "User-Agent": "VOIDPlatformBot/1.0",
      },
      body: JSON.stringify({
        article: {
          title: article.title,
          body_markdown: article.body,
          published: true,
          tags: article.tags,
          canonical_url: "https://void-platform.vercel.app",
          description: `VOID is a developer-only platform with social feed, marketplace, knowledge base, and anonymous posting. ${userCount} developers, ${postCount} posts.`,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Dev.to error:", res.status, err);
      return NextResponse.json({ success: false, error: err });
    }

    const data = await res.json();

    // Record that we posted
    const systemUser = await prisma.user.findFirst({ where: { isBot: false }, select: { id: true } });
    if (systemUser) {
      await prisma.notification.create({
        data: {
          userId: systemUser.id,
          type: "SYSTEM",
          title: "devto_last_post",
          body: data.url ?? "",
          isRead: true,
        },
      });
    }

    console.log(`✅ Dev.to article published: ${data.url}`);

    return NextResponse.json({
      success: true,
      url: data.url,
      title: article.title,
      id: data.id,
    });
  } catch (error) {
    console.error("Dev.to cron error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
