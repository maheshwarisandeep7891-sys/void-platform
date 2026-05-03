"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Trophy, Medal, Star, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/leaderboard?period=${period}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setUsers(data.users ?? []);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [period]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text">
            Leaderboard
          </h1>
          <p className="text-sm font-mono text-void-muted">
            Top contributors by reputation
          </p>
        </div>
        <div className="flex gap-1.5">
          {["week", "month", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono transition-all",
                period === p
                  ? "bg-void-surface text-void-text border border-void-border"
                  : "text-void-muted hover:text-void-text"
              )}
            >
              {p === "all" ? "All time" : `This ${p}`}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 podium */}
      {!loading && users.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[users[1], users[0], users[2]].map((user, i) => {
            const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
            const repColor = REPUTATION_COLORS[user.reputation.level];
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex flex-col items-center p-4 rounded-xl border",
                  rank === 1
                    ? "border-void-yellow/30 bg-void-yellow/5 mt-0"
                    : "border-void-border bg-void-card mt-4"
                )}
              >
                <div className="relative mb-3">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={user.image ?? ""} />
                    <AvatarFallback>
                      {getInitials(user.name ?? user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      "absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-black",
                      rank === 1
                        ? "bg-void-yellow text-void-bg"
                        : rank === 2
                        ? "bg-void-muted text-void-bg"
                        : "bg-amber-700 text-void-bg"
                    )}
                  >
                    {rank}
                  </div>
                </div>
                <Link
                  href={`/profile/${user.username}`}
                  className="text-sm font-mono font-bold text-void-text hover:text-void-purple transition-colors text-center"
                >
                  @{user.username}
                </Link>
                <span
                  className="text-xs font-mono mt-1"
                  style={{ color: repColor }}
                >
                  {user.reputation.level}
                </span>
                <span className="text-lg font-black font-mono text-void-text tabular-nums mt-1">
                  {formatNumber(user.reputation.score)}
                </span>
                <span className="text-[10px] font-mono text-void-muted">pts</span>
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
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="p-4 hover:border-void-border/80 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono text-void-muted w-6 text-right tabular-nums">
                        {i + 1}
                      </span>
                      <Avatar className="w-9 h-9">
                        <AvatarImage src={user.image ?? ""} />
                        <AvatarFallback className="text-xs">
                          {getInitials(user.name ?? user.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/profile/${user.username}`}
                          className="text-sm font-mono font-bold text-void-text hover:text-void-purple transition-colors"
                        >
                          @{user.username}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className="text-[10px] font-mono"
                            style={{ color: repColor }}
                          >
                            {user.reputation.level}
                          </span>
                          {user.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] font-mono text-void-muted"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black font-mono text-void-text tabular-nums">
                          {formatNumber(user.reputation.score)}
                        </div>
                        <div className="text-[10px] font-mono text-void-muted">pts</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}
