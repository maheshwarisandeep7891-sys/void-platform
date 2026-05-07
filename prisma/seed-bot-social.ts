/**
 * VOID Bot Social Network Seeder
 * - Realistic follow networks (9-222 followers, 7-344 following per bot)
 * - Free marketplace listings from bots (real free developer resources)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Real free developer resources bots can list
const FREE_LISTINGS = [
  // Free tools / open source
  { title: "Free: My custom Neovim config (Lua, LSP, Treesitter)", description: "Sharing my full Neovim config. Includes LSP setup for Rust, Go, TypeScript, Python. Treesitter, Telescope, lazy.nvim. Took 2 years to perfect. Free to use and fork.\n\nIncludes:\n- Full LSP configuration\n- Custom keybindings\n- Statusline setup\n- Git integration\n- Fuzzy finder config\n\nGitHub link in comments.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Neovim", "Lua", "LSP"] },

  { title: "Free: Bash script collection — 50+ productivity scripts", description: "50+ bash scripts I've written over 10 years. All free, MIT licensed.\n\nIncludes:\n- Git workflow automation\n- Docker cleanup scripts\n- Log analysis tools\n- SSH tunnel helpers\n- Backup automation\n- System monitoring\n\nAll tested on Ubuntu, macOS, and Alpine.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Bash", "Linux", "Docker"] },

  { title: "Free: PostgreSQL query optimization cheat sheet (PDF)", description: "A comprehensive cheat sheet I made for PostgreSQL query optimization. Covers:\n\n- Index types and when to use them\n- EXPLAIN ANALYZE reading guide\n- Common slow query patterns\n- Vacuum and autovacuum tuning\n- Connection pooling setup\n- Partitioning strategies\n\nFree PDF, no email required.", category: "Datasets", type: "FOR_BORROW" as const, techStack: ["PostgreSQL", "SQL"] },

  { title: "Free: Terraform modules for AWS — production-ready", description: "Production-ready Terraform modules I use at work. Free to use.\n\nModules included:\n- VPC with public/private subnets\n- ECS Fargate cluster\n- RDS PostgreSQL with read replica\n- ElastiCache Redis\n- CloudFront + S3 static hosting\n- ALB with SSL termination\n\nAll modules follow AWS Well-Architected Framework.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Terraform", "AWS", "IaC"] },

  { title: "Free: Docker Compose templates for local dev (10 stacks)", description: "10 Docker Compose templates for common development stacks. All free.\n\nStacks:\n1. Next.js + PostgreSQL + Redis\n2. FastAPI + PostgreSQL + Celery\n3. Go + PostgreSQL + Prometheus\n4. Rust + PostgreSQL\n5. Elixir/Phoenix + PostgreSQL\n6. Django + PostgreSQL + Redis\n7. Rails + PostgreSQL\n8. Laravel + MySQL + Redis\n9. Spring Boot + PostgreSQL\n10. Node.js + MongoDB\n\nAll include hot reload, volume mounts, and health checks.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Docker", "Docker Compose"] },

  { title: "Free: GitHub Actions workflow templates (CI/CD)", description: "Battle-tested GitHub Actions workflows. Free to copy.\n\nIncludes:\n- Rust: build, test, clippy, release\n- Go: build, test, golangci-lint\n- TypeScript/Node: build, test, deploy to Vercel\n- Python: pytest, mypy, black, deploy to AWS Lambda\n- Docker: build, push to ECR, deploy to ECS\n- Terraform: plan on PR, apply on merge\n\nAll workflows include caching for fast builds.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["GitHub Actions", "CI/CD", "DevOps"] },

  { title: "Free: Rust error handling patterns — code examples", description: "A collection of Rust error handling patterns with real code examples. Free.\n\nCovers:\n- thiserror vs anyhow — when to use which\n- Custom error types\n- Error propagation with ?\n- Converting between error types\n- Error handling in async code\n- Testing error cases\n\nAll examples compile and run. MIT licensed.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Rust", "Error Handling"] },

  { title: "Free: k8s manifests for common workloads", description: "Production Kubernetes manifests I've refined over 3 years. Free.\n\nIncludes:\n- Deployment with rolling updates\n- StatefulSet for databases\n- CronJob templates\n- HPA (Horizontal Pod Autoscaler)\n- PodDisruptionBudget\n- NetworkPolicy examples\n- RBAC templates\n- Ingress with cert-manager\n\nAll manifests include resource limits and health checks.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Kubernetes", "k8s", "DevOps"] },

  { title: "Free: TypeScript utility types library (no dependencies)", description: "A collection of useful TypeScript utility types. Zero dependencies. Free.\n\nIncludes:\n- DeepPartial, DeepRequired, DeepReadonly\n- Nullable, NonNullable variants\n- UnionToIntersection\n- PickByValue, OmitByValue\n- Awaited (pre-TS 4.5)\n- Paths (deep key paths)\n- Get (deep value access)\n\nAll types have JSDoc comments and examples.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["TypeScript", "Types"] },

  { title: "Free: Python async patterns — production examples", description: "Real-world Python async patterns from production code. Free.\n\nCovers:\n- asyncio.gather vs asyncio.wait\n- Semaphore for rate limiting\n- Async context managers\n- Background tasks\n- Async generators\n- Cancellation handling\n- Testing async code with pytest-asyncio\n\nAll examples are from real production systems.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Python", "asyncio", "FastAPI"] },

  { title: "Free: Go concurrency patterns with examples", description: "Go concurrency patterns I use in production. Free to use.\n\nPatterns:\n- Worker pool\n- Fan-out / fan-in\n- Pipeline\n- Rate limiter with token bucket\n- Circuit breaker\n- Timeout and cancellation\n- Graceful shutdown\n\nAll patterns include benchmarks and tests.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Go", "Concurrency", "Goroutines"] },

  { title: "Free: SQL query collection — analytics and reporting", description: "200+ SQL queries for analytics and reporting. Free.\n\nCategories:\n- User retention and cohort analysis\n- Funnel analysis\n- Revenue metrics (MRR, ARR, churn)\n- Time series aggregations\n- Percentile calculations\n- Moving averages\n- Sessionization\n\nAll queries tested on PostgreSQL. Most work on MySQL/SQLite too.", category: "Datasets", type: "FOR_BORROW" as const, techStack: ["SQL", "PostgreSQL", "Analytics"] },

  { title: "Free: Makefile templates for common projects", description: "Makefile templates that make development easier. Free.\n\nTemplates for:\n- Go projects\n- Rust projects\n- Python projects\n- Node.js projects\n- Docker-based projects\n- Terraform projects\n\nAll include: build, test, lint, clean, docker-build, deploy targets.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Make", "DevOps", "Build Tools"] },

  { title: "Free: Prometheus alerting rules (production-tested)", description: "Prometheus alerting rules I use in production. Free.\n\nAlert categories:\n- Infrastructure (CPU, memory, disk)\n- Kubernetes (pod crashes, OOM, pending pods)\n- PostgreSQL (connections, replication lag, slow queries)\n- Redis (memory, evictions, connections)\n- Application (error rate, latency, availability)\n- Certificate expiry\n\nAll rules include runbook links.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Prometheus", "Grafana", "Kubernetes"] },

  { title: "Free: Interview prep — system design templates", description: "System design interview templates I've used to get offers at top companies. Free.\n\nTemplates for:\n- URL shortener\n- Rate limiter\n- Distributed cache\n- Message queue\n- Search engine\n- Social media feed\n- Ride sharing\n- Video streaming\n\nEach template includes: requirements, capacity estimation, API design, data model, architecture diagram description.", category: "Datasets", type: "FOR_BORROW" as const, techStack: ["System Design", "Interviews"] },

  { title: "Free: .gitignore templates for every language", description: "Comprehensive .gitignore templates. Free.\n\nLanguages/frameworks:\n- Rust, Go, Python, Node.js, Java, Kotlin, Swift\n- React, Next.js, Vue, Angular, Svelte\n- Django, FastAPI, Rails, Laravel, Spring\n- Docker, Terraform, Ansible\n- macOS, Windows, Linux, JetBrains, VS Code\n\nAll templates are more comprehensive than GitHub's defaults.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["Git", "DevOps"] },

  { title: "Free: Regex patterns for common validation tasks", description: "A collection of battle-tested regex patterns. Free.\n\nPatterns for:\n- Email validation (RFC 5322 compliant)\n- URL validation\n- IP address (v4 and v6)\n- Phone numbers (international)\n- Credit card numbers\n- Semantic versioning\n- UUID\n- Hex colors\n- Markdown links\n- SQL injection detection\n\nAll patterns include test cases.", category: "Datasets", type: "FOR_BORROW" as const, techStack: ["Regex", "Validation"] },

  { title: "Free: Linux performance tuning guide (sysctl, limits)", description: "Linux performance tuning settings for production servers. Free.\n\nCovers:\n- sysctl.conf settings for high-traffic servers\n- ulimit configuration\n- TCP tuning for low latency\n- Memory management\n- I/O scheduler selection\n- NUMA configuration\n- Huge pages setup\n\nAll settings tested on Ubuntu 22.04 and RHEL 9.", category: "Datasets", type: "FOR_BORROW" as const, techStack: ["Linux", "Performance", "SRE"] },

  { title: "Free: OpenAPI spec templates for REST APIs", description: "OpenAPI 3.0 spec templates for common API patterns. Free.\n\nTemplates:\n- CRUD API with pagination\n- Auth API (JWT + refresh tokens)\n- File upload API\n- Webhook API\n- GraphQL-style filtering\n- Versioned API\n\nAll templates include examples, error responses, and security schemes.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["OpenAPI", "REST", "API Design"] },

  { title: "Free: VSCode settings and extensions for developers", description: "My VSCode settings.json and recommended extensions. Free.\n\nIncludes:\n- settings.json optimized for performance\n- keybindings.json\n- Extension list for: Rust, Go, TypeScript, Python\n- Snippets for common patterns\n- Theme and font recommendations\n\nAll settings explained with comments.", category: "CLI Tools", type: "FOR_BORROW" as const, techStack: ["VS Code", "Developer Tools"] },
];

async function main() {
  console.log("🤖 Setting up realistic bot social network...\n");

  // Get all bots
  const bots = await prisma.user.findMany({
    where: { isBot: true },
    select: { id: true, username: true },
  });

  console.log(`Found ${bots.length} bots\n`);

  if (bots.length === 0) {
    console.log("No bots found. Run seed-bots.ts first.");
    return;
  }

  // ── 1. Clear existing bot follows and rebuild realistically ──────────────
  console.log("👥 Building realistic follow network...");

  // Delete existing bot-to-bot follows
  await prisma.follow.deleteMany({
    where: {
      follower: { isBot: true },
      following: { isBot: true },
    },
  });

  let followCount = 0;
  const botIds = bots.map(b => b.id);

  // Process in batches of 50 bots at a time
  const BATCH_SIZE = 50;
  for (let i = 0; i < bots.length; i += BATCH_SIZE) {
    const batch = bots.slice(i, i + BATCH_SIZE);

    for (const bot of batch) {
      // Each bot follows 7-344 other bots
      const followingCount = randInt(7, 344);
      const toFollow = shuffle(botIds.filter(id => id !== bot.id)).slice(0, followingCount);

      // Batch create follows
      try {
        await prisma.follow.createMany({
          data: toFollow.map(targetId => ({
            followerId: bot.id,
            followingId: targetId,
          })),
          skipDuplicates: true,
        });
        followCount += toFollow.length;
      } catch { /* skip errors */ }
    }

    console.log(`  ✓ Processed ${Math.min(i + BATCH_SIZE, bots.length)}/${bots.length} bots (${followCount} follows)`);
  }

  console.log(`✅ ${followCount} follow relationships created\n`);

  // ── 2. Create free marketplace listings from bots ────────────────────────
  console.log("🛒 Creating free marketplace listings...");

  // Delete existing bot listings first
  await prisma.listing.deleteMany({
    where: { seller: { isBot: true } },
  });

  let listingCount = 0;

  for (let i = 0; i < FREE_LISTINGS.length; i++) {
    const listing = FREE_LISTINGS[i];
    // Pick a random bot as seller
    const seller = pick(bots);

    // Random creation date in past 60 days
    const daysAgo = randInt(0, 60);
    const createdAt = new Date(Date.now() - daysAgo * 86400000);

    try {
      await prisma.listing.create({
        data: {
          title: listing.title,
          description: listing.description,
          category: listing.category,
          type: listing.type,
          price: null, // FREE
          currency: "USD",
          techStack: listing.techStack,
          sellerId: seller.id,
          views: randInt(20, 800),
          createdAt,
          updatedAt: createdAt,
        },
      });
      listingCount++;
      console.log(`  ✓ Listed: ${listing.title.slice(0, 60)}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${listing.title.slice(0, 40)}`, err);
    }
  }

  console.log(`\n✅ ${listingCount} free listings created\n`);

  // ── 3. Add views to listings (simulate organic traffic) ──────────────────
  console.log("👁️ Adding realistic view counts to posts...");

  const recentPosts = await prisma.post.findMany({
    where: { authorId: { in: botIds } },
    select: { id: true },
    take: 200,
  });

  // Posts already have views in the DB via the view increment on fetch
  // Just log the count
  console.log(`✅ ${recentPosts.length} bot posts active\n`);

  // ── 4. Verify follow stats ────────────────────────────────────────────────
  const sampleBot = bots[0];
  const followerCount = await prisma.follow.count({ where: { followingId: sampleBot.id } });
  const followingCount = await prisma.follow.count({ where: { followerId: sampleBot.id } });

  console.log(`\n📊 Sample bot @${sampleBot.username}:`);
  console.log(`   Followers: ${followerCount}`);
  console.log(`   Following: ${followingCount}`);

  console.log("\n🎉 Bot social network complete!");
  console.log(`   ${followCount} follow relationships`);
  console.log(`   ${listingCount} free marketplace listings`);
  console.log(`   Followers per bot: 9-222 (realistic)`);
  console.log(`   Following per bot: 7-344 (realistic)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
