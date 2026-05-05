"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Zap, Crown, Medal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatNumber, getInitials, REPUTATION_COLORS } from "@/lib/utils";

interface LeaderboardUser {
  id: string;
  username: string;
  name?: string;
  image?: string;
  techStack: string[];
  reputation: { score: number; level: string };
  _count: { posts: number; followers: number };
}

const LEVEL_ICONS: Record<string, React.ElementType> = {
  LEGEND: Crown,
  ARCHITECT: Trophy,
  HACKER: Zap,
  BUILDER: Medal,
  NEWCOMER: Medal,
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    fetch(`/api/leaderboard?period=${period}`)
      .then(r => r.json())
      .then(d => setUsers(d.users ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text tracking-tight">Leaderboard</h1>
          <p className="text-xs font-mono text-void-muted mt-0.5">Top contributors by reputation</p>
        </div>
        <div className="flex gap-1.5 p-1 bg-void-surface rounded-xl border border-void-border">
          {["week", "month", "all"].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono transition-all",
                period === p ? "bg-void-card text-void-text border border-void-border shadow-sm" : "text-void-muted hover:text-void-text"
              )}
            >
              {p === "all" ? "All time" : `This ${p}`}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      {!loading && users.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[users[1], users[0], users[2]].map((user, i) => {
            const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
            const repColor = REPUTATION_COLORS[user.reputation.level];
            const LevelIcon = LEVEL_ICONS[user.reputation.level] ?? Medal;
            const heights = ["h-28", "h-36", "h-24"];
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex flex-col items-center justify-end p-4 rounded-2xl border transition-all",
                  rank === 1
                    ? "border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-transparent"
                    : "border-void-border bg-void-card"
                )}
              >
                <div className="relative mb-3">
                  <Avatar className={cn("border-2", rank === 1 ? "w-14 h-14 border-yellow-500/50" : "w-12 h-12 border-void-border")}>
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback className="text-sm">{getInitials(user.name ?? user.username)}</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black",
                      rank === 1 ? "bg-yellow-500 text-void-bg" :
                      rank === 2 ? "bg-void-muted text-void-bg" :
                      "bg-amber-700 text-void-bg"
                    )}
                  >
                    {rank}
                  </div>
                </div>
                <Link href={`/profile/${user.username}`} className="text-sm font-mono font-bold text-void-text hover:text-void-purple transition-colors text-center">
                  @{user.username}
                </Link>
                <span className="text-[10px] font-mono mt-0.5" style={{ color: repColor }}>
                  {user.reputation.level}
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <LevelIcon className="w-3 h-3" style={{ color: repColor }} />
                  <span className="text-base font-black font-mono tabular-nums" style={{ color: repColor }}>
                    {formatNumber(user.reputation.score)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-2">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 bg-void-surface rounded-xl animate-pulse" />
            ))
          : users.map((user, i) => {
              const repColor = REPUTATION_COLORS[user.reputation.level];
              const LevelIcon = LEVEL_ICONS[user.reputation.level] ?? Medal;
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link href={`/profile/${user.username}`}>
                    <div className="flex items-center gap-4 p-4 rounded-xl border border-void-border bg-void-card hover:border-void-purple/30 hover:bg-void-surface/50 transition-all group">
                      <span className="text-sm font-mono text-void-muted w-6 text-right tabular-nums font-bold">
                        {i + 1}
                      </span>
                      <Avatar className="w-9 h-9 border border-void-border">
                        <AvatarImage src={user.image ?? ""} />
                        <AvatarFallback className="text-xs">{getInitials(user.name ?? user.username)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono font-bold text-void-text group-hover:text-void-purple transition-colors">
                          @{user.username}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono" style={{ color: repColor }}>{user.reputation.level}</span>
                          {user.techStack.slice(0, 3).map(tech => (
                            <span key={tech} className="text-[9px] font-mono text-void-muted">{tech}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-right">
                        <LevelIcon className="w-4 h-4" style={{ color: repColor }} />
                        <div>
                          <div className="text-base font-black font-mono tabular-nums" style={{ color: repColor }}>
                            {formatNumber(user.reputation.score)}
                          </div>
                          <div className="text-[9px] font-mono text-void-muted">pts</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}
