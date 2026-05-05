"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const SHORTCUTS: Record<string, string> = {
  "g f": "/feed",
  "g e": "/explore",
  "g m": "/marketplace",
  "g k": "/knowledge",
  "g b": "/bounties",
  "g g": "/guilds",
  "g h": "/hackathons",
  "g l": "/leaderboard",
  "g p": "/post/new",
  "g n": "/notifications",
  "g s": "/settings",
  "g d": "/dark",
};

export function useKeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let buffer = "";
    let bufferTimer: NodeJS.Timeout | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if typing in an input/textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Only handle single letter keys for shortcuts
      if (key.length !== 1) return;

      buffer += (buffer ? " " : "") + key;

      // Clear buffer after 1 second
      if (bufferTimer) clearTimeout(bufferTimer);
      bufferTimer = setTimeout(() => { buffer = ""; }, 1000);

      // Check if buffer matches a shortcut
      if (SHORTCUTS[buffer]) {
        e.preventDefault();
        router.push(SHORTCUTS[buffer]);
        buffer = "";
        if (bufferTimer) clearTimeout(bufferTimer);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (bufferTimer) clearTimeout(bufferTimer);
    };
  }, [router]);
}
