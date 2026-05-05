"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, ChevronUp, ChevronDown,
  MessageSquare, Eye, Clock, Tag, Send, Check,
  ThumbsUp, ThumbsDown, Award, Edit3,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn, formatDate, formatNumber, getInitials, REPUTATION_COLORS } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";

interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  stillWorksAt?: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    reputation?: { score: number; level: string };
  };
  votes: { value: number; userId: string }[];
  _count: { votes: number };
}

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
  answers: Answer[];
}

export default function QuestionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerText, setAnswerText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const questionId = params.id as string;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/knowledge/questions/${questionId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setQuestion(data);
      } catch {
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestion();
  }, [questionId]);

  const handleVote = async (answerId: string, value: 1 | -1) => {
    if (!session) {
      toast({ title: "Sign in to vote", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`/api/knowledge/answers/${answerId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();

      setQuestion(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          answers: prev.answers.map(a =>
            a.id === answerId
              ? {
                  ...a,
                  votes: data.votes,
                }
              : a
          ),
        };
      });
    } catch {
      toast({ title: "Failed to vote", variant: "destructive" });
    }
  };

  const handleAccept = async (answerId: string) => {
    if (!session || session.user.id !== question?.author.id) return;
    try {
      const res = await fetch(`/api/knowledge/answers/${answerId}/accept`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");

      setQuestion(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          answers: prev.answers.map(a => ({
            ...a,
            isAccepted: a.id === answerId ? !a.isAccepted : false,
          })),
        };
      });
      toast({ title: "Answer accepted!" });
    } catch {
      toast({ title: "Failed to accept answer", variant: "destructive" });
    }
  };

  const handleSubmitAnswer = async () => {
    if (!session) {
      toast({ title: "Sign in to answer", variant: "destructive" });
      return;
    }
    if (!answerText.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/knowledge/questions/${questionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerText }),
      });
      if (!res.ok) throw new Error("Failed");
      const newAnswer = await res.json();

      setQuestion(prev => {
        if (!prev) return prev;
        return { ...prev, answers: [...prev.answers, newAnswer] };
      });
      setAnswerText("");
      toast({ title: "Answer posted!" });
    } catch {
      toast({ title: "Failed to post answer", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="h-8 w-32 bg-void-surface rounded animate-pulse" />
        <div className="rounded-xl border border-void-border bg-void-card p-6 space-y-4">
          <div className="w-3/4 h-6 bg-void-surface rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-3 bg-void-surface rounded animate-pulse" style={{ width: `${90 - i * 10}%` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-void-muted font-mono">Question not found.</p>
        <Button onClick={() => router.push("/knowledge")} variant="outline" className="font-mono mt-4 gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Back to Knowledge Base
        </Button>
      </div>
    );
  }

  const repLevel = question.author.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];
  const hasAcceptedAnswer = question.answers.some(a => a.isAccepted);
  const isAuthor = session?.user?.id === question.author.id;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-mono text-void-muted hover:text-void-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Knowledge Base
      </button>

      {/* Question */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-3 mb-4">
            {hasAcceptedAnswer ? (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-void-green/10 border border-void-green/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-void-green" />
              </div>
            ) : (
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-void-surface border border-void-border flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-void-muted" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-xl font-black text-void-text leading-tight mb-1">
                {question.title}
              </h1>
              <div className="flex items-center gap-3 text-[10px] font-mono text-void-muted">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(question.views)} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  {question.answers.length} answers
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(question.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="prose-void text-sm leading-relaxed mb-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {question.content}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {question.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {question.tags.map(({ tag }) => (
                <Link key={tag.slug} href={`/knowledge?tag=${tag.slug}`}>
                  <Badge variant="secondary" className="text-[10px] hover:border-void-purple/30 transition-colors">
                    #{tag.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {/* Author */}
          <div className="flex items-center gap-2 pt-4 border-t border-void-border/50">
            {question.isDarkMode ? (
              <span className="text-xs font-mono text-void-purple">🖤 {question.darkHandle}</span>
            ) : (
              <>
                <Avatar className="w-6 h-6">
                  <AvatarImage src={question.author.image ?? ""} />
                  <AvatarFallback className="text-[9px]">
                    {getInitials(question.author.name ?? question.author.username)}
                  </AvatarFallback>
                </Avatar>
                <Link
                  href={`/profile/${question.author.username}`}
                  className="text-xs font-mono text-void-muted hover:text-void-text transition-colors"
                >
                  @{question.author.username}
                </Link>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
                  style={{ color: repColor, borderColor: `${repColor}25`, backgroundColor: `${repColor}10` }}
                >
                  {repLevel}
                </span>
              </>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-lg font-black font-mono text-void-text mb-4">
          {question.answers.length} {question.answers.length === 1 ? "Answer" : "Answers"}
        </h2>

        <div className="space-y-4">
          <AnimatePresence>
            {/* Accepted answer first */}
            {[...question.answers]
              .sort((a, b) => {
                if (a.isAccepted) return -1;
                if (b.isAccepted) return 1;
                const aScore = a.votes.reduce((s, v) => s + v.value, 0);
                const bScore = b.votes.reduce((s, v) => s + v.value, 0);
                return bScore - aScore;
              })
              .map((answer, i) => (
                <motion.div
                  key={answer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <AnswerCard
                    answer={answer}
                    isQuestionAuthor={isAuthor}
                    currentUserId={session?.user?.id}
                    onVote={handleVote}
                    onAccept={handleAccept}
                  />
                </motion.div>
              ))}
          </AnimatePresence>

          {question.answers.length === 0 && (
            <div className="text-center py-12 rounded-xl border border-void-border bg-void-surface/30">
              <MessageSquare className="w-10 h-10 text-void-muted mx-auto mb-3" />
              <p className="text-void-muted font-mono text-sm">No answers yet. Be the first to help!</p>
            </div>
          )}
        </div>
      </div>

      {/* Answer form */}
      <Card className="p-6">
        <h3 className="text-base font-black font-mono text-void-text mb-4 flex items-center gap-2">
          <Edit3 className="w-4 h-4 text-void-purple" />
          Your Answer
        </h3>
        <div className="flex gap-3">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback className="text-xs">
              {getInitials(session?.user?.name ?? session?.user?.username ?? "?")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              value={answerText}
              onChange={e => setAnswerText(e.target.value)}
              placeholder={session ? "Write your answer... Markdown supported." : "Sign in to answer"}
              disabled={!session}
              rows={6}
              className="w-full bg-void-surface border border-void-border rounded-xl p-4 text-sm font-mono text-void-text placeholder:text-void-muted resize-none outline-none focus:ring-1 focus:ring-void-purple focus:border-void-purple transition-colors disabled:opacity-50"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs font-mono text-void-muted">
                Markdown supported · Be specific and helpful
              </p>
              <Button
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim() || submitting || !session}
                loading={submitting}
                className="font-mono gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Post Answer
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function AnswerCard({
  answer,
  isQuestionAuthor,
  currentUserId,
  onVote,
  onAccept,
}: {
  answer: Answer;
  isQuestionAuthor: boolean;
  currentUserId?: string;
  onVote: (id: string, value: 1 | -1) => void;
  onAccept: (id: string) => void;
}) {
  const repLevel = answer.author.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];
  const score = answer.votes.reduce((s, v) => s + v.value, 0);
  const userVote = answer.votes.find(v => v.userId === currentUserId)?.value ?? 0;

  return (
    <Card className={cn(
      "p-5 transition-all",
      answer.isAccepted && "border-void-green/30 bg-void-green/5"
    )}>
      <div className="flex gap-4">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onVote(answer.id, 1)}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              userVote === 1
                ? "text-void-green bg-void-green/10"
                : "text-void-muted hover:text-void-green hover:bg-void-green/10"
            )}
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <span className={cn(
            "text-sm font-mono font-bold tabular-nums",
            score > 0 ? "text-void-green" : score < 0 ? "text-red-400" : "text-void-muted"
          )}>
            {score}
          </span>
          <button
            onClick={() => onVote(answer.id, -1)}
            className={cn(
              "p-1.5 rounded-lg transition-all",
              userVote === -1
                ? "text-red-400 bg-red-400/10"
                : "text-void-muted hover:text-red-400 hover:bg-red-400/10"
            )}
          >
            <ChevronDown className="w-5 h-5" />
          </button>

          {/* Accept button */}
          {isQuestionAuthor && (
            <button
              onClick={() => onAccept(answer.id)}
              title={answer.isAccepted ? "Unaccept answer" : "Accept as best answer"}
              className={cn(
                "mt-2 p-1.5 rounded-lg transition-all",
                answer.isAccepted
                  ? "text-void-green bg-void-green/10"
                  : "text-void-muted hover:text-void-green hover:bg-void-green/10"
              )}
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {answer.isAccepted && (
            <div className="flex items-center gap-1.5 mb-3 text-xs font-mono text-void-green">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Accepted answer
            </div>
          )}

          <div className="prose-void text-sm leading-relaxed mb-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {answer.content}
            </ReactMarkdown>
          </div>

          {/* Author */}
          <div className="flex items-center gap-2 pt-3 border-t border-void-border/50">
            <Avatar className="w-6 h-6">
              <AvatarImage src={answer.author.image ?? ""} />
              <AvatarFallback className="text-[9px]">
                {getInitials(answer.author.name ?? answer.author.username)}
              </AvatarFallback>
            </Avatar>
            <Link
              href={`/profile/${answer.author.username}`}
              className="text-xs font-mono text-void-muted hover:text-void-text transition-colors"
            >
              @{answer.author.username}
            </Link>
            <span
              className="text-[9px] font-mono px-1.5 py-0.5 rounded border"
              style={{ color: repColor, borderColor: `${repColor}25`, backgroundColor: `${repColor}10` }}
            >
              {repLevel}
            </span>
            <span className="text-[10px] font-mono text-void-muted ml-auto">
              {formatDate(answer.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
