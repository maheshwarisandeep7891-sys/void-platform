"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap,
  Plus,
  Clock,
  CheckCircle2,
  DollarSign,
  Search,
  ChevronDown,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatCurrency, formatDate, getInitials, REPUTATION_COLORS } from "@/lib/utils";

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
  _count: { submissions: number };
}

export default function BountiesPage() {
  const [bounties, setBounties] = useState<Bounty[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("OPEN");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBounties = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({ status, ...(search && { search }) });
        const res = await fetch(`/api/bounties?${params}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setBounties(data.bounties ?? []);
      } catch {
        setBounties([]);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(fetchBounties, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [status, search]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text">Bounties</h1>
          <p className="text-sm font-mono text-void-muted">
            Post problems, earn rewards
          </p>
        </div>
        <Link href="/bounties/new">
          <Button size="sm" className="gap-1.5 font-mono">
            <Plus className="w-3.5 h-3.5" />
            Post Bounty
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bounties..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-void-border bg-void-surface text-void-text placeholder:text-void-muted font-mono text-sm focus:outline-none focus:ring-1 focus:ring-void-purple transition-colors"
        />
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6">
        {["OPEN", "IN_PROGRESS", "COMPLETED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-mono transition-all",
              status === s
                ? "bg-void-surface text-void-text border border-void-border"
                : "text-void-muted hover:text-void-text"
            )}
          >
            {s.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Bounties */}
      <div className="space-y-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-void-surface rounded-xl animate-pulse" />
            ))
          : bounties.length === 0
          ? (
            <div className="text-center py-16">
              <Zap className="w-12 h-12 text-void-muted mx-auto mb-4" />
              <p className="text-void-muted font-mono">No bounties found.</p>
            </div>
          )
          : bounties.map((bounty, i) => (
              <motion.div
                key={bounty.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <BountyCard bounty={bounty} />
              </motion.div>
            ))}
      </div>
    </div>
  );
}

function BountyCard({ bounty }: { bounty: Bounty }) {
  const repLevel = bounty.author.reputation?.level ?? "NEWCOMER";
  const repColor = REPUTATION_COLORS[repLevel];
  const isExpired = bounty.expiresAt && new Date(bounty.expiresAt) < new Date();

  return (
    <Card hover className="p-5 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Link href={`/bounties/${bounty.id}`}>
            <h3 className="text-base font-bold text-void-text mb-1 group-hover:text-void-purple transition-colors line-clamp-2">
              {bounty.title}
            </h3>
          </Link>
          <p className="text-sm text-void-muted line-clamp-2">
            {bounty.description.replace(/[#*`]/g, "").slice(0, 200)}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 text-right">
          <div className="text-xl font-black font-mono text-void-green tabular-nums">
            {formatCurrency(bounty.reward, bounty.currency)}
          </div>
          <div className="text-[10px] font-mono text-void-muted">reward</div>
        </div>
      </div>

      {/* Tags */}
      {bounty.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {bounty.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              #{tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 pt-3 border-t border-void-border">
        <Avatar className="w-5 h-5">
          <AvatarImage src={bounty.author.image ?? ""} />
          <AvatarFallback className="text-[8px]">
            {getInitials(bounty.author.name ?? bounty.author.username)}
          </AvatarFallback>
        </Avatar>
        <Link
          href={`/profile/${bounty.author.username}`}
          className="text-xs font-mono text-void-muted hover:text-void-text transition-colors"
        >
          @{bounty.author.username}
        </Link>
        <span className="text-xs font-mono text-void-muted">
          · {bounty._count.submissions} submissions
        </span>
        <span className="text-xs font-mono text-void-muted ml-auto">
          {formatDate(bounty.createdAt)}
        </span>
        {bounty.expiresAt && (
          <span className={cn(
            "text-xs font-mono",
            isExpired ? "text-red-400" : "text-void-muted"
          )}>
            {isExpired ? "Expired" : `Expires ${formatDate(bounty.expiresAt)}`}
          </span>
        )}
        <Badge
          variant={
            bounty.status === "OPEN"
              ? "green"
              : bounty.status === "COMPLETED"
              ? "secondary"
              : "cyan"
          }
          className="text-[10px]"
        >
          {bounty.status}
        </Badge>
      </div>
    </Card>
  );
}
