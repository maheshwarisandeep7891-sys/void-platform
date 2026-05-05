"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Terminal, Code2, Rocket, Zap, HelpCircle,
  MessageSquare, Bookmark, Share2, MoreHorizontal,
  Plus, RefreshCw, TrendingUp, Clock, Users,
  ChevronRight, Filter,
} from "lucide-react";import { useSession } from "@/hooks/use-session";
import { useLiveFeed } from "@/hooks/use-live-feed";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  cn, formatDate, getInitials, REPUTATION_COLORS,
  REACTION_LABELS, REACTION_EMOJIS, BOT_BADGE, BOT_BADGE_TITLE,
} from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";

type PostType = "THREAD" | "SNIPPET" | "DROP" | "BOUNTY" | "QUESTION";
type FeedFilter = "all" | "following" | "trending";

const POST_TYPE_CONFIG: Record<PostType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  THREAD:   { label: "Thread",   icon: Terminal,    color: "text-void-purple", bg: "bg-void-purple/10" },
  SNIPPET:  { label: "Snippet",  icon: Code2,       color: "text-void-cyan",   bg: "bg-void-cyan/10" },
  DROP:     { label: "Drop",     icon: Rocket,      color: "text-void-green",  bg: "bg-void-green/10" },
  BOUNTY:   { label: "Bounty",   icon: Zap,         color: "text-void-yellow", bg: "bg-yellow-500/10" },
  QUESTION: { label: "Question", icon: HelpCircle,  color: "text-void-muted",  bg: "bg-void-surface" },
};

const FEED_FILTERS = [
  { id: "all",       label: "All",       icon: TrendingUp },
  { id: "following", label: "Following", icon: Users },
  { id: "trending",  label: "Trending",  icon: Zap },
] as const;

const TECH_FILTERS = ["All", "Rust", "Go", "TypeScript", "Python", "K8s", "ML/AI", "WebAssembly"];

interface Post {
  id: string;
  type: PostType;
  title?: string;
  content: string;
  codeSnippet?: string;
  language?: string;
  isDarkMode: boolean;
  darkHandle?: string;
  createdAt: string;
  author?: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    isBot?: boolean;
    reputation?: { score: number; level: string };
  };
  tags: { tag: { name: string; slug: string } }[];
  _count: { reactions: number; comments: number };
  reactions: { type: string }[];
}

