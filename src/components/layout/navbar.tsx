"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Terminal, Bell, MessageSquare, Search, Plus,
  ChevronDown, LogOut, Settings, User, Zap,
  Trophy, Store, BookOpen, Users, Moon,
} from "lucide-react";
import { useSession, signOut } from "@/hooks/use-session";
import { useNotifications } from "@/hooks/use-notifications";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VoidLogo } from "@/components/ui/void-logo";
import { SearchModal } from "@/components/search-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, getInitials, REPUTATION_COLORS } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/feed", label: "Feed", icon: Terminal },
  { href: "/marketplace", label: "Market", icon: Store },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/bounties", label: "Bounties", icon: Zap },
  { href: "/guilds", label: "Guilds", icon: Users },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Cmd+Shift+D for dark mode
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === "D") {
        e.preventDefault();
        setIsDarkMode((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const user = session?.user;
  const repLevel = user?.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];
  const { unreadCount } = useNotifications();

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "glass-strong border-b border-[rgba(255,255,255,0.06)] shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
            : "bg-transparent",
          isDarkMode && "border-b border-void-purple/20"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <VoidLogo size={32} variant="full" />
              </motion.div>
              {isDarkMode && (
                <span className="text-xs font-mono text-void-purple animate-pulse">🖤 dark</span>
              )}
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-0.5">
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-mono transition-all duration-150",
                    pathname?.startsWith(href)
                      ? "text-void-text bg-void-surface/80 border border-void-border shadow-[0_0_12px_rgba(139,92,246,0.1)]"
                      : "text-void-muted hover:text-void-text hover:bg-void-surface/40"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", pathname?.startsWith(href) ? "text-void-purple" : "")} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-void-border bg-void-surface/50 text-void-muted text-sm font-mono hover:border-void-purple/50 transition-colors"
                title="Search (⌘K)"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden lg:inline text-xs bg-void-bg px-1.5 py-0.5 rounded border border-void-border">
                  ⌘K
                </kbd>
              </button>

              {session ? (
                <>
                  {/* Dark Mode Toggle */}
                  <button
                    onClick={() => setIsDarkMode((p) => !p)}
                    title="Toggle Dark Mode (⌘⇧D)"
                    className={cn(
                      "p-2 rounded-lg transition-all duration-150",
                      isDarkMode
                        ? "bg-void-purple/20 text-void-purple border border-void-purple/30"
                        : "text-void-muted hover:text-void-text hover:bg-void-surface"
                    )}
                  >
                    <Moon className="w-4 h-4" />
                  </button>

                  {/* Notifications */}
                  <Link
                    href="/notifications"
                    className="relative p-2 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface transition-all duration-150"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-void-purple rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-white px-1">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Messages */}
                  <Link
                    href="/messages"
                    className="p-2 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface transition-all duration-150"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Link>

                  {/* New Post */}
                  <Link href="/post/new">
                    <Button size="sm" className="gap-1.5 font-mono">
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Post</span>
                    </Button>
                  </Link>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-void-surface transition-all duration-150">
                        <Avatar className="w-7 h-7">
                          <AvatarImage src={user?.image ?? ""} />
                          <AvatarFallback className="text-xs">
                            {getInitials(user?.name ?? user?.username ?? "?")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden sm:flex flex-col items-start">
                          <span className="text-xs font-mono text-void-text leading-none">
                            {user?.username ?? "user"}
                          </span>
                          <span
                            className="text-[10px] font-mono leading-none mt-0.5"
                            style={{ color: repColor }}
                          >
                            {repLevel}
                          </span>
                        </div>
                        <ChevronDown className="w-3 h-3 text-void-muted hidden sm:block" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuLabel className="font-mono">
                        @{user?.username}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href={`/profile/${user?.username}`}>
                          <User className="w-4 h-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings/seller">
                          <Store className="w-4 h-4" />
                          Seller Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-red-400 focus:text-red-400"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/signin">
                    <Button variant="ghost" size="sm" className="font-mono">
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button size="sm" className="font-mono">
                      Join VOID
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <SearchModal onClose={() => setSearchOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
