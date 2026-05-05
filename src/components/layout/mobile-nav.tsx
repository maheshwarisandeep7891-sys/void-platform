"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Terminal, Store, BookOpen, Bell, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

const NAV_ITEMS = [
  { href: "/feed",        icon: Terminal, label: "Feed" },
  { href: "/marketplace", icon: Store,    label: "Market" },
  { href: "/post/new",    icon: Plus,     label: "Post",   isAction: true },
  { href: "/knowledge",   icon: BookOpen, label: "Know" },
  { href: "/notifications", icon: Bell,  label: "Alerts", isNotif: true },
];

export function MobileNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-area-pb">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-[rgba(5,5,8,0.85)] backdrop-blur-2xl border-t border-[rgba(255,255,255,0.06)]" />

      <div className="relative flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, isAction, isNotif }) => {
          const isActive = pathname?.startsWith(href) && !isAction;

          if (isAction) {
            return (
              <Link key={href} href={href} className="relative -mt-5">
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center",
                    "bg-gradient-to-br from-void-purple to-[#6366f1]",
                    "shadow-[0_0_24px_rgba(139,92,246,0.5),0_4px_16px_rgba(0,0,0,0.4)]",
                    "border border-void-purple/30",
                  )}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link key={href} href={href} className="relative flex flex-col items-center gap-1 px-3 py-1.5 min-w-[48px]">
              <div className={cn(
                "relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200",
                isActive
                  ? "bg-void-purple/15 shadow-[0_0_12px_rgba(139,92,246,0.2)]"
                  : "hover:bg-void-surface/60"
              )}>
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-void-purple" : "text-void-muted"
                )} />
                {isNotif && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[14px] h-3.5 bg-void-purple rounded-full flex items-center justify-center text-[8px] font-mono font-bold text-white px-1 shadow-[0_0_6px_rgba(139,92,246,0.6)]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[9px] font-mono transition-colors",
                isActive ? "text-void-purple font-bold" : "text-void-muted"
              )}>
                {label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -bottom-1 w-1 h-1 bg-void-purple rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
