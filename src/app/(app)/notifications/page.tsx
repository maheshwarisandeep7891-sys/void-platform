"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, Check, CheckCheck, Users, Zap,
  MessageSquare, Star, Trophy, AlertCircle,
  ArrowRight, Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";

interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const NOTIFICATION_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  FOLLOW:               { icon: Users,          color: "text-void-purple", bg: "bg-void-purple/10" },
  REACTION:             { icon: Star,           color: "text-yellow-400",  bg: "bg-yellow-500/10" },
  COMMENT:              { icon: MessageSquare,  color: "text-void-cyan",   bg: "bg-void-cyan/10" },
  MENTION:              { icon: MessageSquare,  color: "text-void-cyan",   bg: "bg-void-cyan/10" },
  BOUNTY_SUBMISSION:    { icon: Zap,            color: "text-yellow-400",  bg: "bg-yellow-500/10" },
  TRANSACTION_UPDATE:   { icon: Zap,            color: "text-void-green",  bg: "bg-void-green/10" },
  GUILD_INVITE:         { icon: Users,          color: "text-void-purple", bg: "bg-void-purple/10" },
  HACKATHON_INVITE:     { icon: Zap,            color: "text-void-green",  bg: "bg-void-green/10" },
  ANSWER_ACCEPTED:      { icon: Check,          color: "text-void-green",  bg: "bg-void-green/10" },
  REPUTATION_MILESTONE: { icon: Trophy,         color: "text-yellow-400",  bg: "bg-yellow-500/10" },
  SYSTEM:               { icon: AlertCircle,    color: "text-void-muted",  bg: "bg-void-surface" },
};

export default function NotificationsPage() {
  const router = useRouter();
  const { refresh } = useNotifications();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/notifications${filter === "unread" ? "?unread=true" : ""}`);
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setNotifications(data.notifications ?? []);
        setUnreadCount(data.unreadCount ?? 0);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [filter]);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      refresh();
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
      refresh();
    } catch {}
  };

  const handleClick = (notification: Notification) => {
    if (!notification.isRead) markRead(notification.id);
    if (notification.link) router.push(notification.link);
  };

  // Group by date
  const grouped = notifications.reduce((acc, n) => {
    const date = new Date(n.createdAt);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
    const key = diffDays === 0 ? "Today" : diffDays === 1 ? "Yesterday" : diffDays < 7 ? "This week" : "Older";
    if (!acc[key]) acc[key] = [];
    acc[key].push(n);
    return acc;
  }, {} as Record<string, Notification[]>);

  const groupOrder = ["Today", "Yesterday", "This week", "Older"];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black font-mono text-void-text">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="tabular-nums">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="font-mono gap-1.5 text-xs">
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 bg-void-surface rounded-xl border border-void-border mb-6">
        {(["all", "unread"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-xs font-mono transition-all",
              filter === f ? "bg-void-card text-void-text border border-void-border shadow-sm" : "text-void-muted hover:text-void-text"
            )}
          >
            {f === "all" ? "All" : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
          </button>
        ))}
      </div>

      {/* Notifications */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-void-surface rounded-xl animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-void-surface border border-void-border flex items-center justify-center mx-auto mb-4">
            <Bell className="w-8 h-8 text-void-muted" />
          </div>
          <p className="text-void-text font-mono font-bold mb-1">All caught up</p>
          <p className="text-void-muted font-mono text-sm">No {filter === "unread" ? "unread " : ""}notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {groupOrder.filter(g => grouped[g]?.length > 0).map(group => (
            <div key={group}>
              <p className="text-[10px] font-mono text-void-muted uppercase tracking-wider mb-2 px-1">{group}</p>
              <div className="space-y-1">
                <AnimatePresence>
                  {grouped[group].map((notification, i) => {
                    const config = NOTIFICATION_CONFIG[notification.type] ?? NOTIFICATION_CONFIG.SYSTEM;
                    const Icon = config.icon;
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: i * 0.02 }}
                      >
                        <div
                          onClick={() => handleClick(notification)}
                          className={cn(
                            "flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer group",
                            notification.isRead
                              ? "border-void-border bg-void-card hover:border-void-border/80 hover:bg-void-surface/50"
                              : "border-void-purple/20 bg-void-purple/5 hover:border-void-purple/30"
                          )}
                        >
                          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", config.bg)}>
                            <Icon className={cn("w-4 h-4", config.color)} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-mono leading-snug",
                              notification.isRead ? "text-void-muted" : "text-void-text font-bold"
                            )}>
                              {notification.title}
                            </p>
                            {notification.body && (
                              <p className="text-xs text-void-muted mt-0.5 line-clamp-2 leading-relaxed">
                                {notification.body}
                              </p>
                            )}
                            <p className="text-[10px] font-mono text-void-muted/60 mt-1">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {!notification.isRead && (
                              <span className="w-2 h-2 bg-void-purple rounded-full" />
                            )}
                            {notification.link && (
                              <ArrowRight className="w-3.5 h-3.5 text-void-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
