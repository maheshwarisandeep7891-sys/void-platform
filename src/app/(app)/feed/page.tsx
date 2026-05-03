"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Filter,
  Plus,
  RefreshCw,
  Zap,
  Code2,
  MessageSquare,
  Bookmark,
  Share2,
  MoreHorizontal,
  ChevronDown,
  Terminal,
  Package,
  Rocket,
  HelpCircle,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  cn,
  formatDate,
  getInitials,
  REPUTATION_COLORS,
  REACTION_LABELS,
  REACTION_EMOJIS,
} from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type PostType = "THREAD" | "SNIPPET" | "DROP" | "BOUNTY" | "QUESTION";
type FeedFilter = "all" | "following" | "trending";

const POST_TYPE_CONFIG: Record<
  PostType,
  { label: string; icon: React.ElementType; color: string }
> = {
  THREAD: { label: "Thread", icon: Terminal, color: "text-void-purple" },
  SNIPPET: { label: "Snippet", icon: Code2, color: "text-void-cyan" },
  DROP: { label: "Drop", icon: Rocket, color: "text-void-green" },
  BOUNTY: { label: "Bounty", icon: Zap, color: "text-void-yellow" },
  QUESTION: { label: "Question", icon: HelpCircle, color: "text-void-muted" },
};

const TECH_FILTERS = [
  "All",
  "Rust",
  "Go",
  "TypeScript",
  "Python",
  "Kubernetes",
  "ML/AI",
  "WebAssembly",
  "DevOps",
];

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
    reputation?: { score: number; level: string };
  };
  tags: { tag: { name: string; slug: string } }[];
  _count: { reactions: number; comments: number };
  reactions: { type: string }[];
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FeedFilter>("all");
  const [techFilter, setTechFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;
      const res = await fetch(
        `/api/posts?page=${currentPage}&filter=${filter}&tech=${techFilter}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      if (reset) {
        setPosts(data.posts);
        setPage(2);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
        setPage((p) => p + 1);
      }
      setHasMore(data.hasMore);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter, techFilter, page]);

  useEffect(() => {
    fetchPosts(true);
  }, [filter, techFilter]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text">Feed</h1>
          <p className="text-sm font-mono text-void-muted">
            What builders are shipping
          </p>
        </div>
        <Link href="/post/new">
          <Button size="sm" className="gap-1.5 font-mono">
            <Plus className="w-3.5 h-3.5" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Feed filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
        {(["all", "following", "trending"] as FeedFilter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all",
              filter === f
                ? "bg-void-surface text-void-text border border-void-border"
                : "text-void-muted hover:text-void-text"
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <div className="w-px h-4 bg-void-border mx-1 flex-shrink-0" />
        {TECH_FILTERS.map((t) => (
          <button
            key={t}
            onClick={() => setTechFilter(t)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all",
              techFilter === t
                ? "bg-void-purple/10 text-void-purple border border-void-purple/20"
                : "text-void-muted hover:text-void-text"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {loading && posts.length === 0 ? (
            // Skeleton
            Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl border border-void-border bg-void-card p-5 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-void-surface animate-pulse" />
                  <div className="space-y-1.5">
                    <div className="w-24 h-3 bg-void-surface rounded animate-pulse" />
                    <div className="w-16 h-2 bg-void-surface rounded animate-pulse" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-full h-3 bg-void-surface rounded animate-pulse" />
                  <div className="w-3/4 h-3 bg-void-surface rounded animate-pulse" />
                </div>
              </motion.div>
            ))
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Terminal className="w-12 h-12 text-void-muted mx-auto mb-4" />
              <p className="text-void-muted font-mono">No posts yet.</p>
              <p className="text-void-muted/50 font-mono text-sm mt-1">
                Be the first to post something.
              </p>
              <Link href="/post/new" className="mt-4 inline-block">
                <Button size="sm" className="font-mono gap-1.5 mt-4">
                  <Plus className="w-3.5 h-3.5" />
                  Create first post
                </Button>
              </Link>
            </motion.div>
          ) : (
            posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Load more */}
        {hasMore && posts.length > 0 && (
          <div className="flex justify-center pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchPosts()}
              loading={loading}
              className="font-mono gap-2"
            >
              <ChevronDown className="w-4 h-4" />
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  const [reacted, setReacted] = useState<string | null>(null);
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>(
    {}
  );
  const [saved, setSaved] = useState(false);

  const typeConfig = POST_TYPE_CONFIG[post.type];
  const TypeIcon = typeConfig.icon;
  const repLevel = post.author?.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];

  const handleReaction = async (type: string) => {
    if (reacted === type) {
      setReacted(null);
    } else {
      setReacted(type);
      try {
        await fetch(`/api/posts/${post.id}/react`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type }),
        });
      } catch {}
    }
  };

  return (
    <Card className="p-5 hover:border-void-border/80 transition-all duration-200 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {post.isDarkMode ? (
            <div className="w-8 h-8 rounded-full bg-void-purple/10 border border-void-purple/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🖤</span>
            </div>
          ) : (
            <Link href={`/profile/${post.author?.username}`}>
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarImage src={post.author?.image ?? ""} />
                <AvatarFallback className="text-xs">
                  {getInitials(
                    post.author?.name ?? post.author?.username ?? "?"
                  )}
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
          <div>
            <div className="flex items-center gap-2">
              {post.isDarkMode ? (
                <span className="text-sm font-mono text-void-purple">
                  {post.darkHandle}
                </span>
              ) : (
                <Link
                  href={`/profile/${post.author?.username}`}
                  className="text-sm font-mono text-void-text hover:text-void-purple transition-colors"
                >
                  @{post.author?.username}
                </Link>
              )}
              {!post.isDarkMode && (
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                  style={{
                    color: repColor,
                    borderColor: `${repColor}30`,
                    backgroundColor: `${repColor}10`,
                  }}
                >
                  {repLevel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <TypeIcon className={cn("w-3 h-3", typeConfig.color)} />
              <span className={cn("text-[10px] font-mono", typeConfig.color)}>
                {typeConfig.label}
              </span>
              <span className="text-[10px] font-mono text-void-muted">
                · {formatDate(post.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface opacity-0 group-hover:opacity-100 transition-all">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content */}
      <Link href={`/post/${post.id}`} className="block">
        {post.title && (
          <h2 className="text-base font-bold text-void-text mb-2 hover:text-void-purple transition-colors">
            {post.title}
          </h2>
        )}
        <div className="prose-void text-sm line-clamp-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Code snippet preview */}
        {post.codeSnippet && (
          <div className="mt-3 rounded-lg bg-void-surface border border-void-border overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2 border-b border-void-border bg-void-bg/50">
              <Code2 className="w-3 h-3 text-void-cyan" />
              <span className="text-[10px] font-mono text-void-muted">
                {post.language ?? "code"}
              </span>
            </div>
            <pre className="p-3 text-xs font-mono text-void-text overflow-x-auto line-clamp-6">
              <code>{post.codeSnippet}</code>
            </pre>
          </div>
        )}
      </Link>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.map(({ tag }) => (
            <Link key={tag.slug} href={`/explore?tag=${tag.slug}`}>
              <Badge variant="secondary" className="text-[10px] hover:border-void-purple/30 transition-colors">
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 mt-4 pt-3 border-t border-void-border">
        {/* Reactions */}
        {Object.entries(REACTION_LABELS).map(([type, label]) => (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-150",
              reacted === type
                ? "bg-void-purple/10 text-void-purple border border-void-purple/20"
                : "text-void-muted hover:text-void-text hover:bg-void-surface"
            )}
            title={label}
          >
            <span>{REACTION_EMOJIS[type]}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}

        <div className="flex-1" />

        {/* Comment count */}
        <Link
          href={`/post/${post.id}`}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono text-void-muted hover:text-void-text hover:bg-void-surface transition-all"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span className="tabular-nums">{post._count.comments}</span>
        </Link>

        {/* Save */}
        <button
          onClick={() => setSaved((p) => !p)}
          className={cn(
            "p-1.5 rounded-lg text-xs font-mono transition-all",
            saved
              ? "text-void-purple"
              : "text-void-muted hover:text-void-text hover:bg-void-surface"
          )}
        >
          <Bookmark className="w-3.5 h-3.5" />
        </button>

        {/* Share */}
        <button
          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)}
          className="p-1.5 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
}
