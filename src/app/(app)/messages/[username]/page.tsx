"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Send, Lock } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, formatDate, getInitials } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
}

export default function DMThreadPage() {
  const params = useParams();
  const { data: session } = useSession();
  const { toast } = useToast();
  const username = params.username as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/messages/${username}`).then((r) => r.json()),
      fetch(`/api/users/${username}`).then((r) => r.json()),
    ])
      .then(([msgs, user]) => {
        setMessages(msgs.messages ?? []);
        setOtherUser(user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!content.trim()) return;
    setSending(true);
    try {
      const res = await fetch(`/api/messages/${username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error("Failed to send");
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setContent("");
    } catch {
      toast({ title: "Failed to send message", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const myId = session?.user?.id;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-void-border bg-void-bg/80 backdrop-blur-sm">
        <Link href="/messages" className="text-void-muted hover:text-void-text transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        {otherUser && (
          <>
            <Avatar className="w-8 h-8">
              <AvatarImage src={otherUser.image ?? ""} />
              <AvatarFallback className="text-xs">{getInitials(otherUser.name ?? otherUser.username)}</AvatarFallback>
            </Avatar>
            <div>
              <Link href={`/profile/${username}`} className="text-sm font-mono font-bold text-void-text hover:text-void-purple transition-colors">
                @{username}
              </Link>
            </div>
          </>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-void-green" />
          <span className="text-[10px] font-mono text-void-green">E2E encrypted</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-void-purple border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Lock className="w-8 h-8 text-void-muted mb-3" />
            <p className="text-void-muted font-mono text-sm">No messages yet.</p>
            <p className="text-void-muted/60 font-mono text-xs mt-1">
              Messages are end-to-end encrypted.
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg) => {
              const isMe = msg.senderId === myId;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", isMe ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[70%] px-3 py-2 rounded-xl text-sm font-mono",
                      isMe
                        ? "bg-void-purple text-void-bg rounded-br-sm"
                        : "bg-void-surface border border-void-border text-void-text rounded-bl-sm"
                    )}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                    <p className={cn("text-[10px] mt-1", isMe ? "text-void-bg/60" : "text-void-muted")}>
                      {formatDate(msg.createdAt)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-void-border bg-void-bg/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-xl border border-void-border bg-void-surface text-void-text placeholder:text-void-muted font-mono text-sm focus:outline-none focus:ring-1 focus:ring-void-purple transition-colors"
          />
          <Button
            onClick={sendMessage}
            loading={sending}
            size="icon"
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
