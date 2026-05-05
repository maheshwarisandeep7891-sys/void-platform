/**
 * VOID Bot Seeder — Creates 500 labeled AI community accounts
 * Run: npx ts-node --project tsconfig.json prisma/seed-bots.ts
 */
import { PrismaClient } from "@prisma/client";
import {
  BOT_PERSONAS, FIRST_NAMES, LAST_NAMES,
  generateBio, generateUsername, generateAvatarUrl,
  generatePostContent, generateComment, generateQuestionAnswer,
} from "../src/lib/bot-content";

const prisma = new PrismaClient();

const REPUTATION_LEVELS = [
  { level: "NEWCOMER", score: [0, 99], weight: 0.25 },
  { level: "BUILDER",  score: [100, 499], weight: 0.35 },
  { level: "HACKER",   score: [500, 1999], weight: 0.25 },
  { level: "ARCHITECT",score: [2000, 9999], weight: 0.12 },
  { level: "LEGEND",   score: [10000, 25000], weight: 0.03 },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRepLevel() {
  const r = Math.random();
  let cumulative = 0;
  for (const { level, score, weight } of REPUTATION_LEVELS) {
    cumulative += weight;
    if (r <= cumulative) {
      return { level, score: randInt(score[0], score[1]) };
    }
  }
  return { level: "BUILDER", score: randInt(100, 499) };
}

async function main() {
  console.log("🤖 Creating 500 AI community accounts...\n");

  const BOT_COUNT = 500;
  const usedUsernames = new Set<string>();
  const createdBots: any[] = [];

  // Get existing usernames to avoid conflicts
  const existing = await prisma.user.findMany({ select: { username: true } });
  existing.forEach(u => usedUsernames.add(u.username));

  for (let i = 0; i < BOT_COUNT; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const persona = pick(BOT_PERSONAS);

    let username = generateUsername(firstName, lastName, i);
    // Ensure uniqueness
    let attempt = 0;
    while (usedUsernames.has(username)) {
      username = `${username}${attempt++}`;
    }
    usedUsernames.add(username);

    const email = `bot_${username}_${i}@void-bot.internal`;
    const name = `${firstName} ${lastName}`;
    const bio = generateBio(persona.persona, persona.techStack);
    const avatarUrl = generateAvatarUrl(`${username}-${i}`);
    const { level, score } = pickRepLevel();

    // Random join date in the past 2 years
    const daysAgo = randInt(1, 730);
    const createdAt = new Date(Date.now() - daysAgo * 86400000);

    try {
      const bot = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          username,
          name,
          bio,
          image: avatarUrl,
          isBot: true,
          botPersona: persona.persona,
          techStack: persona.techStack,
          openToCollaborate: Math.random() > 0.5,
          openToMentor: Math.random() > 0.7,
          openToHire: Math.random() > 0.6,
          createdAt,
          reputation: {
            create: { score, level: level as any },
          },
        },
      });
      createdBots.push({ ...bot, persona });

      if ((i + 1) % 50 === 0) {
        console.log(`  ✓ Created ${i + 1}/500 bot accounts`);
      }
    } catch (err) {
      // Skip duplicates silently
    }
  }

  console.log(`\n✅ Created ${createdBots.length} bot accounts\n`);

  // Create initial posts for each bot (1-3 posts per bot)
  console.log("📝 Generating initial posts...");
  let postCount = 0;

  for (const bot of createdBots) {
    const numPosts = randInt(1, 3);
    for (let p = 0; p < numPosts; p++) {
      const content = generatePostContent(bot.persona.persona, bot.persona.techStack);
      const daysAgo = randInt(0, 60);
      const publishedAt = new Date(Date.now() - daysAgo * 86400000 - randInt(0, 86400000));

      try {
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
            publishedAt,
            createdAt: publishedAt,
            tags: { create: tagConnections },
          },
        });
        postCount++;
      } catch {
        // Skip errors
      }
    }
  }

  console.log(`✅ Created ${postCount} initial posts\n`);

  // Add reactions between bots
  console.log("⚡ Adding reactions...");
  const allPosts = await prisma.post.findMany({
    where: { authorId: { in: createdBots.map(b => b.id) } },
    select: { id: true, authorId: true },
    take: 500,
  });

  const reactionTypes = ["used_this", "saved_me_hours", "brilliant"];
  let reactionCount = 0;

  for (const post of allPosts.slice(0, 200)) {
    const reactors = createdBots
      .filter(b => b.id !== post.authorId)
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
        reactionCount++;
      } catch {
        // Skip duplicates
      }
    }
  }

  console.log(`✅ Added ${reactionCount} reactions\n`);

  // Add comments
  console.log("💬 Adding comments...");
  let commentCount = 0;

  for (const post of allPosts.slice(0, 100)) {
    const commenters = createdBots
      .filter(b => b.id !== post.authorId)
      .sort(() => Math.random() - 0.5)
      .slice(0, randInt(1, 4));

    for (const commenter of commenters) {
      try {
        await prisma.comment.create({
          data: {
            content: generateComment(post.id),
            postId: post.id,
            userId: commenter.id,
          },
        });
        commentCount++;
      } catch {
        // Skip errors
      }
    }
  }

  console.log(`✅ Added ${commentCount} comments\n`);

  // Answer some questions
  console.log("🎓 Answering questions...");
  const questions = await prisma.question.findMany({
    select: { id: true, title: true, authorId: true },
    take: 50,
  });

  let answerCount = 0;
  for (const question of questions) {
    const answerers = createdBots
      .filter(b => b.id !== question.authorId)
      .sort(() => Math.random() - 0.5)
      .slice(0, randInt(1, 3));

    for (const answerer of answerers) {
      try {
        await prisma.answer.create({
          data: {
            content: generateQuestionAnswer(question.title),
            questionId: question.id,
            authorId: answerer.id,
          },
        });
        answerCount++;
      } catch {
        // Skip errors
      }
    }
  }

  console.log(`✅ Added ${answerCount} answers\n`);

  // Add guild memberships
  console.log("🏰 Joining guilds...");
  const guilds = await prisma.guild.findMany({ select: { id: true } });
  let memberCount = 0;

  for (const bot of createdBots.slice(0, 200)) {
    const numGuilds = randInt(1, 3);
    const selectedGuilds = guilds.sort(() => Math.random() - 0.5).slice(0, numGuilds);
    for (const guild of selectedGuilds) {
      try {
        await prisma.guildMember.create({
          data: { guildId: guild.id, userId: bot.id, role: "MEMBER" },
        });
        memberCount++;
      } catch {
        // Skip duplicates
      }
    }
  }

  console.log(`✅ Added ${memberCount} guild memberships\n`);

  // Follow relationships between bots
  console.log("👥 Creating follow network...");
  let followCount = 0;
  const sampleBots = createdBots.slice(0, 100);

  for (const bot of sampleBots) {
    const toFollow = sampleBots
      .filter(b => b.id !== bot.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, randInt(5, 20));

    for (const target of toFollow) {
      try {
        await prisma.follow.create({
          data: { followerId: bot.id, followingId: target.id },
        });
        followCount++;
      } catch {
        // Skip duplicates
      }
    }
  }

  console.log(`✅ Created ${followCount} follow relationships\n`);

  console.log("🎉 Bot seeding complete!");
  console.log(`   500 AI accounts with ⭐ badge`);
  console.log(`   ${postCount} posts`);
  console.log(`   ${reactionCount} reactions`);
  console.log(`   ${commentCount} comments`);
  console.log(`   ${answerCount} answers`);
  console.log(`   ${memberCount} guild memberships`);
  console.log(`   ${followCount} follows`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
