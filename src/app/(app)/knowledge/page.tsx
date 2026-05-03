"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Plus,
  MessageSquare,
  CheckCircle2,
  Clock,
  TrendingUp,
  ChevronDown,
  BookOpen,
  Tag,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate, getInitials, REPUTATION_COLORS } from "@/lib/utils";

interface Question {
  id: string;
  title: string;
  content: string;
  isDarkMode: boolean;
  darkHandle?: string;
  views: number;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    reputation?: { score: number; level: string };
  };
  tags: { tag: { name: string; slug: string } }[];
  _count: { answers: number };
  answers?: { isAccepted: boolean }[];
}

const SORT_OPTIONS = [
  { id: "newest", label: "Newest", icon: Clock },
  { id: "popular", label: "Popular", icon: TrendingUp },
  { id: "unanswered", label: "Unanswered", icon: HelpCircle },
];

export default function KnowledgePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchQuestions = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const currentPage = reset ? 1 : page;
        const params = new URLSearchParams({
          page: currentPage.toString(),
          sort,
          ...(search && { search }),
        });

        const res = await fetch(`/api/knowledge/questions?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        if (reset) {
          setQuestions(data.questions);
          setPage(2);
        } else {
          setQuestions((prev) => [...prev, ...data.questions]);
          setPage((p) => p + 1);
        }
        setHasMore(data.hasMore);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [sort, search, page]
  );

  useEffect(() => {
    const timer = setTimeout(() => fetchQuestions(true), search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [sort, search]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text">
            Knowledge Base
          </h1>
          <p className="text-sm font-mono text-void-muted">
            Questions, answers, and community wisdom
          </p>
        </div>
        <Link href="/knowledge/ask">
          <Button size="sm" className="gap-1.5 font-mono">
            <Plus className="w-3.5 h-3.5" />
            Ask Question
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-void-border bg-void-surface text-void-text placeholder:text-void-muted font-mono text-sm focus:outline-none focus:ring-1 focus:ring-void-purple focus:border-void-purple transition-colors"
        />
      </div>

      {/* Sort filters */}
      <div className="flex items-center gap-2 mb-6">
        {SORT_OPTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSort(id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all",
              sort === id
                ? "bg-void-surface text-void-text border border-void-border"
                : "text-void-muted hover:text-void-text"
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Questions list */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {loading && questions.length === 0
            ? Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-xl border border-void-border bg-void-card p-5 space-y-3"
                >
                  <div className="w-3/4 h-4 bg-void-surface rounded animate-pulse" />
                  <div className="w-full h-3 bg-void-surface rounded animate-pulse" />
                  <div className="w-1/2 h-3 bg-void-surface rounded animate-pulse" />
                </motion.div>
              ))
            : questions.map((question, i) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <QuestionCard question={question} />
                </motion.div>
              ))}
        </AnimatePresence>
      </div>

      {questions.length === 0 && !loading && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-void-muted mx-auto mb-4" />
          <p className="text-void-muted font-mono">No questions yet.</p>
          <Link href="/knowledge/ask" className="mt-4 inline-block">
            <Button size="sm" className="font-mono gap-1.5 mt-4">
              <Plus className="w-3.5 h-3.5" />
              Ask the first question
            </Button>
          </Link>
        </div>
      )}

      {hasMore && questions.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button
            variant="outline"
            onClick={() => fetchQuestions()}
            loading={loading}
            className="font-mono gap-2"
          >
            <ChevronDown className="w-4 h-4" />
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question }: { question: Question }) {
  const hasAcceptedAnswer = question.answers?.some((a) => a.isAccepted);
  const repLevel = question.author.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];

  return (
    <Card hover className="p-5 group">
      <div className="flex gap-4">
        {/* Stats */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 min-w-[48px]">
          <div
            className={cn(
              "flex flex-col items-center p-2 rounded-lg border",
              hasAcceptedAnswer
                ? "bg-void-green/10 border-void-green/20 text-void-green"
                : "bg-void-surface border-void-border text-void-muted"
            )}
          >
            {hasAcceptedAnswer ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
            <span className="text-xs font-mono tabular-nums mt-0.5">
              {question._count.answers}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link href={`/knowledge/${question.id}`}>
            <h3 className="text-base font-bold text-void-text mb-1.5 group-hover:text-void-purple transition-colors line-clamp-2">
              {question.title}
            </h3>
          </Link>
          <p className="text-sm text-void-muted line-clamp-2 mb-3">
            {question.content.replace(/[#*`]/g, "").slice(0, 200)}
          </p>

          {/* Tags */}
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {question.tags.map(({ tag }) => (
                <Link key={tag.slug} href={`/knowledge?tag=${tag.slug}`}>
                  <Badge
                    variant="secondary"
                    className="text-[10px] hover:border-void-purple/30 transition-colors"
                  >
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Author + time */}
          <div className="flex items-center gap-2">
            {question.isDarkMode ? (
              <span className="text-xs font-mono text-void-purple">
                🖤 {question.darkHandle}
              </span>
            ) : (
              <>
                <Avatar className="w-5 h-5">
                  <AvatarImage src={question.author.image ?? ""} />
                  <AvatarFallback className="text-[8px]">
                    {getInitials(
                      question.author.name ?? question.author.username
                    )}
                  </AvatarFallback>
                </Avatar>
                <Link
                  href={`/profile/${question.author.username}`}
                  className="text-xs font-mono text-void-muted hover:text-void-text transition-colors"
                >
                  @{question.author.username}
                </Link>
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
              </>
            )}
            <span className="text-xs font-mono text-void-muted ml-auto">
              {formatDate(question.createdAt)}
            </span>
            <span className="text-xs font-mono text-void-muted">
              · {question.views} views
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
