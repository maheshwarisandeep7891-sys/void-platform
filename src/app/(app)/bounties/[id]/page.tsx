"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Zap, Clock, CheckCircle2, Users,
  Send, DollarSign, ExternalLink, Plus, X,
} from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn, formatCurrency, formatDate, formatNumber, getInitials, REPUTATION_COLORS } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  content: string;
  links: string[];
  isAccepted: boolean;
  createdAt: string;
  submitter: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    reputation?: { score: number; level: string };
  };
}

interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  currency: string;
  status: string;
  tags: string[];
  createdAt: string;
  expiresAt?: string;
  author: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    reputation?: { score: number; level: string };
  };
  submissions: Submission[];
  _count: { submissions: number };
}

export default function BountyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [bounty, setBounty] = useState<Bounty | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submission, setSubmission] = useState({ content: "", links: [""] });

  const bountyId = params.id as string;

  useEffect(() => {
    const fetchBounty = async () => {
      try {
        const res = await fetch(`/api/bounties/${bountyId}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setBounty(data);
      } catch {
        setBounty(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBounty();
  }, [bountyId]);

  const handleSubmit = async () => {
    if (!session) {
      toast({ title: "Sign in to submit", variant: "destructive" });
      return;
    }
    if (!submission.content.trim()) {
      toast({ title: "Submission content is required", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/bounties/${bountyId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: submission.content,
          links: submission.links.filter(l => l.trim()),
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const newSub = await res.json();
      setBounty(prev => prev ? {
        ...prev,
        submissions: [...prev.submissions, newSub],
        _count: { submissions: prev._count.submissions + 1 },
      } : prev);
      setSubmission({ content: "", links: [""] });
      setShowSubmitForm(false);
      toast({ title: "Submission posted!" });
    } catch {
      toast({ title: "Failed to submit", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAcceptSubmission = async (submissionId: string) => {
    try {
      const res = await fetch(`/api/bounties/${bountyId}/submissions/${submissionId}/accept`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed");
      setBounty(prev => prev ? {
        ...prev,
        status: "COMPLETED",
        submissions: prev.submissions.map(s => ({
          ...s,
          isAccepted: s.id === submissionId,
        })),
      } : prev);
      toast({ title: "Submission accepted! Bounty completed." });
    } catch {
      toast({ title: "Failed to accept submission", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <div className="h-8 w-32 bg-void-surface rounded animate-pulse" />
        <div className="h-48 bg-void-surface rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!bounty) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-void-muted font-mono">Bounty not found.</p>
        <Button onClick={() => router.push("/bounties")} variant="outline" className="font-mono mt-4 gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          Back to Bounties
        </Button>
      </div>
    );
  }

  const isAuthor = session?.user?.id === bounty.author.id;
  const isExpired = bounty.expiresAt && new Date(bounty.expiresAt) < new Date();
  const repLevel = bounty.author.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm font-mono text-void-muted hover:text-void-text transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Bounties
      </button>

      {/* Bounty card */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={bounty.status === "OPEN" ? "green" : bounty.status === "COMPLETED" ? "secondary" : "cyan"}
                  className="text-xs"
                >
                  {bounty.status}
                </Badge>
                {isExpired && <Badge variant="red" className="text-xs">Expired</Badge>}
              </div>
              <h1 className="text-2xl font-black text-void-text leading-tight">
                {bounty.title}
              </h1>
            </div>
            <div className="ml-6 text-right flex-shrink-0">
              <div className="text-3xl font-black font-mono text-void-green tabular-nums">
                {formatCurrency(bounty.reward, bounty.currency)}
              </div>
              <div className="text-xs font-mono text-void-muted">reward</div>
            </div>
          </div>

          <div className="prose-void text-sm leading-relaxed mb-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {bounty.description}
            </ReactMarkdown>
          </div>

          {bounty.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {bounty.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px]">#{tag}</Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-void-border/50">
            <Avatar className="w-6 h-6">
              <AvatarImage src={bounty.author.image ?? ""} />
              <AvatarFallback className="text-[9px]">
                {getInitials(bounty.author.name ?? bounty.author.username)}
              </AvatarFallback>
            </Avatar>
            <Link href={`/profile/${bounty.author.username}`} className="text-xs font-mono text-void-muted hover:text-void-text transition-colors">
              @{bounty.author.username}
            </Link>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ color: repColor, borderColor: `${repColor}25`, backgroundColor: `${repColor}10` }}>
              {repLevel}
            </span>
            <span className="text-xs font-mono text-void-muted ml-auto flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(bounty.createdAt)}
            </span>
            {bounty.expiresAt && !isExpired && (
              <span className="text-xs font-mono text-void-muted flex items-center gap-1">
                Expires {formatDate(bounty.expiresAt)}
              </span>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Submissions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black font-mono text-void-text">
            {bounty._count.submissions} {bounty._count.submissions === 1 ? "Submission" : "Submissions"}
          </h2>
          {bounty.status === "OPEN" && !isAuthor && !isExpired && (
            <Button
              size="sm"
              onClick={() => setShowSubmitForm(p => !p)}
              className="font-mono gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Solution
            </Button>
          )}
        </div>

        {/* Submit form */}
        <AnimatePresence>
          {showSubmitForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <Card className="p-5">
                <h3 className="text-sm font-mono font-bold text-void-text mb-3">Your Solution</h3>
                <textarea
                  value={submission.content}
                  onChange={e => setSubmission(p => ({ ...p, content: e.target.value }))}
                  placeholder="Describe your solution in detail. Include code, links, and explanation..."
                  rows={6}
                  className="w-full bg-void-surface border border-void-border rounded-xl p-4 text-sm font-mono text-void-text placeholder:text-void-muted resize-none outline-none focus:ring-1 focus:ring-void-purple focus:border-void-purple transition-colors mb-3"
                />
                <div className="mb-3">
                  <label className="text-xs font-mono text-void-muted mb-2 block">Links (optional)</label>
                  {submission.links.map((link, i) => (
                    <div key={i} className="flex gap-2 mb-2">
                      <Input
                        value={link}
                        onChange={e => {
                          const newLinks = [...submission.links];
                          newLinks[i] = e.target.value;
                          setSubmission(p => ({ ...p, links: newLinks }));
                        }}
                        placeholder="https://github.com/..."
                        className="font-mono flex-1"
                      />
                      {submission.links.length > 1 && (
                        <button
                          onClick={() => setSubmission(p => ({ ...p, links: p.links.filter((_, j) => j !== i) }))}
                          className="text-void-muted hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {submission.links.length < 5 && (
                    <button
                      onClick={() => setSubmission(p => ({ ...p, links: [...p.links, ""] }))}
                      className="text-xs font-mono text-void-muted hover:text-void-text transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add link
                    </button>
                  )}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowSubmitForm(false)} className="font-mono">
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!submission.content.trim() || submitting}
                    loading={submitting}
                    className="font-mono gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {bounty.submissions.map((sub, i) => {
            const subRepLevel = sub.submitter.reputation?.level ?? "NEWCOMER";
            const subRepColor = REPUTATION_COLORS[subRepLevel];
            return (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className={cn("p-5", sub.isAccepted && "border-void-green/30 bg-void-green/5")}>
                  {sub.isAccepted && (
                    <div className="flex items-center gap-1.5 mb-3 text-xs font-mono text-void-green">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Accepted solution
                    </div>
                  )}
                  <div className="prose-void text-sm leading-relaxed mb-3">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{sub.content}</ReactMarkdown>
                  </div>
                  {sub.links.filter(l => l).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {sub.links.filter(l => l).map((link, j) => (
                        <a
                          key={j}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-mono text-void-cyan hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {link.replace(/^https?:\/\//, "").slice(0, 40)}
                        </a>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-3 border-t border-void-border/50">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src={sub.submitter.image ?? ""} />
                      <AvatarFallback className="text-[8px]">
                        {getInitials(sub.submitter.name ?? sub.submitter.username)}
                      </AvatarFallback>
                    </Avatar>
                    <Link href={`/profile/${sub.submitter.username}`} className="text-xs font-mono text-void-muted hover:text-void-text transition-colors">
                      @{sub.submitter.username}
                    </Link>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border" style={{ color: subRepColor, borderColor: `${subRepColor}25`, backgroundColor: `${subRepColor}10` }}>
                      {subRepLevel}
                    </span>
                    <span className="text-xs font-mono text-void-muted ml-auto">
                      {formatDate(sub.createdAt)}
                    </span>
                    {isAuthor && bounty.status === "OPEN" && !sub.isAccepted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAcceptSubmission(sub.id)}
                        className="font-mono gap-1 text-void-green border-void-green/30 hover:bg-void-green/10"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Accept
                      </Button>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}

          {bounty.submissions.length === 0 && (
            <div className="text-center py-12 rounded-xl border border-void-border bg-void-surface/30">
              <Zap className="w-10 h-10 text-void-muted mx-auto mb-3" />
              <p className="text-void-muted font-mono text-sm">No submissions yet. Be the first to solve it!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
