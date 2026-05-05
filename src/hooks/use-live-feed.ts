"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface LivePost {
  id: string;
  type: string;
  title?: string;
  content: string;
  codeSnippet?: string;
  language?: string;
  isDarkMode: boolean;
  darkHandle?: string;
  createdAt: string;
  author?: {
    id: string;
    username: string;
    name?: string;
    image?: string;
    reputation?: { score: number; level: string };
  };
  tags: { tag: { name: string; slug: string } }[];
  _count: { reactions: number; comments: number };
  reactions: { type: string }[];
}

interface UseLiveFeedReturn {
  newPosts: LivePost[];
  clearNewPosts: () => void;
  isConnected: boolean;
}

export function useLiveFeed(enabled = true): UseLiveFeedReturn {
  const [newPosts, setNewPosts] = useState<LivePost[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const lastTimestampRef = useRef<string>(new Date().toISOString());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    if (!enabled || typeof window === "undefined") return;
    try {
      const res = await fetch(`/api/feed/stream?since=${encodeURIComponent(lastTimestampRef.current)}`);
      if (!res.ok) return;
      const data = await res.json();

      setIsConnected(true);
      lastTimestampRef.current = data.timestamp;

      if (data.posts?.length > 0) {
        setNewPosts(prev => {
          const existingIds = new Set(prev.map((p: LivePost) => p.id));
          const fresh = data.posts.filter((p: LivePost) => !existingIds.has(p.id));
          return fresh.length > 0 ? [...fresh, ...prev] : prev;
        });
      }
    } catch {
      setIsConnected(false);
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    // Initial poll after 10s
    const initialTimer = setTimeout(() => {
      poll();
      // Then poll every 10s
      intervalRef.current = setInterval(poll, 10000);
    }, 10000);

    return () => {
      clearTimeout(initialTimer);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, poll]);

  const clearNewPosts = useCallback(() => setNewPosts([]), []);

  return { newPosts, clearNewPosts, isConnected };
}
