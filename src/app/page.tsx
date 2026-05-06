"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Terminal,
  Code2,
  Store,
  BookOpen,
  Zap,
  Users,
  Shield,
  ArrowRight,
  Star,
  Package,
  Cpu,
  Globe,
  Lock,
  ChevronRight,
  Rocket,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { VoidLogo } from "@/components/ui/void-logo";

const FEATURES = [
  {
    icon: Terminal,
    title: "Social Feed",
    description:
      "Share threads, code snippets, project drops, and technical opinions. No engagement bait. No algorithm manipulation. Just builders building.",
    color: "purple",
    items: ["Markdown + code blocks", "Monaco editor", "Inline sandboxes", "Scheduled posts"],
  },
  {
    icon: Store,
    title: "Marketplace",
    description:
      "Buy, sell, rent, or trade developer tools. SaaS seats, API credits, domains, side projects, GPU access, and more.",
    color: "cyan",
    items: ["Escrow payments", "Stripe Connect", "Rental auto-expiry", "Dispute resolution"],
  },
  {
    icon: BookOpen,
    title: "Knowledge Base",
    description:
      "Stack Overflow done right. Reputation earned by quality, not speed. Version-controlled answers. Community-maintained wikis.",
    color: "green",
    items: ["Answer versioning", "\"Still works\" button", "Runnable sandboxes", "Wiki collaboration"],
  },
  {
    icon: Shield,
    title: "Dark Mode",
    description:
      "One click to go fully anonymous. Ask embarrassing questions, post controversial opinions, browse without a trace. Zero link to your real identity.",
    color: "purple",
    items: ["Random handle per session", "No history stored", "Anonymous bounty payouts", "🖤 labeled posts"],
  },
  {
    icon: Users,
    title: "Guilds & Hackathons",
    description:
      "Organize by tech stack. Rust Guild, ML Guild, DevOps Guild. Spin up hackathon rooms with shared feeds, tasks, and a ship button.",
    color: "cyan",
    items: ["Public & private guilds", "48-72h hackathon rooms", "Mentorship matching", "Co-founder board"],
  },
  {
    icon: Zap,
    title: "Bounties",
    description:
      "Post a problem with a reward. Community solves it. Escrow-backed payments. Dark mode submissions supported.",
    color: "green",
    items: ["Escrow-backed rewards", "Anonymous submissions", "Crypto payouts", "Deadline tracking"],
  },
];

// Stats are loaded dynamically from DB
const STATS_FALLBACK = [
  { label: "Builders", value: "—", icon: Users },
  { label: "Tools Listed", value: "—", icon: Package },
  { label: "Questions Answered", value: "—", icon: BookOpen },
  { label: "Bounties Paid", value: "—", icon: Zap },
];

const TECH_STACK_TAGS = [
  "Rust", "Go", "TypeScript", "Python", "Kubernetes", "WebAssembly",
  "Solidity", "Zig", "Elixir", "Haskell", "CUDA", "RISC-V",
  "Terraform", "Nix", "Gleam", "Carbon",
];

const CODE_DEMO = `// void-cli in action
$ void post "just shipped a zero-alloc JSON parser in Zig"
✓ Posted to feed [#zig #performance]

$ void search "rust async runtime"
→ 3 tools, 12 posts, 8 answers found

$ void dark
🖤 Dark mode enabled — you are ghost_0x7f
→ Your identity is completely hidden

$ void ask "how do I fix lifetime issues in async Rust?"
✓ Question posted anonymously`;

