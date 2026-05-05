"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Terminal, Code2, Rocket, Zap, HelpCircle,
  MessageSquare, Bookmark, Share2, ArrowLeft,
  MoreHorizontal, Send, ChevronDown, ChevronUp,
  Trash2, Reply, Copy, Check,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
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
  REACTION_LABELS, REACTION_EMOJIS,
} from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";

type PostType = "THREAD" | "SNIPPET" | "DROP" | "BOUNTY" | "QUESTION";

const POST_TYPE_CONFIG: Record<PostType, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  THREAD:   { label: "Thread",   icon: Terminal,    color: "text-void-purple", bg: "bg-void-purple/10" },
  SNIPPET:  { label: "Snippet",  icon: Code2,       color: "text-void-cyan",   bg: "bg-void-cyan/10" },
  DROP:     { label: "Drop",     icon: Rocket,      color: "text-void-green",  bg: "bg-void-green/10" },
  BOUNTY:   { label: "Bounty",   icon: Zap,         color: "text-void-yellow", bg: "bg-yellow-500/10" },
  QUESTION: { label: "Question", icon: HelpCircle,  color: "text-void-muted",  bg: "bg-void-surface" },
};

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    reputation?: { score: number; level: string };
  };
  replies: Comment[];
}

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
  reactionCounts: { type: string; _count: { type: number } }[];
  comments: Comment[];
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<{ id: string; username: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const postId = params.id as string;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setPost(data);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleReaction = async (type: string) => {
    if (!session) {
      toast({ title: "Sign in to react", variant: "destructive" });
      return;
    }
    if (!post) return;

    const hasReaction = post.reactions?.some(r => r.type === type);
    setPost(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        reactions: hasReaction
          ? prev.reactions.filter(r => r.type !== type)
          : [...(prev.reactions ?? []), { type }],
      };
    });

    try {
      await fetch(`/api/posts/${postId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
    } catch {
      // revert
      setPost(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          reactions: hasReaction
            ? [...(prev.reactions ?? []), { type }]
            : prev.reactions.filter(r => r.type !== type),
        };
      });
    }
  };

  const handleComment = async () => {
    if (!session) {
      toast({ title: "Sign in to comment", variant: "destructive" });
      return;
    }
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: commentText,
          parentId: replyTo?.id,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const newComment = await res.json();

      setPost(prev => {
        if (!prev) return prev;
        if (replyTo) {
          return {
            ...prev,
            comments: prev.comments.map(c =>
              c.id === replyTo.id
                ? { ...c, replies: [...c.replies, newComment] }
                : c
            ),
          };
        }
        return {
          ...prev,
          comments: [...prev.comments, newComment],
          _count: { ...prev._count, comments: prev._count.comments + 1 },
        };
      });

      setCommentText("");
      setReplyTo(null);
      toast({ title: "Comment posted!" });
    } catch {
      toast({ title: "Failed to post comment", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Link copied!" });
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      toast({ title: "Post deleted" });
      router.push("/feed");
    } catch {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        <div className="h-8 w-32 bg-void-surface rounded animate-pulse" />
        <div className="rounded-xl border border-void-border bg-void-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-void-surface animate-pulse" />
            <div className="space-y-2">
              <div className="w-32 h-4 bg-void-surface rounded animate-pulse" />
              <div className="w-24 h-3 bg-void-surface rounded animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-3 bg-void-surface rounded animate-pulse" style={{ width: `${85 - i * 8}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-void-surface border border-void-border flex items-center justify-center mx-auto mb-4">
          <Terminal className="w-8 h-8 text-void-muted" />
        </div>
        <p className="text-void-text font-mono font-bold mb-2">Post not found</p>
        <p className="text-void-muted font-mono text-sm mb-6">This post may have been deleted.</p>
        <Button onClick={() => router.push("/feed")} variant="outline" className="font-mono gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Back to feed
        </Button>
      </div>
    );
  }

  const typeConfig = POST_TYPE_CONFIG[post.type];
  const TypeIcon = typeConfig.icon;
  const repLevel = post.author?.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];
  const isOwner = session?.user?.id === post.author?.id;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-mono text-void-muted hover:text-void-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Post */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="overflow-hidden mb-6">
          {/* Type bar */}
          <div className={cn("h-0.5 w-full", {
            "bg-void-purple": post.type === "THREAD",
            "bg-void-cyan": post.type === "SNIPPET",
            "bg-void-green": post.type === "DROP",
            "bg-yellow-500": post.type === "BOUNTY",
            "bg-void-muted": post.type === "QUESTION",
          })} />

          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {post.isDarkMode ? (
                  <div className="w-10 h-10 rounded-full bg-void-purple/10 border border-void-purple/20 flex items-center justify-center">
                    <span className="text-lg">🖤</span>
                  </div>
                ) : (
                  <Link href={`/profile/${post.author?.username}`}>
                    <Avatar className="w-10 h-10 ring-2 ring-void-border hover:ring-void-purple/50 transition-all">
                      <AvatarImage src={post.author?.image ?? ""} />
                      <AvatarFallback className="text-sm font-mono">
                        {getInitials(post.author?.name ?? post.author?.username ?? "?")}
                      </AvatarFallback>
                    </Avatar>
                  </Link>
                )}
                <div>
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
                    {!post.isDarkMode && (
                      <span
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded-md border"
                        style={{ color: repColor, borderColor: `${repColor}25`, backgroundColor: `${repColor}10` }}
                      >
                        {repLevel}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
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

              <div className="flex items-center gap-1">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface transition-all"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 text-void-green" /> : <Share2 className="w-4 h-4" />}
                </button>
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 rounded-lg text-void-muted hover:text-void-text hover:bg-void-surface transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-400 focus:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete post
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            {/* Title */}
            {post.title && (
              <h1 className="text-2xl font-black text-void-text mb-4 leading-tight">
                {post.title}
              </h1>
            )}

            {/* Content */}
            <div className="prose-void text-sm leading-relaxed mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </div>

            {/* Code snippet */}
            {post.codeSnippet && (
              <div className="rounded-xl bg-void-bg border border-void-border overflow-hidden mb-4">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-void-border bg-void-surface/50">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                    </div>
                    <span className="text-[10px] font-mono text-void-muted">{post.language ?? "code"}</span>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(post.codeSnippet!);
                      toast({ title: "Code copied!" });
                    }}
                    className="flex items-center gap-1 text-[10px] font-mono text-void-muted hover:text-void-text transition-colors"
                  >
                    <Copy className="w-3 h-3" />
                    copy
                  </button>
                </div>
                <pre className="p-5 text-sm font-mono text-void-text overflow-x-auto leading-relaxed">
                  <code>{post.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {post.tags.map(({ tag }) => (
                  <Link key={tag.slug} href={`/explore?tag=${tag.slug}`}>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-void-surface border border-void-border text-void-muted hover:text-void-purple hover:border-void-purple/30 transition-colors">
                      #{tag.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Reactions */}
            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-void-border/50">
              {Object.entries(REACTION_LABELS).map(([type, label]) => {
                const count = post.reactionCounts?.find(r => r.type === type)?._count?.type ?? 0;
                const active = post.reactions?.some(r => r.type === type);
                return (
                  <motion.button
                    key={type}
                    onClick={() => handleReaction(type)}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-mono transition-all duration-150 border",
                      active
                        ? "bg-void-purple/15 text-void-purple border-void-purple/25 font-bold"
                        : "text-void-muted hover:text-void-text hover:bg-void-surface border-transparent hover:border-void-border"
                    )}
                  >
                    <span className="text-base">{REACTION_EMOJIS[type]}</span>
                    <span>{label}</span>
                    {count > 0 && (
                      <span className={cn(
                        "text-xs px-1.5 py-0.5 rounded-full",
                        active ? "bg-void-purple/20" : "bg-void-surface"
                      )}>
                        {count}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Comments section */}
      <div>
        <h2 className="text-lg font-black font-mono text-void-text mb-4">
          {post._count.comments} {post._count.comments === 1 ? "Comment" : "Comments"}
        </h2>

        {/* Comment input */}
        <Card className="p-4 mb-6">
          {replyTo && (
            <div className="flex items-center justify-between mb-2 px-3 py-1.5 rounded-lg bg-void-purple/10 border border-void-purple/20">
              <span className="text-xs font-mono text-void-purple">
                Replying to @{replyTo.username}
              </span>
              <button
                onClick={() => setReplyTo(null)}
                className="text-void-muted hover:text-void-text"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={session?.user?.image ?? ""} />
              <AvatarFallback className="text-xs">
                {getInitials(session?.user?.name ?? session?.user?.username ?? "?")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <textarea
                ref={commentRef}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleComment();
                }}
                placeholder={session ? "Add a comment... (⌘↵ to submit)" : "Sign in to comment"}
                disabled={!session}
                rows={3}
                className="w-full bg-transparent text-sm font-mono text-void-text placeholder:text-void-muted resize-none outline-none disabled:opacity-50"
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText.trim() || submitting || !session}
                  loading={submitting}
                  className="font-mono gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Comment
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Comments list */}
        <div className="space-y-4">
          <AnimatePresence>
            {post.comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <CommentItem
                  comment={comment}
                  currentUserId={session?.user?.id}
                  onReply={(id, username) => {
                    setReplyTo({ id, username });
                    commentRef.current?.focus();
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {post.comments.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-10 h-10 text-void-muted mx-auto mb-3" />
              <p className="text-void-muted font-mono text-sm">No comments yet. Be the first.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onReply,
  depth = 0,
}: {
  comment: Comment;
  currentUserId?: string;
  onReply: (id: string, username: string) => void;
  depth?: number;
}) {
  const [showReplies, setShowReplies] = useState(true);
  const repLevel = comment.user.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-8 pl-4 border-l border-void-border/50")}>
      <Link href={`/profile/${comment.user.username}`} className="flex-shrink-0">
        <Avatar className="w-7 h-7">
          <AvatarImage src={comment.user.image ?? ""} />
          <AvatarFallback className="text-[10px]">
            {getInitials(comment.user.name ?? comment.user.username)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href={`/profile/${comment.user.username}`}
            className="text-xs font-mono font-bold text-void-text hover:text-void-purple transition-colors"
          >
            @{comment.user.username}
          </Link>
          <span
            className="text-[9px] font-mono px-1 py-0.5 rounded border"
            style={{ color: repColor, borderColor: `${repColor}25`, backgroundColor: `${repColor}10` }}
          >
            {repLevel}
          </span>
          <span className="text-[10px] font-mono text-void-muted">
            {formatDate(comment.createdAt)}
          </span>
        </div>
        <div className="text-sm text-void-text leading-relaxed mb-2">
          {comment.content}
        </div>
        <div className="flex items-center gap-3">
          {depth === 0 && (
            <button
              onClick={() => onReply(comment.id, comment.user.username)}
              className="flex items-center gap-1 text-[10px] font-mono text-void-muted hover:text-void-purple transition-colors"
            >
              <Reply className="w-3 h-3" />
              Reply
            </button>
          )}
          {comment.replies.length > 0 && (
            <button
              onClick={() => setShowReplies(p => !p)}
              className="flex items-center gap-1 text-[10px] font-mono text-void-muted hover:text-void-text transition-colors"
            >
              {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}
            </button>
          )}
        </div>

        {/* Replies */}
        <AnimatePresence>
          {showReplies && comment.replies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 space-y-3"
            >
              {comment.replies.map(reply => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
