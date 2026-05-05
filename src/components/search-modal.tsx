"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search, Terminal, Package, BookOpen, Users,
  Code2, X, ArrowRight, Loader2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, getInitials, REPUTATION_COLORS } from "@/lib/utils";

interface SearchResults {
  posts: Array<{ id: string; type: string; title?: string; content: string; createdAt: string; author?: { username: string } }>;
  listings: Array<{ id: string; title: string; type: string; price?: number; seller: { username: string } }>;
  questions: Array<{ id: string; title: string; createdAt: string; author: { username: string }; _count: { answers: number } }>;
  users: Array<{ id: string; username: string; name?: string; image?: string; reputation?: { score: number; level: string } }>;
}

const QUICK_LINKS = [
  { href: "/feed", label: "Feed", icon: Terminal },
  { href: "/marketplace", label: "Marketplace", icon: Package },
  { href: "/knowledge", label: "Knowledge Base", icon: BookOpen },
  { href: "/bounties", label: "Open Bounties", icon: Code2 },
  { href: "/guilds", label: "Guilds", icon: Users },
  { href: "/dark", label: "🖤 Dark Mode", icon: null },
];

export function SearchModal({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setResults(data);
    } catch {
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(query), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  const hasResults = results && (
    results.posts.length > 0 ||
    results.listings.length > 0 ||
    results.questions.length > 0 ||
    results.users.length > 0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.96 }}
        transition={{ duration: 0.15 }}
        className="w-full max-w-2xl bg-void-card border border-void-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 p-4 border-b border-void-border">
          {loading ? (
            <Loader2 className="w-5 h-5 text-void-muted flex-shrink-0 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-void-muted flex-shrink-0" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, tools, people, questions..."
            className="flex-1 bg-transparent text-void-text placeholder:text-void-muted font-mono text-sm outline-none"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-void-muted hover:text-void-text transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="text-xs bg-void-surface px-2 py-1 rounded border border-void-border text-void-muted font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {!query && (
            <div className="p-4">
              <p className="text-[10px] font-mono text-void-muted uppercase tracking-wider mb-3">Quick links</p>
              <div className="space-y-1">
                {QUICK_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-mono text-void-muted hover:text-void-text hover:bg-void-surface transition-colors"
                  >
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                    {label}
                    <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {query.length >= 2 && !loading && !hasResults && (
            <div className="p-8 text-center">
              <p className="text-void-muted font-mono text-sm">No results for &quot;{query}&quot;</p>
            </div>
          )}

          {hasResults && (
            <div className="p-4 space-y-5">
              {/* Users */}
              {results!.users.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-void-muted uppercase tracking-wider mb-2">People</p>
                  <div className="space-y-1">
                    {results!.users.map(user => {
                      const repLevel = user.reputation?.level ?? "NEWCOMER";
                      const repColor = REPUTATION_COLORS[repLevel];
                      return (
                        <Link
                          key={user.id}
                          href={`/profile/${user.username}`}
                          onClick={onClose}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-void-surface transition-colors"
                        >
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="text-[10px]">{getInitials(user.name ?? user.username)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="text-sm font-mono text-void-text">@{user.username}</span>
                            {user.name && <span className="text-xs font-mono text-void-muted ml-2">{user.name}</span>}
                          </div>
                          <span className="ml-auto text-[10px] font-mono" style={{ color: repColor }}>{repLevel}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Posts */}
              {results!.posts.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-void-muted uppercase tracking-wider mb-2">Posts</p>
                  <div className="space-y-1">
                    {results!.posts.map(post => (
                      <Link
                        key={post.id}
                        href={`/post/${post.id}`}
                        onClick={onClose}
                        className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-void-surface transition-colors"
                      >
                        <Terminal className="w-4 h-4 text-void-purple flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-sm font-mono text-void-text truncate">
                            {post.title ?? post.content.slice(0, 60)}
                          </p>
                          <p className="text-[10px] font-mono text-void-muted">@{post.author?.username} · {post.type}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Questions */}
              {results!.questions.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-void-muted uppercase tracking-wider mb-2">Questions</p>
                  <div className="space-y-1">
                    {results!.questions.map(q => (
                      <Link
                        key={q.id}
                        href={`/knowledge/${q.id}`}
                        onClick={onClose}
                        className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-void-surface transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-void-cyan flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-sm font-mono text-void-text truncate">{q.title}</p>
                          <p className="text-[10px] font-mono text-void-muted">@{q.author.username} · {q._count.answers} answers</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Listings */}
              {results!.listings.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono text-void-muted uppercase tracking-wider mb-2">Marketplace</p>
                  <div className="space-y-1">
                    {results!.listings.map(listing => (
                      <Link
                        key={listing.id}
                        href={`/marketplace/${listing.id}`}
                        onClick={onClose}
                        className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-void-surface transition-colors"
                      >
                        <Package className="w-4 h-4 text-void-green flex-shrink-0 mt-0.5" />
                        <div className="min-w-0">
                          <p className="text-sm font-mono text-void-text truncate">{listing.title}</p>
                          <p className="text-[10px] font-mono text-void-muted">@{listing.seller.username} · {listing.type.replace("_", " ")}</p>
                        </div>
                        {listing.price && (
                          <span className="ml-auto text-xs font-mono text-void-green">${listing.price}</span>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-void-border flex items-center gap-4 text-[10px] font-mono text-void-muted">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>ESC close</span>
          <Link href={`/explore${query ? `?q=${encodeURIComponent(query)}` : ""}`} onClick={onClose} className="ml-auto hover:text-void-text transition-colors">
            See all results →
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
