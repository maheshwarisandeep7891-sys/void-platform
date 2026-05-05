import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePostContent, generateComment, generateQuestionAnswer } from "@/lib/bot-content";
import { awardReputation } from "@/lib/reputation";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// POST /api/cron/bot-activity — runs every 3 hours via Vercel Cron
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = {
      posts: 0,
      reactions: 0,
      comments: 0,
      answers: 0,
    };

    // Get all bot accounts
    const bots = await prisma.user.findMany({
      where: { isBot: true },
      select: { id: true, botPersona: true, techStack: true, username: true },
    });

    if (bots.length === 0) {
      return NextResponse.json({ message: "No bots found", results });
    }

    // ── 1. Each bot has a 15% chance to post something new ──────────────────
    const postingBots = bots.filter(() => Math.random() < 0.15);

    for (const bot of postingBots) {
      try {
        const persona = bot.botPersona ?? "systems";
        const techStack = bot.techStack.length > 0 ? bot.techStack : ["TypeScript", "Go"];
        const content = generatePostContent(persona, techStack);

        // Handle tags
        const tagConnections = [];
        for (const tagName of content.tags.slice(0, 3)) {
          const slug = tagName.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 50);
          if (!slug) continue;
          const tag = await prisma.tag.upsert({
            where: { slug },
            create: { name: tagName, slug },
            update: {},
          });
          tagConnections.push({ tagId: tag.id });
        }

        await prisma.post.create({
          data: {
            type: content.type,
            title: content.title?.slice(0, 200),
            content: content.content,
            codeSnippet: content.codeSnippet,
            language: content.language,
            authorId: bot.id,
            publishedAt: new Date(),
            tags: { create: tagConnections },
          },
        });

        // Award reputation to bot
        await awardReputation(bot.id, "post_created", `Bot posted a ${content.type.toLowerCase()}`);
        results.posts++;
      } catch {
        // Skip errors silently
      }
    }

    // ── 2. Bots react to recent real-user posts ──────────────────────────────
    const recentRealPosts = await prisma.post.findMany({
      where: {
        publishedAt: { not: null },
        author: { isBot: false },
        createdAt: { gte: new Date(Date.now() - 6 * 60 * 60 * 1000) }, // last 6h
      },
      select: { id: true, authorId: true },
      take: 20,
    });

    const reactionTypes = ["used_this", "saved_me_hours", "brilliant"];

    for (const post of recentRealPosts) {
      const reactors = bots
        .sort(() => Math.random() - 0.5)
        .slice(0, randInt(2, 8));

      for (const reactor of reactors) {
        try {
          await prisma.postReaction.create({
            data: {
              postId: post.id,
              userId: reactor.id,
              type: pick(reactionTypes),
            },
          });
          // Award rep to post author
          if (post.authorId) {
            await awardReputation(post.authorId, "post_reaction", "Bot reacted to your post");
          }
          results.reactions++;
        } catch {
          // Skip duplicates
        }
      }
    }

    // ── 3. Bots comment on recent posts (10% chance per bot per post) ────────
    const postsToComment = await prisma.post.findMany({
      where: {
        publishedAt: { not: null },
        createdAt: { gte: new Date(Date.now() - 12 * 60 * 60 * 1000) }, // last 12h
      },
      select: { id: true, authorId: true, content: true },
      take: 30,
    });

    for (const post of postsToComment) {
      if (Math.random() > 0.3) continue; // 30% of posts get a comment

      const commenter = pick(bots);
      if (commenter.id === post.authorId) continue;

      try {
        await prisma.comment.create({
          data: {
            content: generateComment(post.content.slice(0, 100)),
            postId: post.id,
            userId: commenter.id,
          },
        });
        results.comments++;
      } catch {
        // Skip errors
      }
    }

    // ── 4. Bots answer unanswered questions ──────────────────────────────────
    const unansweredQuestions = await prisma.question.findMany({
      where: {
        answers: { none: {} },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // last 24h
      },
      select: { id: true, title: true, authorId: true },
      take: 10,
    });

    for (const question of unansweredQuestions) {
      if (Math.random() > 0.6) continue; // 60% chance of getting answered

      const answerer = bots.find(b => b.id !== question.authorId);
      if (!answerer) continue;

      try {
        await prisma.answer.create({
          data: {
            content: generateQuestionAnswer(question.title),
            questionId: question.id,
            authorId: answerer.id,
          },
        });

        // Notify question author
        if (question.authorId) {
          await prisma.notification.create({
            data: {
              userId: question.authorId,
              type: "COMMENT",
              title: `@${answerer.username} answered your question`,
              body: `New answer on: ${question.title.slice(0, 80)}`,
              link: `/knowledge/${question.id}`,
            },
          });
        }

        results.answers++;
      } catch {
        // Skip errors
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      botsActive: bots.length,
      results,
    });
  } catch (error) {
    console.error("Bot activity cron error:", error);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}
