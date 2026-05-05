/**
 * VOID Bot Content Engine
 * Generates realistic developer content for AI community accounts
 */

export const BOT_PERSONAS = [
  // Systems / Low-level
  { persona: "systems", techStack: ["Rust", "C++", "WebAssembly", "LLVM"], topics: ["memory safety", "zero-cost abstractions", "compiler internals", "performance"] },
  { persona: "kernel", techStack: ["C", "Linux", "eBPF", "Assembly"], topics: ["kernel modules", "networking stack", "storage drivers", "eBPF programs"] },
  { persona: "embedded", techStack: ["Rust", "C", "RTOS", "ARM"], topics: ["bare metal", "interrupt handlers", "UART", "SPI", "I2C"] },
  // Web / Frontend
  { persona: "frontend", techStack: ["TypeScript", "React", "Next.js", "CSS"], topics: ["performance", "accessibility", "animations", "state management"] },
  { persona: "fullstack", techStack: ["TypeScript", "Node.js", "PostgreSQL", "Redis"], topics: ["API design", "caching", "auth", "deployment"] },
  { persona: "webperf", techStack: ["JavaScript", "WebAssembly", "V8", "Chrome"], topics: ["bundle size", "Core Web Vitals", "lazy loading", "profiling"] },
  // Backend / Infra
  { persona: "distributed", techStack: ["Go", "gRPC", "Kafka", "Kubernetes"], topics: ["consensus", "distributed transactions", "service mesh", "observability"] },
  { persona: "devops", techStack: ["Kubernetes", "Terraform", "Prometheus", "Go"], topics: ["GitOps", "SLOs", "incident response", "cost optimization"] },
  { persona: "database", techStack: ["PostgreSQL", "Redis", "ClickHouse", "SQLite"], topics: ["query optimization", "indexing", "replication", "MVCC"] },
  // ML / AI
  { persona: "ml", techStack: ["Python", "PyTorch", "CUDA", "JAX"], topics: ["training loops", "gradient descent", "attention mechanisms", "quantization"] },
  { persona: "mlops", techStack: ["Python", "Kubernetes", "Ray", "MLflow"], topics: ["model serving", "feature stores", "A/B testing", "drift detection"] },
  // Languages
  { persona: "functional", techStack: ["Haskell", "Elixir", "OCaml", "F#"], topics: ["monads", "type theory", "pattern matching", "immutability"] },
  { persona: "golang", techStack: ["Go", "gRPC", "Docker", "PostgreSQL"], topics: ["goroutines", "channels", "interfaces", "testing"] },
  { persona: "python", techStack: ["Python", "FastAPI", "SQLAlchemy", "Celery"], topics: ["async", "type hints", "decorators", "packaging"] },
  // Security
  { persona: "security", techStack: ["Rust", "Python", "C", "Assembly"], topics: ["memory safety", "fuzzing", "CVEs", "exploit mitigations"] },
  // Cloud
  { persona: "cloud", techStack: ["AWS", "Terraform", "Go", "Python"], topics: ["serverless", "cost optimization", "multi-region", "IAM"] },
];

export const FIRST_NAMES = [
  "Alex", "Jordan", "Sam", "Casey", "Morgan", "Riley", "Taylor", "Quinn",
  "Avery", "Blake", "Cameron", "Dakota", "Emery", "Finley", "Gray", "Harper",
  "Indigo", "Jamie", "Kai", "Lane", "Micah", "Noel", "Oakley", "Parker",
  "Reese", "Sage", "Skyler", "Tatum", "Uma", "Val", "Winter", "Xen",
  "Yael", "Zion", "Ari", "Bex", "Cleo", "Drew", "Eli", "Fern",
  "Glen", "Haze", "Ira", "Jude", "Kit", "Lev", "Max", "Nico",
  "Orion", "Pax", "Remy", "Sol", "Theo", "Uri", "Vex", "Wren",
  "Xander", "Yuki", "Zara", "Ace", "Bay", "Cruz", "Dex", "Echo",
  "Flux", "Gale", "Hex", "Iris", "Jax", "Knox", "Lux", "Mox",
  "Nyx", "Onyx", "Pix", "Rex", "Six", "Tux", "Vox", "Wax",
];

