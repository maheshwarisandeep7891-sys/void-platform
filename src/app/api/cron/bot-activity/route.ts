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

/**
 * Bot Activity Cron
 * Called every hour by cron-job.org (external free cron service)
 * ~20 bots post per hour = ~480 posts/day across 500 bots
 * Also reacts to real user posts and answers questions
 */
export async function GET(req: NextRequest) {
  // Verify cron secret
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = { posts: 0, reactions: 0, comments: 0, answers: 0 };

    // Get all bot accounts (sample 100 random ones per run for efficiency)
    const totalBots = await prisma.user.count({ where: { isBot: true } });
    const skip = Math.floor(Math.random() * Math.max(0, totalBots - 100));

    const bots = await prisma.user.findMany({
      where: { isBot: true },
      select: { id: true, botPersona: true, techStack: true, username: true },
      skip,
      take: 100,
    });

    if (bots.length === 0) {
      return NextResponse.json({ message: "No bots found", results });
    }

    // ── 1. ~20% of sampled bots post something new this hour ────────────────
    const postingBots = bots.filter(() => Math.random() < 0.20);

    for (const bot of postingBots) {
      try {
        const persona = bot.botPersona ?? "systems";
        const techStack = bot.techStack.length > 0 ? bot.techStack : ["TypeScript", "Go"];
        const content = generatePostContent(persona, techStack);

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

        // Stagger post times within the hour
        const minutesAgo = randInt(0, 55);
        const postTime = new Date(Date.now() - minutesAgo * 60000);

        await prisma.post.create({
          data: {
            type: content.type,
            title: content.title?.slice(0, 200),
            content: content.content,
            codeSnippet: (content as any).codeSnippet,
            language: (content as any).language,
            authorId: bot.id,
            publishedAt: postTime,
            createdAt: postTime,
            tags: { create: tagConnections },
          },
        });

        await awardReputation(bot.id, "post_created", `Bot posted a ${content.type.toLowerCase()}`);
        results.posts++;
      } catch {
        // Skip silently
      }
    }

    // ── 2. React to real user posts from the last 2 hours ───────────────────
    const recentRealPosts = await prisma.post.findMany({
      where: {
        publishedAt: { not: null },
        author: { isBot: false },
        createdAt: { gte: new Date(Date.now() - 2 * 3600000) },
      },
      select: { id: true, authorId: true },
      take: 20,
    });

    const reactionTypes = ["used_this", "saved_me_hours", "brilliant"];
    for (const post of recentRealPosts) {
      // 3-8 bots react to each new real post
      const reactors = bots
        .sort(() => Math.random() - 0.5)
        .slice(0, randInt(3, 8));

      for (const reactor of reactors) {
        try {
          await prisma.postReaction.create({
            data: { postId: post.id, userId: reactor.id, type: pick(reactionTypes) },
          });
          if (post.authorId) {
            await awardReputation(post.authorId, "post_reaction", "Your post got a reaction");
          }
          results.reactions++;
        } catch { /* skip duplicates */ }
      }
    }

    // ── 3. Comment on recent posts (real + bot) ──────────────────────────────
    const postsToComment = await prisma.post.findMany({
      where: {
        publishedAt: { not: null },
        createdAt: { gte: new Date(Date.now() - 3 * 3600000) },
      },
      select: { id: true, authorId: true, content: true },
      take: 15,
    });

    for (const post of postsToComment) {
      if (Math.random() > 0.35) continue; // 35% of posts get a comment
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
      } catch { /* skip */ }
    }

    // ── 4. Answer unanswered questions ───────────────────────────────────────
    const unansweredQuestions = await prisma.question.findMany({
      where: {
        answers: { none: {} },
        createdAt: { gte: new Date(Date.now() - 48 * 3600000) },
      },
      select: { id: true, title: true, authorId: true },
      take: 5,
    });

    for (const question of unansweredQuestions) {
      if (Math.random() > 0.6) continue;
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
        if (question.authorId) {
          await prisma.notification.create({
            data: {
              userId: question.authorId,
              type: "COMMENT",
              title: `@${answerer.username} answered your question`,
              body: question.title.slice(0, 80),
              link: `/knowledge/${question.id}`,
            },
          });
        }
        results.answers++;
      } catch { /* skip */ }
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
