import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const HASHNODE_API = "https://gql.hashnode.com";

async function hashnodeQuery(query: string, variables: any = {}) {
  const res = await fetch(HASHNODE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": process.env.HASHNODE_API_KEY!,
    },
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

// Article templates — 6 unique articles
function getArticle(index: number, stats: { users: number; posts: number; bounties: number }) {
  const articles = [
    {
      title: "I built a developer-only social network with anonymous posting — here's what I learned",
      tags: ["webdev", "programming", "opensource", "community"],
      content: `## The problem with existing developer platforms

Most platforms are built for everyone. Stack Overflow is great for Q&A but terrible for sharing projects. GitHub is great for code but has no community. Twitter is full of noise.

I wanted a place where developers could:
- Share code snippets and technical threads without algorithm manipulation
- Buy and sell developer tools (API credits, SaaS seats, GPU access)
- Ask questions **anonymously** without reputation damage
- Post bounties for problems they need solved

So I built **VOID** — a platform exclusively for developers.

## The anonymous posting feature (Dark Mode)

The most interesting feature is what I call "Dark Mode" — one click and you get a completely anonymous identity:

\`\`\`
🖤 Dark mode enabled — you are ghost_0x7f
Your identity is completely hidden
\`\`\`

No link to your real account. Ever. The platform stores zero connection between your identity and your dark mode sessions.

**Why this matters:** Developers are afraid to ask "dumb" questions publicly. With anonymous posting, you can ask anything without worrying about your reputation.

## The marketplace

Developers constantly have unused resources:
- Unused GitHub Copilot seats
- Leftover OpenAI API credits
- JetBrains licenses they don't need
- GPU access they're not using

VOID has a built-in escrow system. No Stripe needed — it's all internal.

## The reputation system

Every contribution earns points: **NEWCOMER → BUILDER → HACKER → ARCHITECT → LEGEND**

You can export your reputation as a signed JSON credential and put it on your resume.

## Current stats

- 👥 ${stats.users} developers
- 📝 ${stats.posts} posts
- 💰 ${stats.bounties} open bounties

## Try it free

👉 **[https://void-platform.vercel.app](https://void-platform.vercel.app)**

GitHub login. 30 seconds. Free forever.`,
    },
    {
      title: "The developer marketplace nobody built — so I built it",
      tags: ["webdev", "startup", "programming", "tools"],
      content: `## Developers waste thousands every year

- You buy a $200 JetBrains license and switch to VS Code after 2 months
- You buy $500 in OpenAI credits for a project that gets cancelled
- You have a GitHub Copilot Business seat nobody uses
- You have a GPU sitting idle 20 hours a day

There's no good place to sell any of this. Until now.

## VOID Marketplace

A marketplace specifically for developer resources:

**What you can sell:**
- SaaS seats (GitHub Copilot, JetBrains, etc.)
- API credits (OpenAI, Anthropic, etc.)
- GPU access (rent by the hour)
- Side projects and SaaS products
- Software licenses

**How it works:**
1. List your item (2 minutes)
2. Buyer pays into escrow
3. You deliver
4. Buyer confirms → you get paid
5. Auto-refund if seller disappears after 7 days

No Stripe setup. No external payment processor. Built-in escrow.

## Beyond the marketplace

VOID also has:
- Developer social feed (code snippets, threads, project drops)
- Knowledge base (Stack Overflow done right)
- Bounties (post a problem, offer a reward)
- Anonymous posting (ask anything without reputation damage)
- Guilds organized by tech stack

## Try it

👉 **[https://void-platform.vercel.app](https://void-platform.vercel.app)**

${stats.users} developers, ${stats.posts} posts, ${stats.bounties} open bounties.`,
    },
    {
      title: "Why I added anonymous posting to my developer platform",
      tags: ["webdev", "programming", "discuss", "community"],
      content: `## Developers are afraid to ask questions

Not because they're bad developers. Because the internet is brutal.

One "dumb" question on Stack Overflow and you get downvoted, closed, and mocked. So developers stay stuck for hours on problems they could solve in minutes.

## Dark Mode — anonymous posting for developers

I built a feature called Dark Mode on VOID. One click:

\`\`\`
🖤 Dark mode enabled — you are ghost_0x7f
Your identity is completely hidden
\`\`\`

Random handle. No link to your real account. Ever.

**What people use it for:**
- Asking "beginner" questions without reputation damage
- Posting controversial technical opinions
- Sharing embarrassing debugging stories
- Asking for salary advice

## The reaction

Dark Mode became the most-used feature on VOID. Turns out developers have a lot they want to say anonymously.

Some of the best technical discussions happen in Dark Mode.

## Try it

👉 **[https://void-platform.vercel.app/dark](https://void-platform.vercel.app/dark)**

One click. Zero identity. Ask anything.`,
    },
    {
      title: "Building a reputation system that developers can export to their resume",
      tags: ["career", "programming", "webdev", "community"],
      content: `## The problem with developer credentials

Your GitHub shows your code. Your LinkedIn shows job titles. Neither shows your actual contribution to the developer community.

## VOID reputation is portable

Every contribution earns points:
- Post a code snippet → +1 pt
- Someone reacts to your post → +2 pts
- Your answer gets accepted → +25 pts
- Complete a bounty → +50 pts

Levels: **NEWCOMER → BUILDER → HACKER → ARCHITECT → LEGEND**

Export as a signed JSON credential:

\`\`\`json
{
  "@context": "https://void.dev/credentials/v1",
  "type": "VoidReputationCredential",
  "credentialSubject": {
    "username": "your_handle",
    "score": 2847,
    "level": "ARCHITECT"
  }
}
\`\`\`

Put it on your resume. Link it from your GitHub. Verifiable proof of your developer contributions.

## Join free

👉 **[https://void-platform.vercel.app](https://void-platform.vercel.app)**

${stats.users} developers building reputation right now.`,
    },
    {
      title: "Stack Overflow is broken — here's what I built instead",
      tags: ["webdev", "programming", "discuss", "community"],
      content: `## What's wrong with Stack Overflow

- Ask a question slightly wrong → downvoted and closed
- Answers go stale but stay at the top
- No way to verify if an answer still works in 2026
- Reputation system rewards speed over quality
- The community is hostile to beginners

## VOID Knowledge Base

I built a knowledge base that fixes these problems:

**Voting system** — upvote/downvote answers based on quality

**Accept answer** — question author marks the best answer

**"Still works" button** — community verifies answers are current. Click it and it timestamps the verification: ✓ Still works · 2 days ago

**Anonymous questions** — ask anything without reputation damage

**No hostile moderation** — questions don't get closed for being "too basic"

## Current stats

${stats.bounties} questions answered so far, with more every day.

## Try it

👉 **[https://void-platform.vercel.app/knowledge](https://void-platform.vercel.app/knowledge)**

Ask your first question. Anonymous if you want.`,
    },
    {
      title: "I built bounties with escrow for developers — no payment processor needed",
      tags: ["webdev", "programming", "startup", "tools"],
      content: `## The problem with developer bounties

Existing bounty platforms require:
- Setting up Stripe
- Paying platform fees
- Trusting a third party with your money
- Complex payout processes

## VOID Bounties

Post a problem. Set a reward. Community solves it.

**How it works:**
1. Post your bounty with a reward amount
2. Developers submit solutions
3. You review and accept the best one
4. Payment releases automatically

**Built-in escrow** — no Stripe, no external processor. Funds held internally until you confirm delivery. Auto-refund if no solution in 30 days.

**Anonymous submissions** — solvers can submit anonymously via Dark Mode.

## Current open bounties

${stats.bounties} bounties open right now, ranging from $50 to $500.

## Post a bounty

👉 **[https://void-platform.vercel.app/bounties](https://void-platform.vercel.app/bounties)**

Free to post. Free to solve. Built-in escrow.`,
    },
  ];

  return articles[index % articles.length];
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.HASHNODE_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Hashnode API key not configured" }, { status: 500 });

  try {
    // Get platform stats
    const [userCount, postCount, bountyCount] = await Promise.all([
      prisma.user.count({ where: { isBot: false } }),
      prisma.post.count({ where: { publishedAt: { not: null } } }),
      prisma.bounty.count({ where: { status: "OPEN" } }),
    ]);

    // Check last post (3 day cooldown)
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 3600000);
    const recentPost = await prisma.notification.findFirst({
      where: { type: "SYSTEM", title: "hashnode_last_post", createdAt: { gte: threeDaysAgo } },
    });

    if (recentPost) {
      return NextResponse.json({
        success: false,
        message: "Already posted in last 3 days",
        nextPost: new Date(recentPost.createdAt.getTime() + 3 * 24 * 3600000).toISOString(),
      });
    }

    // Get publication ID — use stored env var directly
    const publicationId = process.env.HASHNODE_PUBLICATION_ID || "69fb536b5724b606b7d3d77f";

    if (!publicationId) {
      return NextResponse.json({ error: "No publication ID" });
    }

    // Get article index based on how many we've posted
    const postCount2 = await prisma.notification.count({
      where: { type: "SYSTEM", title: "hashnode_last_post" },
    });

    const article = getArticle(postCount2, {
      users: userCount,
      posts: postCount,
      bounties: bountyCount,
    });

    // Publish article
    const result = await hashnodeQuery(`
      mutation PublishPost($input: PublishPostInput!) {
        publishPost(input: $input) {
          post {
            id
            title
            url
            slug
          }
        }
      }
    `, {
      input: {
        title: article.title,
        contentMarkdown: article.content,
        publicationId,
        tags: article.tags.map(t => ({ slug: t, name: t })),
        originalArticleURL: "https://void-platform.vercel.app",
        metaTags: {
          title: article.title,
          description: `VOID is a developer-only platform. ${userCount} developers, ${postCount} posts.`,
        },
      },
    });

    const post = result?.data?.publishPost?.post;

    if (!post) {
      return NextResponse.json({ error: "Failed to publish", details: result });
    }

    // Record the post
    const systemUser = await prisma.user.findFirst({ where: { isBot: false }, select: { id: true } });
    if (systemUser) {
      await prisma.notification.create({
        data: {
          userId: systemUser.id,
          type: "SYSTEM",
          title: "hashnode_last_post",
          body: post.url ?? "",
          isRead: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      url: post.url,
      title: post.title,
      id: post.id,
    });
  } catch (error) {
    console.error("Hashnode cron error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