export default function FeedPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [techFilter, setTechFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Live feed — only on "all" filter
  const { newPosts, clearNewPosts, isConnected } = useLiveFeed(filter === "all");
  const [showNewBanner, setShowNewBanner] = useState(false);

  useEffect(() => {
    if (newPosts.length > 0) setShowNewBanner(true);
  }, [newPosts]);

  const handleShowNew = () => {
    setPosts(prev => {
      const existingIds = new Set(prev.map(p => p.id));
      const fresh = newPosts.filter(p => !existingIds.has(p.id)) as Post[];
      return [...fresh, ...prev];
    });
    clearNewPosts();
    setShowNewBanner(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const fetchPosts = useCallback(async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      if (reset) setLoading(true); else setLoadingMore(true);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        filter,
        ...(techFilter !== "All" && { tech: techFilter }),
      });

      const res = await fetch(`/api/posts?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      if (reset) {
        setPosts(data.posts ?? []);
        setPage(2);
      } else {
        setPosts(prev => [...prev, ...(data.posts ?? [])]);
        setPage(p => p + 1);
      }
      setHasMore(data.hasMore ?? false);
    } catch {
      toast({ title: "Failed to load posts", variant: "destructive" });
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, [filter, techFilter, page, toast]);

  useEffect(() => {
    fetchPosts(true);
  }, [filter, techFilter]); // eslint-disable-line

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting && hasMore && !loadingMore) fetchPosts(); },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, fetchPosts]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black font-mono text-void-text tracking-tight">Feed</h1>
            {isConnected && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-void-green">
                <span className="w-1.5 h-1.5 bg-void-green rounded-full animate-pulse" />
                live
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-void-muted mt-0.5">What builders are shipping</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className={cn("p-2 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface transition-all", refreshing && "animate-spin")}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link href="/post/new">
            <Button size="sm" className="gap-1.5 font-mono">
              <Plus className="w-3.5 h-3.5" />
              Post
            </Button>
          </Link>
        </div>
      </div>

      {/* New posts banner */}
      <AnimatePresence>
        {showNewBanner && newPosts.length > 0 && (
          <motion.button
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            onClick={handleShowNew}
            className="w-full mb-4 py-2.5 px-4 rounded-xl bg-void-purple/10 border border-void-purple/30 text-sm font-mono text-void-purple hover:bg-void-purple/15 transition-all flex items-center justify-center gap-2"
          >
            <span className="w-2 h-2 bg-void-purple rounded-full animate-pulse" />
            {newPosts.length} new {newPosts.length === 1 ? "post" : "posts"} — click to load
          </motion.button>
        )}
      </AnimatePresence>

      {/* Feed type filters */}
      <div className="flex items-center gap-1 mb-4 p-1 bg-void-surface rounded-xl border border-void-border">
        {FEED_FILTERS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setFilter(id as FeedFilter)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-150",
              filter === id
                ? "bg-void-card text-void-text shadow-sm border border-void-border"
                : "text-void-muted hover:text-void-text"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tech filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-hide">
        {TECH_FILTERS.map(tech => (
          <button
            key={tech}
            onClick={() => setTechFilter(tech)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-mono whitespace-nowrap transition-all flex-shrink-0",
              techFilter === tech
                ? "bg-void-purple text-void-bg font-bold"
                : "bg-void-surface border border-void-border text-void-muted hover:text-void-text hover:border-void-purple/30"
            )}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <motion.div
                key={`sk-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-void-border bg-void-card p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-void-surface animate-pulse" />
                  <div className="space-y-1.5 flex-1">
                    <div className="w-28 h-3 bg-void-surface rounded animate-pulse" />
                    <div className="w-20 h-2 bg-void-surface rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-void-surface rounded animate-pulse" />
                  <div className="w-4/5 h-3 bg-void-surface rounded animate-pulse" />
                  <div className="w-3/5 h-3 bg-void-surface rounded animate-pulse" />
                </div>
              </motion.div>
            ))
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 rounded-2xl bg-void-surface border border-void-border flex items-center justify-center mx-auto mb-4">
                <Terminal className="w-8 h-8 text-void-muted" />
              </div>
              {filter === "following" ? (
                <>
                  <p className="text-void-text font-mono font-bold mb-1">No one to follow yet</p>
                  <p className="text-void-muted font-mono text-sm mb-6">Follow builders to see their posts here.</p>
                  <div className="flex gap-3 justify-center">
                    <Link href="/leaderboard">
                      <Button variant="outline" className="font-mono gap-1.5">
                        <Users className="w-4 h-4" />
                        Find builders
                      </Button>
                    </Link>
                    <Link href="/explore">
                      <Button className="font-mono gap-1.5">
                        <ChevronRight className="w-4 h-4" />
                        Explore
                      </Button>
                    </Link>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-void-text font-mono font-bold mb-1">No posts yet</p>
                  <p className="text-void-muted font-mono text-sm mb-6">Be the first to share something.</p>
                  <Link href="/post/new">
                    <Button className="font-mono gap-1.5">
                      <Plus className="w-4 h-4" />
                      Create first post
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          ) : (
            posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.04, 0.3), duration: 0.3 }}
                layout
              >
                <PostCard post={post} currentUserId={session?.user?.id} />
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Infinite scroll loader */}
        <div ref={loaderRef} className="h-4" />
        {loadingMore && (
          <div className="flex justify-center py-4">
            <div className="w-5 h-5 border-2 border-void-purple border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-xs font-mono text-void-muted py-4">
            You&apos;ve seen everything. Go build something.
          </p>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, currentUserId }: { post: Post; currentUserId?: string }) {
  const { toast } = useToast();
  const [reactions, setReactions] = useState<Record<string, boolean>>({
    used_this: post.reactions?.some(r => r.type === "used_this") ?? false,
    saved_me_hours: post.reactions?.some(r => r.type === "saved_me_hours") ?? false,
    brilliant: post.reactions?.some(r => r.type === "brilliant") ?? false,
  });
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const typeConfig = POST_TYPE_CONFIG[post.type];
  const TypeIcon = typeConfig.icon;
  const repLevel = post.author?.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];
  const isLong = post.content.length > 400;

  const handleReaction = async (type: string) => {
    if (!currentUserId) {
      toast({ title: "Sign in to react", variant: "destructive" });
      return;
    }
    setReactions(prev => ({ ...prev, [type]: !prev[type] }));
    try {
      await fetch(`/api/posts/${post.id}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
    } catch {
      setReactions(prev => ({ ...prev, [type]: !prev[type] }));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
    toast({ title: "Link copied!", variant: "success" });
  };

  return (
    <Card className="overflow-hidden group hover:border-void-border/80 transition-all duration-200 hover:shadow-lg hover:shadow-black/20">
      {/* Post type indicator bar */}
      <div className={cn("h-0.5 w-full", {
        "bg-void-purple": post.type === "THREAD",
        "bg-void-cyan": post.type === "SNIPPET",
        "bg-void-green": post.type === "DROP",
        "bg-yellow-500": post.type === "BOUNTY",
        "bg-void-muted": post.type === "QUESTION",
      })} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {post.isDarkMode ? (
              <div className="w-8 h-8 rounded-full bg-void-purple/10 border border-void-purple/20 flex items-center justify-center flex-shrink-0">
                <span className="text-sm">🖤</span>
              </div>
            ) : (
              <Link href={`/profile/${post.author?.username}`} className="flex-shrink-0">
                <Avatar className="w-8 h-8 ring-2 ring-void-border hover:ring-void-purple/50 transition-all">
                  <AvatarImage src={post.author?.image ?? ""} />
                  <AvatarFallback className="text-xs font-mono">
                    {getInitials(post.author?.name ?? post.author?.username ?? "?")}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {post.isDarkMode ? (
                  <span className="text-sm font-mono text-void-purple font-bold">{post.darkHandle}</span>
                ) : (
                  <Link
                    href={`/profile/${post.author?.username}`}
                    className="text-sm font-mono font-bold text-void-text hover:text-void-purple transition-colors"
                  >
                    @{post.author?.username}
                  </Link>
                )}
                {post.author?.isBot && (
                  <span title={BOT_BADGE_TITLE} className="text-[11px] cursor-help select-none" aria-label="AI Community Account">
                    {BOT_BADGE}
                  </span>
                )}
                {!post.isDarkMode && (
                  <span
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded-md border"
                    style={{ color: repColor, borderColor: `${repColor}25`, backgroundColor: `${repColor}10` }}
                  >
                    {repLevel}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono", typeConfig.bg, typeConfig.color)}>
                  <TypeIcon className="w-2.5 h-2.5" />
                  {typeConfig.label}
                </div>
                <span className="text-[10px] font-mono text-void-muted">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleShare}>Copy link</DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/post/${post.id}`}>View post</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Content */}
        <Link href={`/post/${post.id}`} className="block group/content">
          {post.title && (
            <h2 className="text-base font-bold text-void-text mb-2 group-hover/content:text-void-purple transition-colors leading-snug">
              {post.title}
            </h2>
          )}

          <div className={cn("prose-void text-sm", !expanded && isLong && "line-clamp-4")}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {isLong && !expanded && (
            <button
              onClick={(e) => { e.preventDefault(); setExpanded(true); }}
              className="text-xs font-mono text-void-purple hover:underline mt-1"
            >
              Read more →
            </button>
          )}
        </Link>

        {/* Code snippet */}
        {post.codeSnippet && (
          <div className="mt-3 rounded-xl bg-void-bg border border-void-border overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-void-border bg-void-surface/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[10px] font-mono text-void-muted">{post.language ?? "code"}</span>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(post.codeSnippet!); toast({ title: "Copied!" }); }}
                className="text-[10px] font-mono text-void-muted hover:text-void-text transition-colors"
              >
                copy
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-void-text overflow-x-auto leading-relaxed max-h-64">
              <code>{post.codeSnippet}</code>
            </pre>
          </div>
        )}

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map(({ tag }) => (
              <Link key={tag.slug} href={`/explore?tag=${tag.slug}`}>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-void-surface border border-void-border text-void-muted hover:text-void-purple hover:border-void-purple/30 transition-colors">
                  #{tag.name}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-void-border/50">
          {Object.entries(REACTION_LABELS).map(([type, label]) => (
            <motion.button
              key={type}
              onClick={() => handleReaction(type)}
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-150",
                reactions[type]
                  ? "bg-void-purple/15 text-void-purple border border-void-purple/25 font-bold"
                  : "text-void-muted hover:text-void-text hover:bg-void-surface"
              )}
              title={label}
            >
              <span className="text-sm">{REACTION_EMOJIS[type]}</span>
              <span className="hidden sm:inline">{label}</span>
            </motion.button>
          ))}

          <div className="flex-1" />

          <Link
            href={`/post/${post.id}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-void-muted hover:text-void-text hover:bg-void-surface transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="tabular-nums">{post._count.comments}</span>
          </Link>

          <motion.button
            onClick={() => setSaved(p => !p)}
            whileTap={{ scale: 0.9 }}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              saved ? "text-void-purple" : "text-void-muted hover:text-void-text hover:bg-void-surface"
            )}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.9 }}
            className="p-1.5 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </Card>
  );
}