export const LAST_NAMES = [
  "Chen", "Kim", "Patel", "Singh", "Wang", "Liu", "Zhang", "Kumar",
  "Müller", "Schmidt", "Weber", "Fischer", "Meyer", "Wagner", "Becker",
  "Hoffman", "Schulz", "Koch", "Bauer", "Richter", "Klein", "Wolf",
  "Schröder", "Neumann", "Schwarz", "Zimmermann", "Braun", "Krüger",
  "Hartmann", "Lange", "Schmitt", "Werner", "Schmitz", "Krause",
  "Meier", "Lehmann", "Schmid", "Schulze", "Maier", "Köhler",
  "Herrmann", "König", "Walter", "Mayer", "Huber", "Kaiser",
  "Fuchs", "Peters", "Lang", "Scholz", "Möller", "Weiß", "Jung",
  "Hahn", "Schubert", "Vogel", "Friedrich", "Berg", "Winkler",
  "Roth", "Beckmann", "Lorenz", "Baumann", "Franke", "Albrecht",
];

export const BIO_TEMPLATES = [
  "Building {thing} with {tech}. {years} years in the industry. Open source contributor.",
  "{tech} developer. Currently working on {thing}. Previously at {company}.",
  "Obsessed with {topic}. Writing about {tech} and {topic2}. {location}.",
  "Staff engineer @ {company}. {tech} + {tech2}. Building in public.",
  "I make computers go fast. {tech} enthusiast. {years}y exp.",
  "Open source {tech} developer. Contributor to {project}. {location}.",
  "Building the future with {tech}. {topic} nerd. {years} years shipping code.",
  "{tech} + {tech2} + coffee. Working on {thing}. {location}.",
  "Senior {persona} engineer. {tech} by day, {tech2} by night.",
  "Indie hacker. {thing} builder. {tech} stack. {location}.",
  "ex-{company}. Now building {thing}. {tech} + {tech2}.",
  "{years}y software engineer. {tech} specialist. {topic} enthusiast.",
  "Making {topic} accessible. {tech} developer. {location}.",
  "Compiler writer. {tech} + {tech2}. {topic} researcher.",
  "Platform engineer @ {company}. {tech} + {tech2}. {topic} advocate.",
];

const THINGS = ["distributed systems", "developer tools", "compilers", "databases", "CLI tools", "language servers", "observability platforms", "ML pipelines", "edge runtimes", "build systems"];
const COMPANIES = ["Stripe", "Cloudflare", "Vercel", "Linear", "Figma", "Notion", "Supabase", "PlanetScale", "Fly.io", "Railway", "Render", "Turso", "Neon", "Upstash"];
const LOCATIONS = ["Berlin", "San Francisco", "London", "Amsterdam", "Toronto", "Singapore", "Tokyo", "Sydney", "Stockholm", "Zurich", "Remote"];
const PROJECTS = ["tokio", "axum", "Next.js", "Prisma", "tRPC", "Bun", "Deno", "esbuild", "Vite", "Turbopack", "Biome", "Oxc"];
const TOPICS = ["performance", "developer experience", "type safety", "observability", "reliability", "security", "accessibility", "open source"];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateBio(persona: string, tech: string[]): string {
  const template = pick(BIO_TEMPLATES);
  return template
    .replace("{thing}", pick(THINGS))
    .replace("{tech}", tech[0] ?? "Rust")
    .replace("{tech2}", tech[1] ?? "Go")
    .replace("{years}", String(randInt(3, 15)))
    .replace("{company}", pick(COMPANIES))
    .replace("{topic}", pick(TOPICS))
    .replace("{topic2}", pick(TOPICS))
    .replace("{location}", pick(LOCATIONS))
    .replace("{project}", pick(PROJECTS))
    .replace("{persona}", persona);
}

