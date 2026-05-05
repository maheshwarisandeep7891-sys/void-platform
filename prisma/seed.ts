/**
 * VOID Platform — Database Seed
 * Creates sample data so the platform looks alive
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TECH_TAGS = ["rust", "typescript", "go", "python", "kubernetes", "webassembly", "llm", "zig", "elixir", "htmx"];

const SAMPLE_USERS = [
  { username: "rustacean", name: "Ferris Crab", bio: "Writing memory-safe code since 2015. Rust evangelist.", techStack: ["Rust", "WebAssembly", "C++"], githubUrl: "https://github.com/rustacean", repScore: 4200, repLevel: "ARCHITECT" },
  { username: "gopher_dev", name: "Go Developer", bio: "Building distributed systems. K8s contributor.", techStack: ["Go", "Kubernetes", "gRPC"], githubUrl: "https://github.com/gopher_dev", repScore: 2800, repLevel: "ARCHITECT" },
  { username: "ml_hacker", name: "ML Hacker", bio: "Training models, breaking things. CUDA wizard.", techStack: ["Python", "CUDA", "PyTorch"], githubUrl: "https://github.com/ml_hacker", repScore: 1200, repLevel: "HACKER" },
  { username: "ts_wizard", name: "TypeScript Wizard", bio: "Type-safe everything. Next.js core contributor.", techStack: ["TypeScript", "React", "Next.js"], githubUrl: "https://github.com/ts_wizard", repScore: 890, repLevel: "HACKER" },
  { username: "devops_ninja", name: "DevOps Ninja", bio: "Kubernetes, Terraform, and coffee. SRE at scale.", techStack: ["Kubernetes", "Terraform", "AWS"], githubUrl: "https://github.com/devops_ninja", repScore: 650, repLevel: "HACKER" },
  { username: "zig_builder", name: "Zig Builder", bio: "Comptime everything. Building the future of systems programming.", techStack: ["Zig", "C", "LLVM"], githubUrl: "https://github.com/zig_builder", repScore: 420, repLevel: "BUILDER" },
  { username: "elixir_alchemist", name: "Elixir Alchemist", bio: "OTP, GenServers, and distributed Erlang. Phoenix contributor.", techStack: ["Elixir", "Erlang", "Phoenix"], githubUrl: "https://github.com/elixir_alchemist", repScore: 380, repLevel: "BUILDER" },
  { username: "wasm_pioneer", name: "WASM Pioneer", bio: "WebAssembly everywhere. WASI contributor.", techStack: ["WebAssembly", "Rust", "C++"], githubUrl: "https://github.com/wasm_pioneer", repScore: 290, repLevel: "BUILDER" },
  { username: "db_architect", name: "DB Architect", bio: "PostgreSQL internals, query optimization, and distributed databases.", techStack: ["PostgreSQL", "Redis", "ClickHouse"], githubUrl: "https://github.com/db_architect", repScore: 11500, repLevel: "LEGEND" },
  { username: "kernel_hacker", name: "Kernel Hacker", bio: "Linux kernel contributor. eBPF, networking, and storage.", techStack: ["C", "Linux", "eBPF"], githubUrl: "https://github.com/kernel_hacker", repScore: 8900, repLevel: "LEGEND" },
];

const SAMPLE_POSTS = [
  {
    type: "SNIPPET" as const,
    title: "Zero-allocation JSON parser in Zig",
    content: "Just shipped a zero-allocation JSON parser in Zig. 3x faster than simd-json on my benchmarks. The trick is using a state machine with a fixed-size stack instead of heap allocation.",
    codeSnippet: `const Parser = struct {
  stack: [64]State = undefined,
  depth: usize = 0,
  
  pub fn parse(self: *Parser, input: []const u8) !Value {
    for (input) |byte| {
      try self.transition(byte);
    }
    return self.stack[0].value;
  }
};`,
    language: "zig",
    tags: ["zig", "performance", "json"],
  },
  {
    type: "THREAD" as const,
    title: "Why I rewrote our entire backend in Rust (and what I learned)",
    content: `After 18 months of running a Python/Django backend at scale, we hit a wall. 

**The problem:** 400ms p99 latency on simple CRUD operations. Memory usage was 8GB for 1000 concurrent users.

**The rewrite:** 6 months, 2 engineers, full Rust with Axum + SQLx.

**The results:**
- p99 latency: 400ms → 12ms
- Memory: 8GB → 180MB  
- Throughput: 2k req/s → 180k req/s

The hardest part wasn't the borrow checker — it was convincing the team. Here's what I wish I knew before starting...`,
    tags: ["rust", "performance", "backend"],
  },
  {
    type: "DROP" as const,
    title: "Shipped: void-ls — a language server for shell scripts",
    content: `Just open-sourced void-ls, a language server for bash/zsh/fish scripts.

Features:
- Hover documentation for all builtins
- Go-to-definition across sourced files  
- Rename refactoring for variables and functions
- Shellcheck integration for diagnostics
- Works with any LSP-compatible editor

Built with Rust + tree-sitter. 2MB binary, zero dependencies.

GitHub: https://github.com/void-ls/void-ls`,
    tags: ["rust", "lsp", "shell", "open-source"],
  },
  {
    type: "QUESTION" as const,
    title: "How do you handle distributed transactions without 2PC?",
    content: `We're building a marketplace where a purchase needs to:
1. Debit buyer's balance
2. Credit seller's balance  
3. Update inventory
4. Send notifications

All across different services. 2PC is too slow and fragile. 

We've looked at sagas but the compensating transactions are complex. What patterns are you using in production?`,
    tags: ["distributed-systems", "transactions", "architecture"],
  },
  {
    type: "SNIPPET" as const,
    title: "Async rate limiter in Go — 50 lines",
    content: "Needed a token bucket rate limiter that works across goroutines without mutexes. Here's what I came up with using atomic operations:",
    codeSnippet: `type RateLimiter struct {
  tokens    atomic.Int64
  maxTokens int64
  refillRate time.Duration
}

func (r *RateLimiter) Allow() bool {
  for {
    current := r.tokens.Load()
    if current <= 0 {
      return false
    }
    if r.tokens.CompareAndSwap(current, current-1) {
      return true
    }
  }
}

func (r *RateLimiter) refill() {
  ticker := time.NewTicker(r.refillRate)
  for range ticker.C {
    r.tokens.Store(min(r.tokens.Load()+1, r.maxTokens))
  }
}`,
    language: "go",
    tags: ["go", "concurrency", "rate-limiting"],
  },
  {
    type: "THREAD" as const,
    title: "The hidden cost of microservices nobody talks about",
    content: `Hot take: most teams adopting microservices are making their systems worse, not better.

I've consulted at 40+ companies. Here's what I see:

**What they think they're getting:**
- Independent deployability
- Technology flexibility  
- Team autonomy

**What they actually get:**
- Distributed monolith with network calls
- 3x the operational complexity
- Debugging nightmares across 20 services

The real question isn't "microservices vs monolith" — it's "what's your actual bottleneck?"

For 95% of companies under $100M ARR, a well-structured monolith with good module boundaries will outperform microservices on every metric that matters.

Fight me.`,
    tags: ["architecture", "microservices", "opinion"],
  },
  {
    type: "SNIPPET" as const,
    title: "TypeScript: Exhaustive pattern matching without libraries",
    content: "Tired of installing fp-ts just for pattern matching? Here's a 10-line implementation that gives you exhaustive checks at compile time:",
    codeSnippet: `type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

function match<T, E, R>(
  result: Result<T, E>,
  handlers: { ok: (value: T) => R; err: (error: E) => R }
): R {
  return result.ok 
    ? handlers.ok(result.value)
    : handlers.err(result.error);
}

// Usage - TypeScript enforces both cases
const message = match(fetchUser(id), {
  ok: (user) => \`Welcome, \${user.name}\`,
  err: (error) => \`Error: \${error.message}\`,
});`,
    language: "typescript",
    tags: ["typescript", "functional", "patterns"],
  },
  {
    type: "DROP" as const,
    title: "Launched: k8s-lens — visualize your cluster topology in the terminal",
    content: `Built a TUI for visualizing Kubernetes cluster topology. Think k9s but focused on network topology and resource relationships.

What it shows:
- Service mesh connections
- Pod-to-pod communication
- Resource dependencies
- Real-time metrics overlay

Written in Go with Bubble Tea. Works with any kubeconfig.

\`\`\`
brew install k8s-lens
k8s-lens --context production
\`\`\``,
    tags: ["kubernetes", "go", "tui", "devops"],
  },
];

const SAMPLE_BOUNTIES = [
  {
    title: "Fix memory leak in our Rust async runtime",
    description: `We have a memory leak in our custom async runtime built on top of tokio. Under high load (>10k concurrent connections), memory grows unboundedly.

We've narrowed it down to the task scheduler but can't find the root cause. 

**What we need:**
- Identify the root cause
- Provide a fix with tests
- Document the issue for future reference

**Reproduction:** Available in our public repo with a load test script.`,
    reward: 500,
    tags: ["rust", "async", "memory"],
  },
  {
    title: "Build a tree-sitter grammar for our DSL",
    description: `We have a custom DSL for defining data pipelines. We need a tree-sitter grammar so we can build editor tooling.

The DSL syntax is documented. We need:
- Complete tree-sitter grammar
- Syntax highlighting queries for Neovim/Helix
- Basic LSP hover support

**Bonus:** Indentation rules`,
    reward: 300,
    tags: ["tree-sitter", "dsl", "tooling"],
  },
  {
    title: "Optimize our PostgreSQL query — 10s → <100ms",
    description: `We have a reporting query that takes 10+ seconds on our production database (50M rows). 

The query involves 4 JOINs and a GROUP BY. We've tried basic indexes but haven't cracked it.

**Deliverable:** Optimized query + explanation of what you changed and why.

**Bonus:** Materialized view approach if applicable.`,
    reward: 200,
    tags: ["postgresql", "performance", "sql"],
  },
];

const SAMPLE_GUILDS = [
  { name: "Rust Guild", slug: "rust-guild", description: "For Rustaceans building systems software, WebAssembly, and everything in between.", techStack: ["Rust", "WebAssembly", "C++"] },
  { name: "ML/AI Hackers", slug: "ml-ai-hackers", description: "Training models, building inference engines, and pushing the limits of what's possible.", techStack: ["Python", "CUDA", "PyTorch", "JAX"] },
  { name: "DevOps & Platform", slug: "devops-platform", description: "Kubernetes, Terraform, observability, and the art of keeping things running.", techStack: ["Kubernetes", "Terraform", "Go", "Prometheus"] },
  { name: "TypeScript Builders", slug: "typescript-builders", description: "Type-safe everything. Full-stack TypeScript, from edge functions to databases.", techStack: ["TypeScript", "Next.js", "tRPC", "Prisma"] },
  { name: "Systems Programming", slug: "systems-programming", description: "C, C++, Zig, assembly. Building the foundations everything else runs on.", techStack: ["C", "C++", "Zig", "Assembly"] },
];

async function main() {
  console.log("🌱 Seeding VOID database...");

  // Create users
  const createdUsers = [];
  for (const userData of SAMPLE_USERS) {
    const email = `${userData.username}@void.dev`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        username: userData.username,
        name: userData.name,
        bio: userData.bio,
        techStack: userData.techStack,
        githubUrl: userData.githubUrl,
        openToCollaborate: true,
        openToHire: Math.random() > 0.5,
        openToMentor: Math.random() > 0.6,
        reputation: {
          create: {
            score: userData.repScore,
            level: userData.repLevel as any,
          },
        },
      },
    });
    createdUsers.push(user);
    console.log(`  ✓ User: @${user.username} (${userData.repLevel})`);
  }

  // Create tags
  const tagMap = new Map<string, string>();
  for (const tagName of TECH_TAGS) {
    const tag = await prisma.tag.upsert({
      where: { slug: tagName },
      update: {},
      create: { name: tagName, slug: tagName },
    });
    tagMap.set(tagName, tag.id);
  }

  // Create posts
  for (let i = 0; i < SAMPLE_POSTS.length; i++) {
    const postData = SAMPLE_POSTS[i];
    const author = createdUsers[i % createdUsers.length];
    
    const tagConnections = postData.tags
      .filter(t => tagMap.has(t))
      .map(t => ({ tagId: tagMap.get(t)! }));

    const post = await prisma.post.create({
      data: {
        type: postData.type,
        title: postData.title,
        content: postData.content,
        codeSnippet: (postData as any).codeSnippet,
        language: (postData as any).language,
        authorId: author.id,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        tags: { create: tagConnections },
      },
    });

    // Add some reactions
    for (const reactor of createdUsers.slice(0, 3)) {
      if (reactor.id !== author.id) {
        const reactionTypes = ["used_this", "saved_me_hours", "brilliant"];
        await prisma.postReaction.create({
          data: {
            postId: post.id,
            userId: reactor.id,
            type: reactionTypes[Math.floor(Math.random() * reactionTypes.length)],
          },
        }).catch(() => {}); // ignore duplicates
      }
    }

    console.log(`  ✓ Post: ${postData.title.slice(0, 50)}`);
  }

  // Create bounties
  for (const bountyData of SAMPLE_BOUNTIES) {
    const author = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    await prisma.bounty.create({
      data: {
        title: bountyData.title,
        description: bountyData.description,
        reward: bountyData.reward,
        currency: "USD",
        tags: bountyData.tags,
        authorId: author.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
    console.log(`  ✓ Bounty: $${bountyData.reward} - ${bountyData.title.slice(0, 40)}`);
  }

  // Create guilds
  for (const guildData of SAMPLE_GUILDS) {
    const admin = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    await prisma.guild.upsert({
      where: { slug: guildData.slug },
      update: {},
      create: {
        name: guildData.name,
        slug: guildData.slug,
        description: guildData.description,
        techStack: guildData.techStack,
        visibility: "PUBLIC",
        members: {
          create: {
            userId: admin.id,
            role: "ADMIN",
          },
        },
      },
    });
    console.log(`  ✓ Guild: ${guildData.name}`);
  }

  // Create follows between users
  for (let i = 0; i < createdUsers.length; i++) {
    for (let j = 0; j < createdUsers.length; j++) {
      if (i !== j && Math.random() > 0.5) {
        await prisma.follow.create({
          data: {
            followerId: createdUsers[i].id,
            followingId: createdUsers[j].id,
          },
        }).catch(() => {});
      }
    }
  }

  // Create knowledge questions and answers
  const SAMPLE_QUESTIONS = [
    {
      title: "How do you handle distributed transactions without 2PC?",
      content: `We're building a marketplace where a purchase needs to:\n1. Debit buyer's balance\n2. Credit seller's balance\n3. Update inventory\n4. Send notifications\n\nAll across different services. 2PC is too slow and fragile. What patterns are you using in production?`,
      tags: ["distributed-systems", "transactions", "architecture"],
      answers: [
        { content: "Use the Saga pattern with compensating transactions. Each step publishes an event, and if any step fails, you run compensating transactions in reverse order. Tools like Temporal make this much easier to implement correctly.", accepted: true },
        { content: "Outbox pattern + eventual consistency. Write to a local outbox table in the same transaction as your business logic, then a background worker publishes those events. This gives you at-least-once delivery without 2PC." },
      ],
    },
    {
      title: "Rust async: when to use tokio::spawn vs async blocks?",
      content: "I keep seeing both patterns in Rust async code and I'm not sure when to use which. What's the mental model for choosing between them?",
      tags: ["rust", "async", "tokio"],
      answers: [
        { content: "Use `tokio::spawn` when you want the task to run concurrently and independently — it gets its own stack and can outlive the current scope. Use async blocks (`.await`) when you want sequential execution or need to share references with the current scope. The key difference: spawned tasks must be `'static + Send`.", accepted: true },
        { content: "Think of `tokio::spawn` like `thread::spawn` — it's a new concurrent unit of work. Async blocks are just futures that you drive from the current task. If you need fire-and-forget, spawn. If you need the result inline, await." },
      ],
    },
    {
      title: "PostgreSQL: JSONB vs separate columns for semi-structured data?",
      content: "We have user metadata that varies by user type. Some fields are common, others are type-specific. Should we use JSONB or separate tables with nullable columns?",
      tags: ["postgresql", "database", "schema-design"],
      answers: [
        { content: "Separate tables with a polymorphic association pattern is almost always better for queryability and indexing. JSONB is great for truly dynamic data you don't query on, but if you're filtering/sorting by those fields, you'll regret JSONB at scale. The GIN index on JSONB is powerful but not as fast as a B-tree on a typed column.", accepted: false },
        { content: "JSONB with generated columns is a good middle ground. Store in JSONB, create generated columns for frequently-queried fields: `ALTER TABLE users ADD COLUMN user_type TEXT GENERATED ALWAYS AS (metadata->>'type') STORED;` Then index the generated column normally.", accepted: true },
      ],
    },
  ];

  for (const qData of SAMPLE_QUESTIONS) {
    const author = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const tagConnections = qData.tags
      .filter(t => tagMap.has(t))
      .map(t => ({ tagId: tagMap.get(t)! }));

    const question = await prisma.question.create({
      data: {
        title: qData.title,
        content: qData.content,
        authorId: author.id,
        views: Math.floor(Math.random() * 500) + 50,
        tags: { create: tagConnections },
      },
    });

    for (const ansData of qData.answers) {
      const answerAuthor = createdUsers.find(u => u.id !== author.id) ?? createdUsers[0];
      await prisma.answer.create({
        data: {
          content: ansData.content,
          questionId: question.id,
          authorId: answerAuthor.id,
          isAccepted: ansData.accepted,
        },
      });
    }
    console.log(`  ✓ Question: ${qData.title.slice(0, 50)}`);
  }

  // Add guild memberships for more users
  const guilds = await prisma.guild.findMany({ select: { id: true, slug: true } });
  for (const guild of guilds) {
    for (const user of createdUsers.slice(1, 4)) {
      await prisma.guildMember.create({
        data: { guildId: guild.id, userId: user.id, role: "MEMBER" },
      }).catch(() => {});
    }
  }

  // Create a hackathon room
  await prisma.hackathonRoom.create({
    data: {
      name: "48h CLI Tool Challenge",
      description: "Build a useful CLI tool in 48 hours. Any language, any problem.",
      startAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // started 2h ago
      endAt: new Date(Date.now() + 46 * 60 * 60 * 1000),  // ends in 46h
      isActive: true,
      members: {
        create: createdUsers.slice(0, 3).map((u, i) => ({
          userId: u.id,
          role: i === 0 ? "LEAD" : "MEMBER",
        })),
      },
    },
  });
  console.log("  ✓ Hackathon room created");

  // Create follows between users
  for (let i = 0; i < createdUsers.length; i++) {
    for (let j = 0; j < createdUsers.length; j++) {
      if (i !== j && Math.random() > 0.5) {
        await prisma.follow.create({
          data: {
            followerId: createdUsers[i].id,
            followingId: createdUsers[j].id,
          },
        }).catch(() => {});
      }
    }
  }

  // Create marketplace listings
  const listings = [
    { title: "Unused GitHub Copilot Business seat (3 months)", description: "Bought a team plan but one seat is unused. 3 months remaining. Full GitHub Copilot Business features.", category: "SaaS Seats", type: "FOR_SALE" as const, price: 45 },
    { title: "OpenAI API credits — $200 remaining", description: "Bought $500 in OpenAI credits for a project that got cancelled. $200 remaining, expires in 6 months.", category: "API Credits", type: "FOR_SALE" as const, price: 140 },
    { title: "JetBrains All Products Pack — 1 year", description: "Full JetBrains suite license, 1 year remaining. Includes IntelliJ, WebStorm, DataGrip, etc.", category: "Software Licenses", type: "FOR_SALE" as const, price: 120 },
    { title: "RTX 4090 GPU — rent by the hour for ML training", description: "24GB VRAM, PCIe 4.0. Available for ML training workloads. SSH access, CUDA 12.3, PyTorch pre-installed.", category: "GPU Access", type: "FOR_RENT" as const, hourlyRate: 2.5 },
    { title: "void-analytics — privacy-first analytics SaaS", description: "Fully built analytics SaaS. 50 paying customers, $800 MRR. Built with Next.js + ClickHouse. Selling to focus on other projects.", category: "Side Projects", type: "FOR_SALE" as const, price: 8000 },
  ];

  for (const listing of listings) {
    const seller = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    await prisma.listing.create({
      data: {
        title: listing.title,
        description: listing.description,
        category: listing.category,
        type: listing.type,
        price: listing.price,
        hourlyRate: listing.hourlyRate,
        currency: "USD",
        sellerId: seller.id,
        techStack: [],
        views: Math.floor(Math.random() * 200) + 10,
      },
    });
    console.log(`  ✓ Listing: ${listing.title.slice(0, 50)}`);
  }

  console.log("\n✅ Seed complete!");
  console.log(`   ${createdUsers.length} users`);
  console.log(`   ${SAMPLE_POSTS.length} posts`);
  console.log(`   ${SAMPLE_BOUNTIES.length} bounties`);
  console.log(`   ${SAMPLE_GUILDS.length} guilds`);
  console.log(`   ${listings.length} marketplace listings`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
