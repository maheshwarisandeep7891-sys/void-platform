"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Terminal,
  Store,
  BookOpen,
  Zap,
  Users,
  Trophy,
  Compass,
  Code2,
  Cpu,
  GitBranch,
  MessageSquare,
  Bell,
  Settings,
  Moon,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_ITEMS = [
  { href: "/feed", label: "Feed", icon: Terminal, shortcut: "G F" },
  { href: "/explore", label: "Explore", icon: Compass, shortcut: "G E" },
  { href: "/marketplace", label: "Marketplace", icon: Store, shortcut: "G M" },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen, shortcut: "G K" },
  { href: "/bounties", label: "Bounties", icon: Zap, shortcut: "G B" },
  { href: "/guilds", label: "Guilds", icon: Users, shortcut: "G G" },
  { href: "/hackathons", label: "Hackathons", icon: Rocket, shortcut: "G H" },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, shortcut: "G L" },
];

const BOTTOM_ITEMS = [
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/dark", label: "Dark Mode", icon: Moon },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-56 fixed left-0 top-14 bottom-0 border-r border-void-border bg-void-bg/50 backdrop-blur-sm overflow-y-auto">
      <div className="flex-1 py-4 px-3 space-y-1">
        {SIDEBAR_ITEMS.map(({ href, label, icon: Icon, shortcut }) => {
          const isActive = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-mono transition-all duration-150",
                isActive
                  ? "bg-void-surface text-void-text border border-void-border"
                  : "text-void-muted hover:text-void-text hover:bg-void-surface/50"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-void-purple" : "text-void-muted group-hover:text-void-text"
                  )}
                />
                {label}
              </div>
              <kbd className="hidden group-hover:inline text-[10px] text-void-muted/50 font-mono">
                {shortcut}
              </kbd>
            </Link>
          );
        })}
      </div>

      {/* Bottom items */}
      <div className="py-4 px-3 border-t border-void-border space-y-1">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-mono transition-all duration-150",
              pathname?.startsWith(href)
                ? "bg-void-surface text-void-text border border-void-border"
                : "text-void-muted hover:text-void-text hover:bg-void-surface/50"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* CLI promo */}
      <div className="p-3 border-t border-void-border">
        <Link
          href="/cli"
          className="block p-3 rounded-lg bg-void-surface border border-void-border hover:border-void-purple/30 transition-all duration-150 group"
        >
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-3.5 h-3.5 text-void-purple" />
            <span className="text-xs font-mono font-bold text-void-text">
              void CLI
            </span>
          </div>
          <p className="text-[10px] font-mono text-void-muted">
            npm install -g void-cli
          </p>
        </Link>
      </div>
    </aside>
  );
}