export function generateUsername(firstName: string, lastName: string, index: number): string {
  const patterns = [
    `${firstName.toLowerCase()}_${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`,
    `${firstName.toLowerCase()}${randInt(10, 99)}`,
    `${firstName.toLowerCase()}_dev`,
    `${firstName.toLowerCase()}_${pick(["codes", "builds", "ships", "hacks", "crafts"])}`,
    `${lastName.toLowerCase()}_${firstName.toLowerCase()}`,
    `_${firstName.toLowerCase()}${randInt(1, 999)}`,
    `${firstName.toLowerCase()}${pick(["_io", "_dev", "_sh", "_rs", "_go"])}`,
  ];
  const base = pick(patterns).replace(/[^a-z0-9_]/g, "").slice(0, 20);
  return base || `user_${index}`;
}

// Avatar using DiceBear API (free, no key needed)
export function generateAvatarUrl(seed: string): string {
  const styles = ["avataaars", "bottts", "identicon", "micah", "personas"];
  const style = pick(styles);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0a0a0f,111118,13131a`;
}

// ─── POST CONTENT TEMPLATES ───────────────────────────────────────────────────

const THREAD_TEMPLATES = [
  {
    title: "Hot take: {opinion}",
    content: `Hot take: {opinion}\n\nHere's why I think this:\n\n{reason1}\n\n{reason2}\n\nFight me in the comments.`,
  },
  {
    title: "TIL: {fact}",
    content: `TIL that {fact}.\n\nI've been doing {wrongthing} for {years} years and just discovered this. Mind blown.\n\n{detail}`,
  },
  {
    title: "After {years} years of {tech}, here's what I wish I knew",
    content: `After {years} years of writing {tech}, here's what I wish someone had told me:\n\n1. {tip1}\n2. {tip2}\n3. {tip3}\n\nWhat would you add?`,
  },
  {
    title: "We rewrote {thing} in {tech} — here's what happened",
    content: `We rewrote our {thing} in {tech}. Here's the honest breakdown:\n\n**Before:** {before}\n**After:** {after}\n\nWas it worth it? {verdict}`,
  },
  {
    title: "The {tech} pattern nobody talks about",
    content: `There's a {tech} pattern I've been using for {years} years that almost nobody talks about.\n\nIt's called {pattern}.\n\n{explanation}\n\nHere's when to use it: {usecase}`,
  },
];

const SNIPPET_TEMPLATES = [
  {
    title: "{tech} trick: {description}",
    content: "Here's a {tech} pattern I use constantly. Saves me from writing {lines} lines of boilerplate every time.",
    language: "typescript",
    code: `// {description}
function {funcName}<T extends {constraint}>(
  input: T,
  transform: (value: T) => T
): T {
  return transform(input);
}

// Usage
const result = {funcName}(data, (v) => ({
  ...v,
  processed: true,
}));`,
  },
  {
    title: "Minimal {tech} {thing} — {lines} lines",
    content: "Needed a {thing} for a project. Couldn't find one that wasn't 50MB. Wrote my own in {lines} lines.",
    language: "rust",
    code: `use std::sync::atomic::{AtomicU64, Ordering};

pub struct {StructName} {
    counter: AtomicU64,
    limit: u64,
}

impl {StructName} {
    pub fn new(limit: u64) -> Self {
        Self { counter: AtomicU64::new(0), limit }
    }

    pub fn allow(&self) -> bool {
        let current = self.counter.fetch_add(1, Ordering::Relaxed);
        current < self.limit
    }
}`,
  },
  {
    title: "{tech} one-liner that replaced 30 lines",
    content: "Replaced 30 lines of imperative code with this. My team thought I was showing off. I was.",
    language: "python",
    code: `# Before: 30 lines of nested loops
# After:
result = {
    key: [transform(v) for v in values if predicate(v)]
    for key, values in data.items()
    if values
}`,
  },
];

