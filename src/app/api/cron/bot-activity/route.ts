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
 * Bot Activity Cron — runs daily at 6am UTC
 * Simulates 8 rounds of 3-hour activity to spread posts throughout the day
 * Vercel Hobby plan only allows daily crons
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = { posts: 0, reactions: 0, comments: 0, answers: 0 };

    const bots = await prisma.user.findMany({
      where: { isBot: true },
      select: { id: true, botPersona: true, techStack: true, username: true },
    });

    if (bots.length === 0) {
      return NextResponse.json({ message: "No bots found", results });
    }

    // ── 1. Post creation — 8 rounds simulating 3h intervals ─────────────────
    const ROUNDS = 8;
    for (let round = 0; round < ROUNDS; round++) {
      const postingBots = bots.filter(() => Math.random() < 0.04);
      const hoursAgo = round * 3 + randInt(0, 2);
      const postTime = new Date(Date.now() - hoursAgo * 3600000);

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

          await prisma.post.create({
            data: {
              type: content.type,
              title: content.title?.slice(0, 200),
              content: content.content,
              codeSnippet: content.codeSnippet,
              language: content.language,
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
    }

    // ── 2. React to recent real-user posts ───────────────────────────────────
    const recentRealPosts = await prisma.post.findMany({
      where: {
        publishedAt: { not: null },
        author: { isBot: false },
        createdAt: { gte: new Date(Date.now() - 24 * 3600000) },
      },
      select: { id: true, authorId: true },
      take: 30,
    });

    const reactionTypes = ["used_this", "saved_me_hours", "brilliant"];
    for (const post of recentRealPosts) {
      const reactors = bots.sort(() => Math.random() - 0.5).slice(0, randInt(3, 12));
      for (const reactor of reactors) {
        try {
          await prisma.postReaction.create({
            data: { postId: post.id, userId: reactor.id, type: pick(reactionTypes) },
          });
          if (post.authorId) {
            await awardReputation(post.authorId, "post_reaction", "Bot reacted to your post");
          }
          results.reactions++;
        } catch { /* skip duplicates */ }
      }
    }

    // ── 3. Comment on recent posts ───────────────────────────────────────────
    const postsToComment = await prisma.post.findMany({
      where: {
        publishedAt: { not: null },
        createdAt: { gte: new Date(Date.now() - 24 * 3600000) },
      },
      select: { id: true, authorId: true, content: true },
      take: 40,
    });

    for (const post of postsToComment) {
      if (Math.random() > 0.4) continue;
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
      take: 15,
    });

    for (const question of unansweredQuestions) {
      if (Math.random() > 0.7) continue;
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
