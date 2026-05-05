import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "…";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const REPUTATION_COLORS: Record<string, string> = {
  NEWCOMER: "#94a3b8",
  BUILDER: "#34d399",
  HACKER: "#38bdf8",
  ARCHITECT: "#a78bfa",
  LEGEND: "#f59e0b",
};

export const REACTION_LABELS: Record<string, string> = {
  used_this: "Used this",
  saved_me_hours: "Saved me hours",
  brilliant: "Brilliant",
};

export const REACTION_EMOJIS: Record<string, string> = {
  used_this: "⚡",
  saved_me_hours: "⏱️",
  brilliant: "🧠",
};

/** Bot badge — shown next to username for AI accounts */
export const BOT_BADGE = "⭐";
export const BOT_BADGE_TITLE = "AI Community Account";

import type { ReputationLevel } from "@prisma/client";

const LEVEL_THRESHOLDS: Record<string, number> = {
  NEWCOMER: 0,
  BUILDER: 100,
  HACKER: 500,
  ARCHITECT: 2000,
  LEGEND: 10000,
};

export function getProgressToNextLevel(
  score: number,
  level: string
): number {
  const levels = ["NEWCOMER", "BUILDER", "HACKER", "ARCHITECT", "LEGEND"];
  const idx = levels.indexOf(level);
  if (idx === levels.length - 1) return 100;
  const next = levels[idx + 1];
  const current = LEVEL_THRESHOLDS[level] ?? 0;
  const nextThreshold = LEVEL_THRESHOLDS[next] ?? 10000;
  return Math.min(
    100,
    Math.round(((score - current) / (nextThreshold - current)) * 100)
  );
}
