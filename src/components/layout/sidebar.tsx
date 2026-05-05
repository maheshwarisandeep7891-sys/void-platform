"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Terminal, Store, BookOpen, Zap, Users, Trophy,
  Compass, Code2, MessageSquare, Bell, Settings, Moon, Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { VoidLogo } from "@/components/ui/void-logo";

const SIDEBAR_ITEMS = [
  { href: "/feed",        label: "Feed",        icon: Terminal,  shortcut: "G F" },
  { href: "/explore",     label: "Explore",     icon: Compass,   shortcut: "G E" },
  { href: "/marketplace", label: "Marketplace", icon: Store,     shortcut: "G M" },
  { href: "/knowledge",   label: "Knowledge",   icon: BookOpen,  shortcut: "G K" },
  { href: "/bounties",    label: "Bounties",    icon: Zap,       shortcut: "G B" },
  { href: "/guilds",      label: "Guilds",      icon: Users,     shortcut: "G G" },
  { href: "/hackathons",  label: "Hackathons",  icon: Rocket,    shortcut: "G H" },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy,    shortcut: "G L" },
];

const BOTTOM_ITEMS = [
  { href: "/messages",      label: "Messages",      icon: MessageSquare, badge: false },
  { href: "/notifications", label: "Notifications", icon: Bell,          badge: true  },
  { href: "/dark",          label: "Dark Mode",     icon: Moon,          badge: false },
  { href: "/settings",      label: "Settings",      icon: Settings,      badge: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  return (
    <aside className="hidden lg:flex flex-col w-56 fixed left-0 top-14 bottom-0 border-r border-[rgba(255,255,255,0.05)] bg-[rgba(5,5,8,0.85)] backdrop-blur-xl overflow-y-auto">
      <div className="flex-1 py-4 px-3 space-y-0.5">
        {SIDEBAR_ITEMS.map(({ href, label, icon: Icon, shortcut }) => {
          const isActive = pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-mono transition-all duration-150",
                isActive
                  ? [
                      "bg-gradient-to-r from-void-purple/15 to-void-purple/5",
                      "text-void-text border border-void-purple/20",
                      "shadow-[0_0_12px_rgba(139,92,246,0.1)]",
                    ].join(" ")
                  : "text-void-muted hover:text-void-text hover:bg-void-surface/50"
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-void-purple" : "text-void-muted group-hover:text-void-text"
                )} />
                {label}
              </div>
              <kbd className="hidden group-hover:inline text-[10px] text-void-muted/40 font-mono bg-void-surface/50 px-1.5 py-0.5 rounded-md border border-void-border/50">
                {shortcut}
              </kbd>
            </Link>
          );
        })}
      </div>

      {/* Bottom items */}
      <div className="py-4 px-3 border-t border-[rgba(255,255,255,0.05)] space-y-0.5">
        {BOTTOM_ITEMS.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-mono transition-all duration-150",
              pathname?.startsWith(href)
                ? "bg-gradient-to-r from-void-purple/15 to-void-purple/5 text-void-text border border-void-purple/20"
                : "text-void-muted hover:text-void-text hover:bg-void-surface/50"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-4 h-4" />
              {label}
            </div>
            {badge && unreadCount > 0 && (
              <span className="min-w-[18px] h-[18px] bg-void-purple rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-white px-1 shadow-[0_0_8px_rgba(139,92,246,0.5)]">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* CLI promo */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.05)]">
        <Link href="/cli" className="block p-3 rounded-xl bg-gradient-to-br from-void-purple/8 to-void-cyan/4 border border-void-purple/15 hover:border-void-purple/30 transition-all duration-150 group">
          <div className="flex items-center gap-2 mb-1">
            <Code2 className="w-3.5 h-3.5 text-void-purple" />
            <span className="text-xs font-mono font-bold text-void-text">void CLI</span>
          </div>
          <p className="text-[10px] font-mono text-void-muted">npm install -g void-cli</p>
        </Link>
      </div>
    </aside>
  );
}