const DROP_TEMPLATES = [
  "Just shipped {thing}. {description}. Built with {tech}. Link in bio.",
  "Open sourced {thing} today. {description}. {stars} stars on GitHub in {hours}h. Didn't expect that.",
  "v{version} of {thing} is out. {feature1}, {feature2}, and {feature3}. Changelog in comments.",
  "Shipped {thing} after {months} months of building. {description}. Finally.",
  "Side project → real product. {thing} just hit {milestone}. {description}.",
];

const QUESTION_TEMPLATES = [
  {
    title: "How do you handle {problem} in {tech}?",
    content: `I'm running into {problem} in my {tech} project.\n\nHere's what I've tried:\n- {attempt1}\n- {attempt2}\n\nNone of these work well. What's the right approach?`,
  },
  {
    title: "Best practices for {topic} in {year}?",
    content: `What are the current best practices for {topic}?\n\nI've read the docs but they're outdated. Looking for real-world experience.\n\nContext: {context}`,
  },
  {
    title: "{tech} vs {tech2} for {usecase} — which would you choose?",
    content: `Trying to decide between {tech} and {tech2} for {usecase}.\n\nMy constraints:\n- {constraint1}\n- {constraint2}\n\nWhat would you pick and why?`,
  },
];

const OPINIONS = [
  "most ORMs are a mistake at scale",
  "microservices are overused by 90% of teams",
  "TypeScript strict mode should be the default",
  "Rust is the right choice for most new systems software",
  "GraphQL is only worth it above a certain team size",
  "most databases are used wrong",
  "the best code is no code",
  "documentation is more important than tests",
  "monorepos solve more problems than they create",
  "most performance problems are database problems",
  "async/await was a mistake in JavaScript",
  "Go's error handling is actually good",
  "Kubernetes is too complex for most use cases",
  "the best architecture is the one your team understands",
  "premature optimization is still the root of most evil",
];

const TIPS = [
  "Read the source code, not just the docs",
  "Profile before optimizing",
  "Write the test first, even if you delete it later",
  "Name things what they are, not what they do",
  "The simplest solution is usually the right one",
  "Understand your data access patterns before choosing a database",
  "Logs are more valuable than metrics for debugging",
  "Every abstraction has a cost",
  "Boring technology is usually the right choice",
  "The best refactor is the one you don't need to do",
];

const TECH_NAMES = ["Rust", "Go", "TypeScript", "Python", "Elixir", "Zig", "Haskell", "OCaml", "C++", "Kotlin"];
const PROBLEMS = ["memory leaks", "race conditions", "N+1 queries", "deadlocks", "cache invalidation", "distributed transactions", "schema migrations", "dependency injection", "error handling", "concurrency"];
const PATTERNS = ["the typestate pattern", "the newtype pattern", "the builder pattern", "the command pattern", "the saga pattern", "the outbox pattern", "the circuit breaker", "the bulkhead pattern"];

