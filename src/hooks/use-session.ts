"use client";

import { useState, useEffect, useCallback } from "react";
import type { Session, SessionUser } from "@/lib/auth";

interface UseSessionReturn {
  data: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  update: () => Promise<void>;
}

let cachedSession: Session | null | undefined = undefined;
const listeners: Array<(session: Session | null) => void> = [];

async function fetchSession(): Promise<Session | null> {
  try {
    const res = await fetch("/api/auth/session", { credentials: "include" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<Session | null | undefined>(cachedSession);

  const update = useCallback(async () => {
    const s = await fetchSession();
    cachedSession = s;
    setSession(s);
    listeners.forEach((l) => l(s));
  }, []);

  useEffect(() => {
    if (cachedSession !== undefined) {
      setSession(cachedSession);
      return;
    }
    update();

    const listener = (s: Session | null) => setSession(s);
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx > -1) listeners.splice(idx, 1);
    };
  }, [update]);

  return {
    data: session ?? null,
    status:
      session === undefined
        ? "loading"
        : session === null
        ? "unauthenticated"
        : "authenticated",
    update,
  };
}

export function signIn(provider = "github", options?: { callbackUrl?: string }) {
  const callbackUrl = options?.callbackUrl ?? "/feed";
  window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}

export function signOut(options?: { callbackUrl?: string }) {
  const callbackUrl = options?.callbackUrl ?? "/";
  cachedSession = null;
  window.location.href = `/api/auth/signout?callbackUrl=${encodeURIComponent(callbackUrl)}`;
}
