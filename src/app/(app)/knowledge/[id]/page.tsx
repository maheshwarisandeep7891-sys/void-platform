"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Clock,
  Eye,
  MessageSquare,
  RefreshCw,
  Send,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate, getInitials, REPUTATION_COLORS } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Answer {
  id: string;
  content: string;
  isAccepted: boolean;
  stillWorksAt?: string;
  createdAt: string;
  author: { id: string; username: string; name?: string; image?: string; reputation?: { score: number; level: string } };
  votes: { value: number; userId: string }[];
  _count?: { votes: number };
}

interface Question {
  id: string;
  title: string;
  content: string;
  isDarkMode: boolean;
  darkHandle?: string;
  views: number;
  createdAt: string;
  author: { id: string; username: string; name?: string; image?: string; reputation?: { score: number; level: string } };
  tags: { tag: { name: string; slug: string } }[];
  answers: Answer[];
}

export default function QuestionPage() {
  const params = useParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [answerContent, setAnswerContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/knowledge/questions/${params.id}`)
      .then((r) => r.json())
      .then(setQuestion)
      .catch(() => setQuestion(null))
      .finally(() => setLoading(false));
  }, [params.id]);

  const submitAnswer = async () => {
    if (!answerContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/knowledge/questions/${params.id}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: answerContent }),
      });
      if (!res.ok) throw new Error("Failed to post answer");
      const answer = await res.json();
      setQuestion((q) => q ? { ...q, answers: [...q.answers, answer] } : q);
      setAnswerContent("");
      toast({ title: "Answer posted!", variant: "success" });
    } catch {
      toast({ title: "Failed to post answer", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const voteAnswer = async (answerId: string, value: 1 | -1) => {
    if (!session) { toast({ title: "Sign in to vote", variant: "destructive" }); return; }
    try {
      await fetch(`/api/knowledge/answers/${answerId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      // Optimistic update
      setQuestion((q) => q ? {
        ...q,
        answers: q.answers.map((a) =>
          a.id === answerId
            ? { ...a, votes: [...a.votes.filter((v) => v.userId !== (session.user as any)?.id), { value, userId: (session.user as any)?.id ?? "" }] }
            : a
        ),
      } : q);
    } catch {}
  };

  const acceptAnswer = async (answerId: string) => {
    if (!session || (session.user as any)?.id !== question?.author.id) return;
    try {
      await fetch(`/api/knowledge/answers/${answerId}/accept`, { method: "POST" });
      setQuestion((q) => q ? {
        ...q,
        answers: q.answers.map((a) => ({ ...a, isAccepted: a.id === answerId })),
      } : q);
      toast({ title: "Answer accepted!", variant: "success" });
    } catch {}
  };

  const markStillWorks = async (answerId: string) => {
    try {
      await fetch(`/api/knowledge/answers/${answerId}/still-works`, { method: "POST" });
      setQuestion((q) => q ? {
        ...q,
        answers: q.answers.map((a) =>
          a.id === answerId ? { ...a, stillWorksAt: new Date().toISOString() } : a
        ),
      } : q);
      toast({ title: "Marked as still working!", variant: "success" });
    } catch {}
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="space-y-4">
          <div className="h-8 w-48 bg-void-surface rounded animate-pulse" />
          <div className="h-48 bg-void-surface rounded-xl animate-pulse" />
          <div className="h-32 bg-void-surface rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-void-muted font-mono">Question not found.</p>
      </div>
    );
  }

  const isAuthor = session?.user?.id === question.author.id;
  const repLevel = question.author.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Link href="/knowledge" className="inline-flex items-center gap-1.5 text-sm font-mono text-void-muted hover:text-void-text transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to knowledge base
      </Link>

      {/* Question */}
      <Card className="p-6 mb-6">
        <h1 className="text-xl font-black text-void-text mb-4">{question.title}</h1>

        <div className="prose-void text-sm mb-4">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.content}</ReactMarkdown>
        </div>

        {/* Tags */}
        {question.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {question.tags.map(({ tag }) => (
              <Badge key={tag.slug} variant="secondary" className="text-[10px]">#{tag.name}</Badge>
            ))}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 pt-4 border-t border-void-border">
          {question.isDarkMode ? (
            <span className="text-xs font-mono text-void-purple">🖤 {question.darkHandle}</span>
          ) : (
            <>
              <Avatar className="w-6 h-6">
                <AvatarImage src={question.author.image ?? ""} />
                <AvatarFallback className="text-[8px]">{getInitials(question.author.name ?? question.author.username)}</AvatarFallback>
              </Avatar>
              <Link href={`/profile/${question.author.username}`} className="text-xs font-mono text-void-muted hover:text-void-text transition-colors">
                @{question.author.username}
              </Link>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border" style={{ color: repColor, borderColor: `${repColor}30`, backgroundColor: `${repColor}10` }}>
                {repLevel}
              </span>
            </>
          )}
          <span className="text-xs font-mono text-void-muted ml-auto">{formatDate(question.createdAt)}</span>
          <span className="flex items-center gap-1 text-xs font-mono text-void-muted">
            <Eye className="w-3 h-3" />{question.views}
          </span>
        </div>
      </Card>

      {/* Answers */}
      <div className="mb-6">
        <h2 className="text-sm font-mono font-bold text-void-muted uppercase tracking-wider mb-4">
          {question.answers.length} Answer{question.answers.length !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-4">
          {question.answers
            .sort((a, b) => (b.isAccepted ? 1 : 0) - (a.isAccepted ? 1 : 0) ||
              b.votes.reduce((s, v) => s + v.value, 0) - a.votes.reduce((s, v) => s + v.value, 0))
            .map((answer) => {
              const voteScore = answer.votes.reduce((s, v) => s + v.value, 0);
              const userVote = answer.votes.find((v) => v.userId === session?.user?.id)?.value;
              const answerRepLevel = answer.author.reputation?.level ?? "NEWCOMER";
              const answerRepColor = REPUTATION_COLORS[answerRepLevel];

              return (
                <motion.div key={answer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <Card className={cn("p-5", answer.isAccepted && "border-void-green/30 bg-void-green/5")}>
                    <div className="flex gap-4">
                      {/* Vote column */}
                      <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => voteAnswer(answer.id, 1)}
                          className={cn("p-1 rounded transition-colors", userVote === 1 ? "text-void-green" : "text-void-muted hover:text-void-text")}
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                        <span className={cn("text-sm font-mono font-bold tabular-nums", voteScore > 0 ? "text-void-green" : voteScore < 0 ? "text-red-400" : "text-void-muted")}>
                          {voteScore}
                        </span>
                        <button
                          onClick={() => voteAnswer(answer.id, -1)}
                          className={cn("p-1 rounded transition-colors", userVote === -1 ? "text-red-400" : "text-void-muted hover:text-void-text")}
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        {answer.isAccepted && (
                          <CheckCircle2 className="w-5 h-5 text-void-green mt-1" aria-label="Accepted answer" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="prose-void text-sm mb-4">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer.content}</ReactMarkdown>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-3 border-t border-void-border">
                          <Avatar className="w-5 h-5">
                            <AvatarImage src={answer.author.image ?? ""} />
                            <AvatarFallback className="text-[8px]">{getInitials(answer.author.name ?? answer.author.username)}</AvatarFallback>
                          </Avatar>
                          <Link href={`/profile/${answer.author.username}`} className="text-xs font-mono text-void-muted hover:text-void-text transition-colors">
                            @{answer.author.username}
                          </Link>
                          <span className="text-xs font-mono text-void-muted">{formatDate(answer.createdAt)}</span>

                          <div className="ml-auto flex items-center gap-2">
                            {/* Still works button */}
                            <button
                              onClick={() => markStillWorks(answer.id)}
                              className={cn(
                                "flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md border transition-all",
                                answer.stillWorksAt
                                  ? "text-void-green border-void-green/20 bg-void-green/5"
                                  : "text-void-muted border-void-border hover:border-void-green/30 hover:text-void-green"
                              )}
                              title="Confirm this still works"
                            >
                              <RefreshCw className="w-3 h-3" />
                              {answer.stillWorksAt ? `Still works (${new Date(answer.stillWorksAt).getFullYear()})` : "Still works?"}
                            </button>

                            {/* Accept answer (question author only) */}
                            {isAuthor && !answer.isAccepted && (
                              <button
                                onClick={() => acceptAnswer(answer.id)}
                                className="flex items-center gap-1 text-[10px] font-mono px-2 py-1 rounded-md border border-void-border text-void-muted hover:border-void-green/30 hover:text-void-green transition-all"
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                Accept
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Answer form */}
      {session ? (
        <Card className="p-5">
          <h3 className="text-sm font-mono font-bold text-void-text mb-3">Your Answer</h3>
          <Textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="Write your answer... (Markdown supported)"
            className="min-h-[150px] mb-3"
          />
          <div className="flex justify-end">
            <Button onClick={submitAnswer} loading={submitting} className="font-mono gap-1.5">
              <Send className="w-3.5 h-3.5" />
              Post Answer
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-5 text-center">
          <p className="text-void-muted font-mono text-sm mb-3">Sign in to post an answer</p>
          <Link href="/auth/signin">
            <Button className="font-mono">Sign in</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
