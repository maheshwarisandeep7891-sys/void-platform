"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, Search, Lock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, getInitials } from "@/lib/utils";

interface Conversation {
  userId: string;
  username: string;
  name?: string;
  image?: string;
  lastMessage: string;
  lastMessageAt: string;
  unread: number;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/messages")
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations ?? []))
      .catch(() => setConversations([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = conversations.filter(
    (c) =>
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black font-mono text-void-text">Messages</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <Lock className="w-3 h-3 text-void-green" />
            <p className="text-xs font-mono text-void-green">End-to-end encrypted</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search conversations..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-void-border bg-void-surface text-void-text placeholder:text-void-muted font-mono text-sm focus:outline-none focus:ring-1 focus:ring-void-purple transition-colors"
        />
      </div>

      {/* Conversations */}
      <div className="space-y-1">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-void-surface rounded-xl animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <MessageSquare className="w-12 h-12 text-void-muted mx-auto mb-4" />
            <p className="text-void-muted font-mono">No messages yet.</p>
            <p className="text-void-muted/60 font-mono text-xs mt-1">
              Visit someone&apos;s profile to start a conversation.
            </p>
          </div>
        ) : (
          filtered.map((conv, i) => (
            <motion.div
              key={conv.userId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Link
                href={`/messages/${conv.username}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-void-surface transition-colors"
              >
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={conv.image ?? ""} />
                    <AvatarFallback className="text-xs">
                      {getInitials(conv.name ?? conv.username)}
                    </AvatarFallback>
                  </Avatar>
                  {conv.unread > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-void-purple rounded-full text-[9px] font-mono text-void-bg flex items-center justify-center">
                      {conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={cn("text-sm font-mono", conv.unread > 0 ? "text-void-text font-bold" : "text-void-text")}>
                      @{conv.username}
                    </span>
                    <span className="text-[10px] font-mono text-void-muted">
                      {formatDate(conv.lastMessageAt)}
                    </span>
                  </div>
                  <p className={cn("text-xs font-mono truncate mt-0.5", conv.unread > 0 ? "text-void-muted" : "text-void-muted/60")}>
                    {conv.lastMessage}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