export default function LandingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -100]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [typedText, setTypedText] = useState("");
  const [currentLine, setCurrentLine] = useState(0);
  const [stats, setStats] = useState<{
    users: number; posts: number; questions: number;
    bounties: number; listings: number; guilds: number; bountyRewardsPaid: number;
  } | null>(null);

  // Fetch real stats
  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const lines = CODE_DEMO.split("\n");

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let charIndex = 0;
    let lineIndex = 0;
    let fullText = "";

    const type = () => {
      if (lineIndex >= lines.length) return;

      const currentLineText = lines[lineIndex];
      if (charIndex <= currentLineText.length) {
        fullText = lines.slice(0, lineIndex).join("\n") + (lineIndex > 0 ? "\n" : "") + currentLineText.slice(0, charIndex);
        setTypedText(fullText);
        charIndex++;
        timeout = setTimeout(type, charIndex === 1 ? 300 : 25);
      } else {
        lineIndex++;
        charIndex = 0;
        setCurrentLine(lineIndex);
        timeout = setTimeout(type, 200);
      }
    };

    timeout = setTimeout(type, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-void-bg overflow-hidden mesh-bg">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[rgba(255,255,255,0.05)] frosted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <VoidLogo size={32} variant="full" />
            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="font-mono">Sign in</Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="sm" variant="gradient" className="font-mono gap-1.5 ripple">
                  Join VOID
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-14 particle-bg">
        {/* Premium layered orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-void-purple/10 rounded-full blur-[140px]" style={{ animation: "pulse 4s ease-in-out infinite" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-void-cyan/8 rounded-full blur-[120px]" style={{ animation: "pulse 6s ease-in-out infinite", animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-void-purple/5 rounded-full blur-[180px]" />
          <div className="absolute inset-0 grid-bg opacity-40" />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="flex items-center gap-3">
              <Badge variant="default" className="px-4 py-1.5 text-sm gap-2">
                <span className="w-2 h-2 bg-void-green rounded-full animate-pulse" />
                Now in public beta
              </Badge>
              <Link href="/dark">
                <Badge variant="default" className="px-4 py-1.5 text-sm gap-2 bg-void-purple/20 border-void-purple/40 text-void-purple hover:bg-void-purple/30 transition-colors cursor-pointer">
                  🖤 Anonymous posting — try Dark Mode
                </Badge>
              </Link>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none"
          >
            <span className="text-premium">The internet&apos;s home</span>
            <br />
            <span className="text-gradient-aurora">for people who</span>
            <br />
            <span className="text-premium">actually build things.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-void-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Social network + marketplace + knowledge base. Built exclusively for
            developers. <span className="text-void-purple font-semibold">Go fully anonymous with one click.</span> No engagement bait. No algorithm. Just builders.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/auth/signin">
              <Button size="xl" className="font-mono gap-2 glow-purple">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                Sign in with GitHub
              </Button>
            </Link>
            <Link href="/feed">
              <Button size="xl" variant="outline" className="font-mono gap-2">
                <Terminal className="w-5 h-5" />
                Browse the feed
              </Button>
            </Link>
          </motion.div>

          {/* Tech stack tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto"
          >
            {TECH_STACK_TAGS.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.03 }}
                className="px-2.5 py-1 rounded-md bg-void-surface border border-void-border text-void-muted text-xs font-mono hover:border-void-purple/30 hover:text-void-text transition-colors cursor-default"
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-void-muted">scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-void-purple to-transparent"
          />
        </motion.div>
      </section>

      {/* Terminal Demo */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl border border-void-border bg-void-card overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-void-border bg-void-surface">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-xs font-mono text-void-muted">
                void-cli — terminal
              </span>
            </div>
            {/* Terminal content */}
            <div className="p-6 font-mono text-sm">
              <pre className="text-void-text whitespace-pre-wrap leading-relaxed">
                {typedText}
                <span className="animate-pulse text-void-purple">▋</span>
              </pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-6"
          >
            <code className="text-sm font-mono text-void-muted bg-void-surface border border-void-border px-3 py-1.5 rounded-lg">
              npm install -g void-cli
            </code>
          </motion.div>
        </div>
      </section>

      {/* Dark Mode — HERO FEATURE */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-void-purple/5 via-transparent to-void-purple/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-void-purple/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-void-purple/10 border border-void-purple/30 text-void-purple text-sm font-mono mb-6">
              🖤 <span className="font-bold">VOID&apos;s most unique feature</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter text-void-text mb-4">
              Ask the question you&apos;ve been
              <br />
              <span className="text-gradient-purple">afraid to ask.</span>
            </h2>
            <p className="text-void-muted text-xl max-w-2xl mx-auto">
              One click. You become <code className="text-void-purple bg-void-surface px-2 py-0.5 rounded">ghost_0x7f</code>. Zero link to your real identity. Ever.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: live demo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-void-purple/30 bg-void-card overflow-hidden shadow-2xl shadow-void-purple/10"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-void-border bg-void-surface">
                <div className="w-2 h-2 bg-void-purple rounded-full animate-pulse" />
                <span className="text-xs font-mono text-void-purple font-bold">🖤 dark mode active</span>
                <span className="ml-auto text-xs font-mono text-void-muted">ghost_0x7f</span>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { handle: "ghost_0x7f", text: "why does everyone act like async/await is hard? it's just callbacks with extra steps and I've been too scared to say this for 2 years", reactions: "⚡ 47  🧠 23", time: "2m" },
                  { handle: "null_ptr_42", text: "hot take: most microservices architectures are just distributed monoliths with extra latency and nobody wants to admit it", reactions: "⚡ 89  ⏱️ 34", time: "8m" },
                  { handle: "void_kernel_3f", text: "i've been writing Go for 3 years and I still don't understand when to use channels vs mutexes. too embarrassed to ask at work", reactions: "⚡ 156  🧠 67", time: "15m" },
                  { handle: "anon_0xdeadbeef", text: "does anyone else just copy-paste from Stack Overflow without fully understanding it and ship to prod? asking for a friend", reactions: "⚡ 312  ⏱️ 89", time: "1h" },
                ].map(({ handle, text, reactions, time }) => (
                  <div key={handle} className="p-3 rounded-xl bg-void-surface border border-void-border hover:border-void-purple/20 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full bg-void-purple/20 border border-void-purple/30 flex items-center justify-center text-[10px]">🖤</div>
                      <span className="text-xs font-mono text-void-purple font-bold">{handle}</span>
                      <span className="ml-auto text-[10px] font-mono text-void-muted">{time} ago</span>
                    </div>
                    <p className="text-xs text-void-muted leading-relaxed mb-2">{text}</p>
                    <p className="text-[10px] font-mono text-void-muted/60">{reactions}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: feature list */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                {
                  emoji: "🎭",
                  title: "New random handle every session",
                  desc: "ghost_0x7f, null_ptr_42, void_kernel_3f — generated fresh each time. No pattern, no history.",
                },
                {
                  emoji: "🔒",
                  title: "Zero identity link — cryptographically",
                  desc: "The platform stores no connection between your real account and dark mode sessions. Not even we can trace it.",
                },
                {
                  emoji: "💬",
                  title: "Ask anything without reputation damage",
                  desc: "Beginner questions, controversial opinions, embarrassing mistakes. Your real reputation stays clean.",
                },
                {
                  emoji: "🌑",
                  title: "Full platform access anonymously",
                  desc: "Post, ask questions, submit bounties, browse — all without revealing who you are.",
                },
                {
                  emoji: "⌨️",
                  title: "One keyboard shortcut",
                  desc: "⌘⇧D from anywhere in the app. Instant toggle. No menus, no friction.",
                },
              ].map(({ emoji, title, desc }) => (
                <div key={title} className="flex gap-4 p-4 rounded-xl border border-void-border bg-void-card hover:border-void-purple/20 transition-colors">
                  <span className="text-2xl flex-shrink-0">{emoji}</span>
                  <div>
                    <h3 className="text-sm font-mono font-bold text-void-text mb-1">{title}</h3>
                    <p className="text-xs text-void-muted leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}

              <Link href="/dark" className="block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 px-6 rounded-xl bg-void-purple text-void-bg font-mono font-bold text-center text-sm flex items-center justify-center gap-2 glow-purple cursor-pointer"
                >
                  🖤 Try Dark Mode now — it&apos;s free
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats — real DB numbers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-void-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: "Builders", value: stats ? (stats.users > 0 ? stats.users.toLocaleString() : "Be first") : "…", icon: Users },
            { label: "Tools Listed", value: stats ? (stats.listings > 0 ? stats.listings.toLocaleString() : "List yours") : "…", icon: Package },
            { label: "Questions Answered", value: stats ? (stats.questions > 0 ? stats.questions.toLocaleString() : "Ask first") : "…", icon: BookOpen },
            { label: "Guilds", value: stats ? (stats.guilds > 0 ? stats.guilds.toLocaleString() : "Create one") : "…", icon: Users },
          ].map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <Icon className="w-6 h-6 text-void-purple mx-auto mb-3" />
              <div className="text-3xl font-black font-mono text-void-text tabular-nums">
                {value}
              </div>
              <div className="text-sm font-mono text-void-muted mt-1">{label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-void-text mb-4">
              Everything a builder needs.
              <br />
              <span className="text-gradient-purple">Nothing they don&apos;t.</span>
            </h2>
            <p className="text-void-muted text-lg max-w-2xl mx-auto">
              We rebuilt the tools developers actually use — from scratch, better.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, color, items }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card
                  hover
                  gradient
                  className="p-6 h-full flex flex-col group border-void-border/60"
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${
                      color === "purple"
                        ? "bg-void-purple/12 border border-void-purple/20 shadow-[0_0_16px_rgba(139,92,246,0.15)]"
                        : color === "cyan"
                        ? "bg-void-cyan/10 border border-void-cyan/20 shadow-[0_0_16px_rgba(6,182,212,0.12)]"
                        : "bg-void-green/10 border border-void-green/20 shadow-[0_0_16px_rgba(16,185,129,0.12)]"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        color === "purple" ? "text-[#a78bfa]"
                        : color === "cyan" ? "text-void-cyan"
                        : "text-void-green"
                      }`}
                    />
                  </div>
                  <h3 className="text-base font-bold text-void-text mb-2 font-mono group-hover:text-void-purple transition-colors">
                    {title}
                  </h3>
                  <p className="text-void-muted text-sm leading-relaxed mb-4 flex-1">
                    {description}
                  </p>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-xs font-mono text-void-muted">
                        <ChevronRight className={`w-3 h-3 flex-shrink-0 ${
                          color === "purple" ? "text-[#a78bfa]"
                          : color === "cyan" ? "text-void-cyan"
                          : "text-void-green"
                        }`} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reputation System */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-void-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-black tracking-tighter text-void-text mb-4">
              Reputation that actually means something.
            </h2>
            <p className="text-void-muted mb-4 max-w-xl mx-auto">
              Earned through real contributions. Exportable as a signed credential.
              Portable to other platforms.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-void-green/10 border border-void-green/30 text-void-green text-xs font-mono">
              <Trophy className="w-3.5 h-3.5" />
              Export your VOID reputation as a verifiable JSON credential — use it on your resume, GitHub, LinkedIn
            </div>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { level: "NEWCOMER", color: "#94a3b8", score: "0+", desc: "Just joined" },
              { level: "BUILDER", color: "#34d399", score: "100+", desc: "Shipping things" },
              { level: "HACKER", color: "#38bdf8", score: "500+", desc: "Deep in the stack" },
              { level: "ARCHITECT", color: "#a78bfa", score: "2000+", desc: "Designing systems" },
              { level: "LEGEND", color: "#f59e0b", score: "10000+", desc: "Community pillar" },
            ].map(({ level, color, score, desc }, i) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 p-5 rounded-xl border bg-void-card min-w-[130px]"
                style={{ borderColor: `${color}25`, backgroundColor: `${color}05` }}
              >
                <Trophy className="w-6 h-6" style={{ color }} />
                <span className="text-sm font-mono font-bold" style={{ color }}>{level}</span>
                <span className="text-xs font-mono text-void-muted">{score} pts</span>
                <span className="text-[10px] font-mono text-void-muted/60">{desc}</span>
              </motion.div>
            ))}
          </div>

          {/* Credential preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-lg mx-auto rounded-xl border border-void-green/20 bg-void-card overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-void-border bg-void-surface">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              </div>
              <span className="text-[10px] font-mono text-void-muted">void-reputation-credential.json</span>
            </div>
            <pre className="p-4 text-xs font-mono text-void-green/80 leading-relaxed overflow-x-auto">
{`{
  "@context": "https://void.dev/credentials/v1",
  "type": "VoidReputationCredential",
  "issuer": "https://void.dev",
  "credentialSubject": {
    "platform": "VOID",
    "username": "your_handle",
    "score": 2847,
    "level": "ARCHITECT",
    "memberSince": "2026-01-01T00:00:00Z"
  }
}`}
            </pre>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-void-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 glow-purple">
              <VoidLogo size={48} animated />
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-void-text mb-4">
              Ready to build?
            </h2>
            <p className="text-void-muted text-lg mb-10">
              Join developers who actually ship things.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signin">
                <Button size="xl" className="font-mono gap-2 glow-purple">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  Sign in with GitHub
                </Button>
              </Link>
              <Link href="/cli">
                <Button size="xl" variant="outline" className="font-mono gap-2">
                  <Terminal className="w-5 h-5" />
                  Install CLI
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-void-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <VoidLogo size={24} variant="full" />
              </div>
              <p className="text-xs font-mono text-void-muted leading-relaxed">
                The internet&apos;s home for people who actually build things.
              </p>
            </div>
            {[
              {
                title: "Platform",
                links: ["Feed", "Marketplace", "Knowledge", "Bounties", "Guilds"],
              },
              {
                title: "Developers",
                links: ["CLI Tool", "API Docs", "Webhooks", "Status"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Privacy", "Terms"],
              },
            ].map(({ title, links }) => (
              <div key={title}>
                <h4 className="text-xs font-mono font-bold text-void-text uppercase tracking-wider mb-4">
                  {title}
                </h4>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link}>
                      <Link
                        href={`/${link.toLowerCase().replace(" ", "-")}`}
                        className="text-xs font-mono text-void-muted hover:text-void-text transition-colors"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-void-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs font-mono text-void-muted">
              © 2026 VOID Platform. Built by builders, for builders.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://github.com" className="text-void-muted hover:text-void-text transition-colors">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </Link>
              <span className="text-xs font-mono text-void-muted">
                v1.0.0-beta
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

