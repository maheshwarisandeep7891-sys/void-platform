"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Users,
  Zap,
  MessageSquare,
  Star,
  Trophy,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";

interface Notification {
  id: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  FOLLOW: Users,
  REACTION: Star,
  COMMENT: MessageSquare,
  MENTION: MessageSquare,
  BOUNTY_SUBMISSION: Zap,
  TRANSACTION_UPDATE: Zap,
  GUILD_INVITE: Users,
  HACKATHON_INVITE: Zap,
  ANSWER_ACCEPTED: Check,
  REPUTATION_MILESTONE: Trophy,
  SYSTEM: AlertCircle,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/notifications");
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
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const markRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id] }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-black font-mono text-void-text">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="tabular-nums">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={markAllRead}
            className="font-mono gap-1.5 text-xs"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-void-surface rounded-xl animate-pulse" />
            ))
          : notifications.length === 0
          ? (
            <div className="text-center py-16">
              <Bell className="w-12 h-12 text-void-muted mx-auto mb-4" />
              <p className="text-void-muted font-mono">No notifications yet.</p>
            </div>
          )
          : notifications.map((notification, i) => {
              const Icon = NOTIFICATION_ICONS[notification.type] ?? Bell;
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer",
                      notification.isRead
                        ? "border-void-border bg-void-card"
                        : "border-void-purple/20 bg-void-purple/5"
                    )}
                    onClick={() => {
                      if (!notification.isRead) markRead(notification.id);
                    }}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                        notification.isRead
                          ? "bg-void-surface"
                          : "bg-void-purple/10"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          notification.isRead
                            ? "text-void-muted"
                            : "text-void-purple"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm font-mono",
                          notification.isRead
                            ? "text-void-muted"
                            : "text-void-text font-bold"
                        )}
                      >
                        {notification.title}
                      </p>
                      {notification.body && (
                        <p className="text-xs text-void-muted mt-0.5 line-clamp-2">
                          {notification.body}
                        </p>
                      )}
                      <p className="text-[10px] font-mono text-void-muted mt-1">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {notification.link && (
                      <Link
                        href={notification.link}
                        className="text-xs font-mono text-void-purple hover:underline flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View →
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
      </div>
    </div>
  );
}