export function generatePostContent(persona: string, techStack: string[]): {
  type: "THREAD" | "SNIPPET" | "DROP" | "QUESTION";
  title: string;
  content: string;
  codeSnippet?: string;
  language?: string;
  tags: string[];
} {
  const roll = Math.random();
  const tech = techStack[0] ?? pick(TECH_NAMES);
  const tech2 = techStack[1] ?? pick(TECH_NAMES);

  if (roll < 0.3) {
    // SNIPPET
    const template = pick(SNIPPET_TEMPLATES);
    const funcName = `process${pick(["Data", "Input", "Value", "Result", "Item"])}`;
    const structName = `${pick(["Rate", "Token", "Request", "Event"])}Limiter`;
    return {
      type: "SNIPPET",
      title: template.title.replace("{tech}", tech).replace("{description}", pick(PROBLEMS)).replace("{lines}", String(randInt(10, 50))).replace("{thing}", pick(THINGS)),
      content: template.content.replace("{tech}", tech).replace("{thing}", pick(THINGS)).replace("{lines}", String(randInt(10, 50))),
      codeSnippet: template.code
        .replace(/{funcName}/g, funcName)
        .replace(/{StructName}/g, structName)
        .replace("{constraint}", "Record<string, unknown>")
        .replace("{description}", pick(PROBLEMS)),
      language: template.language,
      tags: [tech.toLowerCase().replace(/[^a-z0-9]/g, ""), pick(["performance", "patterns", "tips", "code"]), persona],
    };
  } else if (roll < 0.55) {
    // THREAD
    const template = pick(THREAD_TEMPLATES);
    const opinion = pick(OPINIONS);
    const tip1 = pick(TIPS);
    const tip2 = pick(TIPS);
    const tip3 = pick(TIPS);
    return {
      type: "THREAD",
      title: template.title
        .replace("{opinion}", opinion)
        .replace("{tech}", tech)
        .replace("{thing}", pick(THINGS))
        .replace("{years}", String(randInt(3, 12))),
      content: template.content
        .replace("{opinion}", opinion)
        .replace("{reason1}", `**${tip1}**`)
        .replace("{reason2}", `**${tip2}**`)
        .replace("{tech}", tech)
        .replace("{thing}", pick(THINGS))
        .replace("{years}", String(randInt(3, 12)))
        .replace("{tip1}", tip1)
        .replace("{tip2}", tip2)
        .replace("{tip3}", tip3)
        .replace("{before}", `p99 latency: ${randInt(200, 800)}ms`)
        .replace("{after}", `p99 latency: ${randInt(5, 50)}ms`)
        .replace("{verdict}", "Absolutely. Would do it again.")
        .replace("{pattern}", pick(PATTERNS))
        .replace("{explanation}", `It's a way to encode state in the type system so invalid states are unrepresentable.`)
        .replace("{usecase}", `when you have complex state machines`),
      tags: [tech.toLowerCase().replace(/[^a-z0-9]/g, ""), pick(["architecture", "opinion", "tips", "engineering"]), persona],
    };
  } else if (roll < 0.75) {
    // DROP
    const dropTemplate = pick(DROP_TEMPLATES);
    const thing = pick(THINGS);
    return {
      type: "DROP",
      title: `Shipped: ${thing}`,
      content: dropTemplate
        .replace("{thing}", thing)
        .replace("{description}", `A ${pick(["fast", "minimal", "zero-dependency", "type-safe", "production-ready"])} ${thing} built with ${tech}`)
        .replace("{tech}", tech)
        .replace("{stars}", String(randInt(50, 2000)))
        .replace("{hours}", String(randInt(2, 48)))
        .replace("{version}", `${randInt(1, 3)}.${randInt(0, 9)}.${randInt(0, 9)}`)
        .replace("{feature1}", pick(TIPS))
        .replace("{feature2}", pick(TIPS))
        .replace("{feature3}", pick(TIPS))
        .replace("{months}", String(randInt(2, 18)))
        .replace("{milestone}", `${randInt(100, 10000)} users`)
        .replace("{milestone}", `${randInt(100, 10000)} users`),
      tags: [tech.toLowerCase().replace(/[^a-z0-9]/g, ""), "open-source", "shipped", persona],
    };
  } else {
    // QUESTION
    const template = pick(QUESTION_TEMPLATES);
    const problem = pick(PROBLEMS);
    return {
      type: "QUESTION",
      title: template.title
        .replace("{problem}", problem)
        .replace("{tech}", tech)
        .replace("{topic}", pick(TOPICS))
        .replace("{year}", "2026")
        .replace("{tech2}", tech2)
        .replace("{usecase}", pick(THINGS)),
      content: template.content
        .replace("{problem}", problem)
        .replace("{tech}", tech)
        .replace("{attempt1}", `Using ${pick(["mutex locks", "atomic operations", "message passing", "event sourcing"])}`)
        .replace("{attempt2}", `Switching to ${pick(["async/await", "channels", "actors", "CSP"])}`)
        .replace("{topic}", pick(TOPICS))
        .replace("{context}", `Production system, ${randInt(10, 1000)}k req/day`)
        .replace("{tech2}", tech2)
        .replace("{usecase}", pick(THINGS))
        .replace("{constraint1}", `Must handle ${randInt(1, 100)}k concurrent connections`)
        .replace("{constraint2}", `p99 latency < ${randInt(10, 100)}ms`),
      tags: [tech.toLowerCase().replace(/[^a-z0-9]/g, ""), pick(["help", "question", "architecture"]), persona],
    };
  }
}

