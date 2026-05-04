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

const STATS = [
  { label: "Builders", value: "10K+", icon: Users },
  { label: "Tools Listed", value: "2.4K+", icon: Package },
  { label: "Questions Answered", value: "18K+", icon: BookOpen },
  { label: "Bounties Paid", value: "$240K+", icon: Zap },
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
    <div className="min-h-screen bg-void-bg overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-void-border/50 bg-void-bg/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-void-purple flex items-center justify-center">
                <Code2 className="w-4 h-4 text-void-bg" />
              </div>
              <span className="text-xl font-black tracking-tighter text-void-text font-mono">
                VOID
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm" className="font-mono">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button size="sm" className="font-mono gap-1.5">
                  Join VOID
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center grid-bg pt-14">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-void-purple/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-void-cyan/5 rounded-full blur-3xl pointer-events-none" />

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
            <Badge variant="default" className="px-4 py-1.5 text-sm gap-2">
              <span className="w-2 h-2 bg-void-green rounded-full animate-pulse" />
              Now in public beta — join 10,000+ builders
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-none"
          >
            <span className="text-void-text">The internet&apos;s home</span>
            <br />
            <span className="text-gradient-purple">for people who</span>
            <br />
            <span className="text-void-text">actually build things.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-void-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Social network + marketplace + knowledge base. Built exclusively for
            developers and hackers. No engagement bait. No algorithm. Just builders.
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

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-void-border">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ label, value, icon: Icon }, i) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="p-6 h-full flex flex-col group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                      color === "purple"
                        ? "bg-void-purple/10 border border-void-purple/20"
                        : color === "cyan"
                        ? "bg-void-cyan/10 border border-void-cyan/20"
                        : "bg-void-green/10 border border-void-green/20"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        color === "purple"
                          ? "text-void-purple"
                          : color === "cyan"
                          ? "text-void-cyan"
                          : "text-void-green"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-void-text mb-2 font-mono">
                    {title}
                  </h3>
                  <p className="text-void-muted text-sm leading-relaxed mb-4 flex-1">
                    {description}
                  </p>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-xs font-mono text-void-muted"
                      >
                        <ChevronRight
                          className={`w-3 h-3 flex-shrink-0 ${
                            color === "purple"
                              ? "text-void-purple"
                              : color === "cyan"
                              ? "text-void-cyan"
                              : "text-void-green"
                          }`}
                        />
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

      {/* Dark Mode Feature Highlight */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-y border-void-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge variant="default" className="mb-4">
                🖤 Privacy Feature
              </Badge>
              <h2 className="text-4xl font-black tracking-tighter text-void-text mb-4">
                Go completely
                <br />
                <span className="text-gradient-purple">anonymous.</span>
              </h2>
              <p className="text-void-muted leading-relaxed mb-6">
                One click. Your identity disappears. You become{" "}
                <code className="text-void-purple bg-void-surface px-1.5 py-0.5 rounded text-sm">
                  ghost_0x7f
                </code>{" "}
                or some other random handle. Ask the beginner question you&apos;ve been
                afraid to ask. Post the controversial opinion. Browse without a trace.
              </p>
              <ul className="space-y-3">
                {[
                  "New random handle every session",
                  "Zero link to your real account — ever",
                  "Platform stores no connection between identities",
                  "Anonymous bounty payouts via crypto",
                  "🖤 icon so community knows it's anonymous",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-mono text-void-muted">
                    <span className="text-void-purple mt-0.5">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-xl border border-void-purple/30 bg-void-card p-6 glow-purple">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-void-border">
                  <div className="w-2 h-2 bg-void-purple rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-void-purple">
                    dark mode active
                  </span>
                  <span className="ml-auto text-xs font-mono text-void-muted">
                    ghost_0x7f
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { handle: "ghost_0x7f", text: "🖤 why does everyone act like async/await is hard? it's just callbacks with extra steps", time: "2m" },
                    { handle: "null_ptr_42", text: "🖤 hot take: most microservices architectures are just distributed monoliths with extra latency", time: "5m" },
                    { handle: "void_kernel_3f", text: "🖤 i've been writing Go for 3 years and I still don't understand when to use channels vs mutexes", time: "12m" },
                  ].map(({ handle, text, time }) => (
                    <div key={handle} className="p-3 rounded-lg bg-void-surface border border-void-border">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="w-5 h-5 rounded-full bg-void-purple/20 border border-void-purple/30 flex items-center justify-center">
                          <span className="text-[8px] text-void-purple">🖤</span>
                        </div>
                        <span className="text-xs font-mono text-void-purple">{handle}</span>
                        <span className="ml-auto text-[10px] font-mono text-void-muted">{time} ago</span>
                      </div>
                      <p className="text-xs text-void-muted leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Reputation System */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-black tracking-tighter text-void-text mb-4">
              Reputation that actually means something.
            </h2>
            <p className="text-void-muted mb-12 max-w-xl mx-auto">
              Earned through real contributions. Exportable as a signed credential.
              Portable to other platforms.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { level: "NEWCOMER", color: "#94a3b8", score: "0+" },
              { level: "BUILDER", color: "#34d399", score: "100+" },
              { level: "HACKER", color: "#38bdf8", score: "500+" },
              { level: "ARCHITECT", color: "#a78bfa", score: "2000+" },
              { level: "LEGEND", color: "#f59e0b", score: "10000+" },
            ].map(({ level, color, score }, i) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-void-border bg-void-card min-w-[120px]"
                style={{ borderColor: `${color}20` }}
              >
                <Trophy className="w-6 h-6" style={{ color }} />
                <span className="text-sm font-mono font-bold" style={{ color }}>
                  {level}
                </span>
                <span className="text-xs font-mono text-void-muted">{score} pts</span>
              </motion.div>
            ))}
          </div>
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
            <div className="w-16 h-16 rounded-2xl bg-void-purple flex items-center justify-center mx-auto mb-8 glow-purple">
              <Code2 className="w-8 h-8 text-void-bg" />
            </div>
            <h2 className="text-5xl font-black tracking-tighter text-void-text mb-4">
              Ready to build?
            </h2>
            <p className="text-void-muted text-lg mb-10">
              Join 10,000+ developers who actually ship things.
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
                <div className="w-6 h-6 rounded-md bg-void-purple flex items-center justify-center">
                  <Code2 className="w-3.5 h-3.5 text-void-bg" />
                </div>
                <span className="font-black font-mono text-void-text">VOID</span>
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

