"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Terminal, Store, BookOpen, Zap, Users, Plus, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

const NAV_ITEMS = [
  { href: "/feed", icon: Terminal, label: "Feed" },
  { href: "/marketplace", icon: Store, label: "Market" },
  { href: "/post/new", icon: Plus, label: "Post", isAction: true },
  { href: "/knowledge", icon: BookOpen, label: "Know" },
  { href: "/notifications", icon: Bell, label: "Alerts", isNotif: true },
];

export function MobileNav() {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-void-bg/95 backdrop-blur-xl border-t border-void-border safe-area-pb">
      <div className="flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, isAction, isNotif }) => {
          const isActive = pathname?.startsWith(href) && !isAction;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all relative",
                isAction
                  ? "bg-void-purple text-void-bg -mt-4 shadow-lg shadow-void-purple/30 px-4 py-3"
                  : isActive
                  ? "text-void-text"
                  : "text-void-muted"
              )}
            >
              <Icon className={cn("w-5 h-5", isAction && "w-5 h-5")} />
              {!isAction && (
                <span className="text-[9px] font-mono">{label}</span>
              )}
              {isNotif && unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[14px] h-3.5 bg-void-purple rounded-full flex items-center justify-center text-[8px] font-mono font-bold text-white px-1">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
              {isActive && !isAction && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-void-purple rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