export const COMMENT_TEMPLATES = [
  "This is exactly the approach we use at work. Works great at scale.",
  "Have you considered {alternative}? It handles {edge_case} better.",
  "Great post. I'd add that {addition}.",
  "We ran into the same issue. The solution was {solution}.",
  "Interesting take. I disagree on {point} — in my experience {counter}.",
  "This saved me hours. Thank you.",
  "The {tech} docs actually cover this in the advanced section. Worth reading.",
  "I've been doing this wrong for years. Switching today.",
  "What's your take on {alternative} for this use case?",
  "Solid approach. We use something similar but with {variation}.",
  "This is the way.",
  "Bookmarked. Will try this on our next sprint.",
  "The performance numbers are impressive. What's your test setup?",
  "We had a similar problem. Ended up going with {solution} instead.",
  "Good writeup. One thing to watch out for: {gotcha}.",
];

const ALTERNATIVES = ["the actor model", "event sourcing", "CQRS", "the saga pattern", "optimistic locking", "CRDTs", "append-only logs"];
const SOLUTIONS = ["switching to connection pooling", "adding a read replica", "using a message queue", "implementing backpressure", "adding circuit breakers"];
const GOTCHAS = ["this doesn't work well under high contention", "memory usage can spike under load", "the error messages are cryptic", "it breaks with certain edge cases"];

export function generateComment(postContent: string): string {
  const template = pick(COMMENT_TEMPLATES);
  return template
    .replace("{alternative}", pick(ALTERNATIVES))
    .replace("{edge_case}", pick(PROBLEMS))
    .replace("{addition}", pick(TIPS))
    .replace("{solution}", pick(SOLUTIONS))
    .replace("{point}", pick(OPINIONS).split(" ").slice(0, 3).join(" "))
    .replace("{counter}", pick(TIPS))
    .replace("{tech}", pick(TECH_NAMES))
    .replace("{variation}", pick(ALTERNATIVES))
    .replace("{gotcha}", pick(GOTCHAS));
}

export function generateQuestionAnswer(questionTitle: string): string {
  const answers = [
    `Great question. The standard approach here is to use ${pick(ALTERNATIVES)}.\n\nHere's why it works:\n\n1. ${pick(TIPS)}\n2. ${pick(TIPS)}\n\nI've used this in production for ${randInt(1, 5)} years with no issues.`,
    `I ran into this exact problem last year. The solution that worked for us:\n\n${pick(SOLUTIONS)}\n\nKey insight: ${pick(TIPS)}`,
    `Short answer: ${pick(SOLUTIONS)}.\n\nLong answer: it depends on your constraints. If you're dealing with ${pick(PROBLEMS)}, you want ${pick(ALTERNATIVES)}. Otherwise, ${pick(SOLUTIONS)} is simpler.`,
    `The docs don't make this obvious, but the right approach is ${pick(ALTERNATIVES)}.\n\nWatch out for: ${pick(GOTCHAS)}.`,
    `We benchmarked several approaches. ${pick(ALTERNATIVES)} won by a significant margin for our use case.\n\nSetup: ${randInt(10, 1000)}k req/day, p99 < ${randInt(10, 100)}ms requirement.`,
  ];
  return pick(answers);
}
