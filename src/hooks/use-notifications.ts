"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "./use-session";

interface UseNotificationsReturn {
  unreadCount: number;
  refresh: () => void;
}

// Global state so all components share the same count
let globalCount = 0;
const countListeners: Array<(n: number) => void> = [];

function setGlobalCount(n: number) {
  globalCount = n;
  countListeners.forEach(l => l(n));
}

export function useNotifications(): UseNotificationsReturn {
  const { data: session, status } = useSession();
  const [unreadCount, setUnreadCount] = useState(globalCount);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCount = useCallback(async () => {
    if (!session?.user?.id) return;
    try {
      const res = await fetch("/api/notifications?unread=true");
      if (!res.ok) return;
      const data = await res.json();
      setGlobalCount(data.unreadCount ?? 0);
    } catch {}
  }, [session?.user?.id]);

  useEffect(() => {
    const listener = (n: number) => setUnreadCount(n);
    countListeners.push(listener);
    return () => {
      const idx = countListeners.indexOf(listener);
      if (idx > -1) countListeners.splice(idx, 1);
    };
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    fetchCount();
    // Poll every 30 seconds
    intervalRef.current = setInterval(fetchCount, 30000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status, fetchCount]);

  return { unreadCount, refresh: fetchCount };
}
