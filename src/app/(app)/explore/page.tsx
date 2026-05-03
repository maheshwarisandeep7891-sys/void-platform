"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Compass, TrendingUp, Users, Package, BookOpen, Zap, Code2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TRENDING_TAGS = [
  "rust", "go", "typescript", "kubernetes", "webassembly", "llm", "zig",
  "elixir", "htmx", "bun", "deno", "nix", "gleam", "cuda", "risc-v",
];

const SECTIONS = [
  { href: "/feed", label: "Trending Posts", icon: TrendingUp, color: "text-void-purple", description: "What builders are shipping right now" },
  { href: "/marketplace", label: "Hot Listings", icon: Package, color: "text-void-green", description: "Tools, APIs, and projects for sale" },
  { href: "/knowledge", label: "Top Questions", icon: BookOpen, color: "text-void-cyan", description: "Community knowledge and answers" },
  { href: "/bounties", label: "Open Bounties", icon: Zap, color: "text-void-yellow", description: "Problems with rewards attached" },
  { href: "/guilds", label: "Active Guilds", icon: Users, color: "text-void-purple", description: "Communities organized by tech stack" },
];

export default function ExplorePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-black font-mono text-void-text">Explore</h1>
        <p className="text-sm font-mono text-void-muted">Discover what the community is building</p>
      </div>

      {/* Trending tags */}
      <div className="mb-8">
        <h2 className="text-sm font-mono font-bold text-void-muted uppercase tracking-wider mb-3">
          Trending Tags
        </h2>
        <div className="flex flex-wrap gap-2">
          {TRENDING_TAGS.map((tag, i) => (
            <motion.div
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link href={`/feed?tag=${tag}`}>
                <Badge variant="secondary" className="text-sm hover:border-void-purple/30 transition-colors cursor-pointer">
                  #{tag}
                </Badge>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(({ href, label, icon: Icon, color, description }, i) => (
          <motion.div
            key={href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={href}>
              <Card hover className="p-5 group">
                <Icon className={`w-8 h-8 ${color} mb-3`} />
                <h3 className="text-base font-bold text-void-text mb-1 group-hover:text-void-purple transition-colors">
                  {label}
                </h3>
                <p className="text-sm text-void-muted">{description}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
