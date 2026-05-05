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
  const esRef = useRef<EventSource | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (!enabled || typeof window === "undefined") return;

    const es = new EventSource("/api/feed/stream");
    esRef.current = es;

    es.addEventListener("connected", () => {
      setIsConnected(true);
    });

    es.addEventListener("new_posts", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.posts?.length > 0) {
          setNewPosts(prev => {
            // Deduplicate
            const existingIds = new Set(prev.map((p: LivePost) => p.id));
            const fresh = data.posts.filter((p: LivePost) => !existingIds.has(p.id));
            return [...fresh, ...prev];
          });
        }
      } catch {}
    });

    es.addEventListener("heartbeat", () => {
      setIsConnected(true);
    });

    es.onerror = () => {
      setIsConnected(false);
      es.close();
      esRef.current = null;
      // Reconnect after 15s
      reconnectTimer.current = setTimeout(connect, 15000);
    };
  }, [enabled]);

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);

  const clearNewPosts = useCallback(() => setNewPosts([]), []);

  return { newPosts, clearNewPosts, isConnected };
}
