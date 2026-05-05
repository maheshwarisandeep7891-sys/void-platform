"use client";

import React from "react";
import { motion } from "framer-motion";
import { Terminal, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const COMMANDS = [
  {
    cmd: "void login",
    description: "Sign in to VOID (opens browser)",
    example: null,
  },
  {
    cmd: 'void post "just shipped a zero-alloc JSON parser in Zig"',
    description: "Post to the feed",
    example: '✓ Posted to feed [#zig]\n  URL: https://void.dev/post/abc123',
  },
  {
    cmd: "void search rust async runtime",
    description: "Search posts, tools, people, and knowledge",
    example: '  Posts\n  → Async Rust patterns (thread)\n  → Building a runtime from scratch (snippet)\n\n  Marketplace\n  → Tokio consulting session [$150/hr]',
  },
  {
    cmd: 'void ask "how do I fix lifetime issues in async Rust?"',
    description: "Ask a question on the knowledge base",
    example: '✓ Question posted!\n  URL: https://void.dev/knowledge/xyz789',
  },
  {
    cmd: "void dark",
    description: "Enable anonymous dark mode session",
    example: '  🖤 Dark mode enabled\n  You are now: ghost_0x7f\n  Your identity is completely hidden',
  },
  {
    cmd: "void dark --off",
    description: "Disable dark mode, restore identity",
    example: '✓ Dark mode disabled. Identity restored.',
  },
  {
    cmd: "void feed",
    description: "Browse the feed in your terminal",
    example: '  [THREAD] @rustacean · 2h ago\n  Why I rewrote my entire backend in Zig\n  https://void.dev/post/...',
  },
  {
    cmd: "void market --search gpu",
    description: "Search the marketplace",
    example: '  [RENT] RTX 4090 GPU Access · $2/hr\n  @ml_builder · https://void.dev/marketplace/...',
  },
  {
    cmd: "void profile username",
    description: "View a user profile",
    example: '  @rustacean\n  Level: ARCHITECT (2,847 pts)\n  Stack: Rust, Go, WebAssembly',
  },
  {
    cmd: "void whoami",
    description: "Show your current user info",
    example: '  @you\n  Level: BUILDER (342 pts)',
  },
];

function CodeBlock({ code, output }: { code: string; output?: string | null }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-void-border overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-void-surface border-b border-void-border">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-xs font-mono text-void-muted hover:text-void-text transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-void-green" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="p-4 bg-void-card font-mono text-sm">
        <div className="flex items-start gap-2">
          <span className="text-void-purple select-none">$</span>
          <span className="text-void-text">{code}</span>
        </div>
        {output && (
          <pre className="mt-3 text-void-muted text-xs whitespace-pre-wrap border-t border-void-border pt-3">
            {output}
          </pre>
        )}
      </div>
    </div>
  );
}

export default function CLIPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-void-purple/10 border border-void-purple/20 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-void-purple" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-mono text-void-text">void CLI</h1>
            <p className="text-sm font-mono text-void-muted">Full platform access from your terminal</p>
          </div>
        </div>
      </div>

      {/* Install */}
      <div className="mb-8">
        <h2 className="text-sm font-mono font-bold text-void-muted uppercase tracking-wider mb-3">
          Installation
        </h2>
        <CodeBlock code="npm install -g void-cli" />
      </div>

      {/* Commands */}
      <div>
        <h2 className="text-sm font-mono font-bold text-void-muted uppercase tracking-wider mb-4">
          Commands
        </h2>
        <div className="space-y-4">
          {COMMANDS.map(({ cmd, description, example }, i) => (
            <motion.div
              key={cmd}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <p className="text-xs font-mono text-void-muted mb-2">{description}</p>
              <CodeBlock code={cmd} output={example} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Source */}
      <div className="mt-8 p-4 rounded-xl border border-void-border bg-void-surface">
        <p className="text-xs font-mono text-void-muted">
          Open source · MIT License ·{" "}
          <a
            href="https://github.com/void-platform/void-cli"
            target="_blank"
            rel="noopener noreferrer"
            className="text-void-purple hover:underline"
          >
            github.com/void-platform/void-cli
          </a>
        </p>
      </div>
    </div>
  );
}

