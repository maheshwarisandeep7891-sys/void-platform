/**
 * VOID Bot Seeder — Creates 500 labeled AI community accounts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PERSONAS = [
  { persona: "systems", techStack: ["Rust", "C++", "WebAssembly", "LLVM"] },
  { persona: "kernel", techStack: ["C", "Linux", "eBPF", "Assembly"] },
  { persona: "frontend", techStack: ["TypeScript", "React", "Next.js", "CSS"] },
  { persona: "fullstack", techStack: ["TypeScript", "Node.js", "PostgreSQL", "Redis"] },
  { persona: "distributed", techStack: ["Go", "gRPC", "Kafka", "Kubernetes"] },
  { persona: "devops", techStack: ["Kubernetes", "Terraform", "Prometheus", "Go"] },
  { persona: "database", techStack: ["PostgreSQL", "Redis", "ClickHouse", "SQLite"] },
  { persona: "ml", techStack: ["Python", "PyTorch", "CUDA", "JAX"] },
  { persona: "functional", techStack: ["Haskell", "Elixir", "OCaml", "F#"] },
  { persona: "golang", techStack: ["Go", "gRPC", "Docker", "PostgreSQL"] },
  { persona: "python", techStack: ["Python", "FastAPI", "SQLAlchemy", "Celery"] },
  { persona: "security", techStack: ["Rust", "Python", "C", "Assembly"] },
  { persona: "cloud", techStack: ["AWS", "Terraform", "Go", "Python"] },
  { persona: "embedded", techStack: ["Rust", "C", "RTOS", "ARM"] },
  { persona: "webperf", techStack: ["JavaScript", "WebAssembly", "V8", "Chrome"] },
  { persona: "mlops", techStack: ["Python", "Kubernetes", "Ray", "MLflow"] },
];

const FIRST_NAMES = ["Alex","Jordan","Sam","Casey","Morgan","Riley","Taylor","Quinn","Avery","Blake","Cameron","Dakota","Emery","Finley","Gray","Harper","Indigo","Jamie","Kai","Lane","Micah","Noel","Oakley","Parker","Reese","Sage","Skyler","Tatum","Val","Winter","Ari","Bex","Cleo","Drew","Eli","Fern","Glen","Haze","Ira","Jude","Kit","Lev","Max","Nico","Orion","Pax","Remy","Sol","Theo","Uri","Vex","Wren","Xander","Yuki","Zara","Ace","Bay","Cruz","Dex","Echo","Flux","Gale","Hex","Iris","Jax","Knox","Lux","Mox","Nyx","Onyx","Pix","Rex","Six","Tux","Vox","Wax","Zion","Uma","Ren","Soren","Kira","Nova","Lyra","Zephyr","Caden","Rowan","Aspen","River","Skye","Briar","Cypress","Juniper","Linden","Maple","Birch","Cedar","Ash"];
const LAST_NAMES = ["Chen","Kim","Patel","Singh","Wang","Liu","Zhang","Kumar","Mueller","Schmidt","Weber","Fischer","Meyer","Wagner","Becker","Hoffman","Schulz","Koch","Bauer","Richter","Klein","Wolf","Neumann","Schwarz","Zimmermann","Braun","Hartmann","Lange","Schmitt","Werner","Schmitz","Krause","Meier","Lehmann","Schmid","Schulze","Maier","Koehler","Herrmann","Koenig","Walter","Mayer","Huber","Kaiser","Fuchs","Peters","Lang","Scholz","Moeller","Weiss","Jung","Hahn","Schubert","Vogel","Friedrich","Berg","Winkler","Roth","Lorenz","Baumann","Franke","Albrecht","Park","Lee","Nguyen","Tanaka","Yamamoto","Sato","Ito","Nakamura","Kobayashi","Watanabe","Suzuki","Saito","Kato","Yamada","Hayashi","Inoue","Kimura","Matsumoto","Fujiwara","Ogawa","Nishimura","Ikeda","Hashimoto","Yamashita","Ishikawa","Nakajima","Maeda","Fujita","Ogata","Goto","Okamoto","Hasegawa","Murakami","Kondo","Ishii","Saito","Shimizu","Yamaguchi","Imai","Nishida","Ando","Tanaka","Morita","Tamura","Kaneko","Watanabe","Ito","Suzuki","Sato","Kato","Yamamoto","Nakamura","Kobayashi","Hayashi","Inoue","Kimura","Matsumoto","Fujiwara","Ogawa","Nishimura","Ikeda","Hashimoto"];

const COMPANIES = ["Stripe","Cloudflare","Vercel","Linear","Figma","Notion","Supabase","PlanetScale","Fly.io","Railway","Render","Turso","Neon","Upstash","Tailscale","Oxide","Temporal","Buf","Warp","Zed","Replit","Gitpod","Codeium","Cursor","Sourcegraph"];
const LOCATIONS = ["Berlin","San Francisco","London","Amsterdam","Toronto","Singapore","Tokyo","Sydney","Stockholm","Zurich","Remote","Warsaw","Lisbon","Austin","Seattle","New York","Paris","Dublin","Vancouver","Melbourne"];
const TOPICS = ["performance","developer experience","type safety","observability","reliability","security","accessibility","open source","distributed systems","compilers","databases","networking"];
const THINGS = ["distributed systems","developer tools","compilers","databases","CLI tools","language servers","observability platforms","ML pipelines","edge runtimes","build systems","package managers","testing frameworks"];
const OPINIONS = ["most ORMs are a mistake at scale","microservices are overused by 90% of teams","TypeScript strict mode should be the default","Rust is the right choice for most new systems software","most databases are used wrong","the best code is no code","documentation is more important than tests","monorepos solve more problems than they create","most performance problems are database problems","Go's error handling is actually good","Kubernetes is too complex for most use cases","premature optimization is still the root of most evil","the best architecture is the one your team understands","boring technology is usually the right choice","most abstractions leak eventually"];
const TIPS = ["Read the source code, not just the docs","Profile before optimizing","Write the test first, even if you delete it later","Name things what they are, not what they do","The simplest solution is usually the right one","Understand your data access patterns before choosing a database","Logs are more valuable than metrics for debugging","Every abstraction has a cost","Boring technology is usually the right choice","Measure twice, cut once","Make it work, make it right, make it fast — in that order"];
const PROBLEMS = ["memory leaks","race conditions","N+1 queries","deadlocks","cache invalidation","distributed transactions","schema migrations","error handling","concurrency","backpressure","connection pooling"];
const ALTERNATIVES = ["the actor model","event sourcing","CQRS","the saga pattern","optimistic locking","CRDTs","append-only logs","the outbox pattern","the circuit breaker pattern"];
const SOLUTIONS = ["switching to connection pooling","adding a read replica","using a message queue","implementing backpressure","adding circuit breakers","using optimistic locking","switching to async processing"];
const GOTCHAS = ["this doesn't work well under high contention","memory usage can spike under load","the error messages are cryptic","it breaks with certain edge cases","the documentation is misleading","it has surprising behavior at scale"];

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateBio(persona: string, tech: string[]): string {
  const t0 = tech[0] ?? "TypeScript";
  const t1 = tech[1] ?? "Go";
  const templates = [
    `Building ${pick(THINGS)} with ${t0}. ${randInt(3,15)} years in the industry. Open source contributor.`,
    `${t0} developer. Currently working on ${pick(THINGS)}. Previously at ${pick(COMPANIES)}.`,
    `Obsessed with ${pick(TOPICS)}. Writing about ${t0} and ${pick(TOPICS)}. ${pick(LOCATIONS)}.`,
    `Staff engineer @ ${pick(COMPANIES)}. ${t0} + ${t1}. Building in public.`,
    `I make computers go fast. ${t0} enthusiast. ${randInt(3,15)}y exp.`,
    `Open source ${t0} developer. ${pick(LOCATIONS)}.`,
    `Building the future with ${t0}. ${pick(TOPICS)} nerd. ${randInt(3,15)} years shipping code.`,
    `${t0} + ${t1} + coffee. Working on ${pick(THINGS)}. ${pick(LOCATIONS)}.`,
    `Senior ${persona} engineer. ${t0} by day, ${t1} by night.`,
    `Indie hacker. ${pick(THINGS)} builder. ${t0} stack. ${pick(LOCATIONS)}.`,
    `ex-${pick(COMPANIES)}. Now building ${pick(THINGS)}. ${t0} + ${t1}.`,
    `${randInt(3,15)}y software engineer. ${t0} specialist. ${pick(TOPICS)} enthusiast.`,
    `Making ${pick(TOPICS)} accessible. ${t0} developer. ${pick(LOCATIONS)}.`,
    `Platform engineer @ ${pick(COMPANIES)}. ${t0} + ${t1}. ${pick(TOPICS)} advocate.`,
    `Compiler writer. ${t0} + ${t1}. ${pick(TOPICS)} researcher.`,
  ];
  return pick(templates);
}

function generateUsername(firstName: string, lastName: string, index: number): string {
  const fn = firstName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const ln = lastName.toLowerCase().replace(/[^a-z0-9]/g, "");
  const patterns = [`${fn}_${ln}`,`${fn}${ln}`,`${fn}${randInt(10,99)}`,`${fn}_dev`,`${fn}_${pick(["codes","builds","ships","hacks","crafts"])}`,`${ln}_${fn}`,`${fn}${randInt(1,999)}`,`${fn}${pick(["_io","_dev","_sh","_rs","_go"])}`];
  const base = pick(patterns).replace(/[^a-z0-9_]/g, "").slice(0, 20);
  return base || `user_${index}`;
}

function generateAvatarUrl(seed: string): string {
  const styles = ["avataaars","bottts","identicon","micah","personas","lorelei","notionists","adventurer","big-smile","croodles"];
  return `https://api.dicebear.com/7.x/${pick(styles)}/svg?seed=${encodeURIComponent(seed)}`;
}

function generatePostContent(persona: string, techStack: string[]) {
  const roll = Math.random();
  const tech = techStack[0] ?? "TypeScript";
  const tags = [tech.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0,20), persona, pick(["tips","code","architecture","opinion","engineering"])].filter(Boolean);

  if (roll < 0.3) {
    return { type: "SNIPPET" as const, title: `${tech} trick: ${pick(PROBLEMS)}`.slice(0,200), content: `Here's a ${tech} pattern I use constantly. Saves me from writing boilerplate every time.\n\nKey insight: ${pick(TIPS)}`, codeSnippet: `// ${pick(PROBLEMS)} solution\nfunction solve<T>(input: T): T {\n  // ${pick(TIPS)}\n  return input;\n}`, language: tech.toLowerCase() === "rust" ? "rust" : tech.toLowerCase() === "go" ? "go" : tech.toLowerCase() === "python" ? "python" : "typescript", tags };
  } else if (roll < 0.55) {
    const opinion = pick(OPINIONS);
    return { type: "THREAD" as const, title: `Hot take: ${opinion}`.slice(0,200), content: `Hot take: ${opinion}\n\nHere's why:\n\n1. ${pick(TIPS)}\n2. ${pick(TIPS)}\n3. ${pick(TIPS)}\n\nFight me in the comments.`, tags };
  } else if (roll < 0.75) {
    const thing = pick(THINGS);
    return { type: "DROP" as const, title: `Shipped: ${thing}`.slice(0,200), content: `Just shipped a ${pick(["fast","minimal","zero-dependency","type-safe","production-ready"])} ${thing} built with ${tech}.\n\n${pick(TIPS)}\n\nLink in bio.`, tags };
  } else {
    const problem = pick(PROBLEMS);
    return { type: "QUESTION" as const, title: `How do you handle ${problem} in ${tech}?`.slice(0,200), content: `I'm running into ${problem} in my ${tech} project.\n\nHere's what I've tried:\n- ${pick(ALTERNATIVES)}\n- ${pick(SOLUTIONS)}\n\nNone of these work well. What's the right approach?`, tags };
  }
}

function generateComment(): string {
  const templates = [`This is exactly the approach we use at work. Works great at scale.`,`Have you considered ${pick(ALTERNATIVES)}? It handles ${pick(PROBLEMS)} better.`,`Great post. I'd add that ${pick(TIPS)}.`,`We ran into the same issue. The solution was ${pick(SOLUTIONS)}.`,`This saved me hours. Thank you.`,`Bookmarked. Will try this on our next sprint.`,`The performance numbers are impressive. What's your test setup?`,`Good writeup. One thing to watch out for: ${pick(GOTCHAS)}.`,`This is the way.`,`Solid approach. We use something similar but with ${pick(ALTERNATIVES)}.`,`Interesting. We went a different direction — ${pick(SOLUTIONS)}. Both work.`,`This unlocked something for me. Thanks for sharing.`];
  return pick(templates);
}

function generateAnswer(): string {
  const answers = [`Great question. The standard approach here is to use ${pick(ALTERNATIVES)}.\n\nHere's why it works:\n\n1. ${pick(TIPS)}\n2. ${pick(TIPS)}\n\nI've used this in production for ${randInt(1,5)} years with no issues.`,`I ran into this exact problem last year. The solution that worked for us:\n\n${pick(SOLUTIONS)}\n\nKey insight: ${pick(TIPS)}`,`Short answer: ${pick(SOLUTIONS)}.\n\nLong answer: it depends on your constraints. If you're dealing with ${pick(PROBLEMS)}, you want ${pick(ALTERNATIVES)}.`,`The docs don't make this obvious, but the right approach is ${pick(ALTERNATIVES)}.\n\nWatch out for: ${pick(GOTCHAS)}.`,`We benchmarked several approaches. ${pick(ALTERNATIVES)} won by a significant margin for our use case.\n\nSetup: ${randInt(10,1000)}k req/day, p99 < ${randInt(10,100)}ms requirement.`];
  return pick(answers);
}

const REPUTATION_LEVELS = [
  { level: "NEWCOMER", score: [0, 99], weight: 0.25 },
  { level: "BUILDER", score: [100, 499], weight: 0.35 },
  { level: "HACKER", score: [500, 1999], weight: 0.25 },
  { level: "ARCHITECT", score: [2000, 9999], weight: 0.12 },
  { level: "LEGEND", score: [10000, 25000], weight: 0.03 },
];

function pickRepLevel() {
  const r = Math.random();
  let cumulative = 0;
  for (const { level, score, weight } of REPUTATION_LEVELS) {
    cumulative += weight;
    if (r <= cumulative) return { level, score: randInt(score[0], score[1]) };
  }
  return { level: "BUILDER", score: randInt(100, 499) };
}

async function main() {
  console.log("🤖 Creating 500 AI community accounts...\n");

  const BOT_COUNT = 500;
  const usedUsernames = new Set<string>();
  const createdBots: any[] = [];

  const existing = await prisma.user.findMany({ select: { username: true } });
  existing.forEach(u => usedUsernames.add(u.username));

  for (let i = 0; i < BOT_COUNT; i++) {
    const firstName = pick(FIRST_NAMES);
    const lastName = pick(LAST_NAMES);
    const persona = pick(PERSONAS);
    let username = generateUsername(firstName, lastName, i);
    let attempt = 0;
    while (usedUsernames.has(username)) { username = `${username.slice(0,18)}${attempt++}`; }
    usedUsernames.add(username);

    const email = `bot_${i}_${username.slice(0,10)}@void-bot.internal`;
    const name = `${firstName} ${lastName}`;
    const bio = generateBio(persona.persona, persona.techStack);
    const avatarUrl = generateAvatarUrl(`${username}-${i}`);
    const { level, score } = pickRepLevel();
    const daysAgo = randInt(1, 730);
    const createdAt = new Date(Date.now() - daysAgo * 86400000);

    try {
      const bot = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, username, name, bio, image: avatarUrl, isBot: true, botPersona: persona.persona, techStack: persona.techStack, openToCollaborate: Math.random() > 0.5, openToMentor: Math.random() > 0.7, openToHire: Math.random() > 0.6, createdAt, reputation: { create: { score, level: level as any } } },
      });
      createdBots.push({ ...bot, persona });
      if ((i + 1) % 100 === 0) console.log(`  ✓ ${i + 1}/500 accounts created`);
    } catch { /* skip duplicates */ }
  }

  console.log(`\n✅ ${createdBots.length} bot accounts created\n`);

  // Posts
  console.log("📝 Generating posts...");
  let postCount = 0;
  for (const bot of createdBots) {
    const numPosts = randInt(1, 3);
    for (let p = 0; p < numPosts; p++) {
      const content = generatePostContent(bot.persona.persona, bot.persona.techStack);
      const daysAgo = randInt(0, 60);
      const publishedAt = new Date(Date.now() - daysAgo * 86400000 - randInt(0, 86400000));
      try {
        const tagConnections = [];
        for (const tagName of content.tags.slice(0, 3)) {
          const slug = tagName.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 50);
          if (!slug) continue;
          const tag = await prisma.tag.upsert({ where: { slug }, create: { name: tagName, slug }, update: {} });
          tagConnections.push({ tagId: tag.id });
        }
        await prisma.post.create({ data: { type: content.type, title: content.title?.slice(0, 200), content: content.content, codeSnippet: (content as any).codeSnippet, language: (content as any).language, authorId: bot.id, publishedAt, createdAt: publishedAt, tags: { create: tagConnections } } });
        postCount++;
      } catch { /* skip */ }
    }
  }
  console.log(`✅ ${postCount} posts created\n`);

  // Reactions
  console.log("⚡ Adding reactions...");
  const allPosts = await prisma.post.findMany({ where: { authorId: { in: createdBots.map(b => b.id) } }, select: { id: true, authorId: true }, take: 600 });
  const reactionTypes = ["used_this", "saved_me_hours", "brilliant"];
  let reactionCount = 0;
  for (const post of allPosts.slice(0, 300)) {
    const reactors = createdBots.filter(b => b.id !== post.authorId).sort(() => Math.random() - 0.5).slice(0, randInt(2, 8));
    for (const reactor of reactors) {
      try { await prisma.postReaction.create({ data: { postId: post.id, userId: reactor.id, type: pick(reactionTypes) } }); reactionCount++; } catch { /* skip */ }
    }
  }
  console.log(`✅ ${reactionCount} reactions added\n`);

  // Comments
  console.log("💬 Adding comments...");
  let commentCount = 0;
  for (const post of allPosts.slice(0, 150)) {
    if (Math.random() > 0.5) continue;
    const commenter = pick(createdBots);
    if (commenter.id === post.authorId) continue;
    try { await prisma.comment.create({ data: { content: generateComment(), postId: post.id, userId: commenter.id } }); commentCount++; } catch { /* skip */ }
  }
  console.log(`✅ ${commentCount} comments added\n`);

  // Answers
  console.log("🎓 Answering questions...");
  const questions = await prisma.question.findMany({ select: { id: true, title: true, authorId: true }, take: 50 });
  let answerCount = 0;
  for (const question of questions) {
    const answerers = createdBots.filter(b => b.id !== question.authorId).sort(() => Math.random() - 0.5).slice(0, randInt(1, 3));
    for (const answerer of answerers) {
      try { await prisma.answer.create({ data: { content: generateAnswer(), questionId: question.id, authorId: answerer.id } }); answerCount++; } catch { /* skip */ }
    }
  }
  console.log(`✅ ${answerCount} answers added\n`);

  // Guild memberships
  console.log("🏰 Joining guilds...");
  const guilds = await prisma.guild.findMany({ select: { id: true } });
  let memberCount = 0;
  for (const bot of createdBots.slice(0, 300)) {
    const selectedGuilds = guilds.sort(() => Math.random() - 0.5).slice(0, randInt(1, 3));
    for (const guild of selectedGuilds) {
      try { await prisma.guildMember.create({ data: { guildId: guild.id, userId: bot.id, role: "MEMBER" } }); memberCount++; } catch { /* skip */ }
    }
  }
  console.log(`✅ ${memberCount} guild memberships\n`);

  // Follow network
  console.log("👥 Creating follow network...");
  let followCount = 0;
  const sampleBots = createdBots.slice(0, 150);
  for (const bot of sampleBots) {
    const toFollow = sampleBots.filter(b => b.id !== bot.id).sort(() => Math.random() - 0.5).slice(0, randInt(5, 25));
    for (const target of toFollow) {
      try { await prisma.follow.create({ data: { followerId: bot.id, followingId: target.id } }); followCount++; } catch { /* skip */ }
    }
  }
  console.log(`✅ ${followCount} follows created\n`);

  console.log("🎉 Bot seeding complete!");
  console.log(`   ${createdBots.length} AI accounts (⭐ labeled)`);
  console.log(`   ${postCount} posts`);
  console.log(`   ${reactionCount} reactions`);
  console.log(`   ${commentCount} comments`);
  console.log(`   ${answerCount} answers`);
  console.log(`   ${memberCount} guild memberships`);
  console.log(`   ${followCount} follows`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
