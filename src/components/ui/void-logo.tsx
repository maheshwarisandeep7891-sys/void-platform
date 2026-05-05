import React from "react";
import { cn } from "@/lib/utils";

interface VoidLogoProps {
  size?: number;
  className?: string;
  variant?: "icon" | "full" | "wordmark";
  animated?: boolean;
}

/**
 * VOID Platform Logo
 * Custom SVG — a stylized void/portal symbol with the wordmark
 */
export function VoidLogo({ size = 32, className, variant = "icon", animated = false }: VoidLogoProps) {
  if (variant === "wordmark") {
    return (
      <span
        className={cn(
          "font-black tracking-tighter font-mono select-none",
          "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#6366f1]",
          "bg-clip-text text-transparent",
          className
        )}
        style={{ fontSize: size }}
      >
        VOID
      </span>
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("flex items-center gap-2.5 select-none", className)}>
        <VoidIcon size={size} animated={animated} />
        <span
          className="font-black tracking-tighter font-mono text-void-text"
          style={{ fontSize: size * 0.75 }}
        >
          VOID
        </span>
      </div>
    );
  }

  return <VoidIcon size={size} animated={animated} className={className} />;
}

function VoidIcon({ size = 32, animated = false, className }: { size?: number; animated?: boolean; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animated && "animate-pulse-glow", className)}
    >
      <defs>
        <linearGradient id="void-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="void-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="void-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <filter id="void-blur">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer glow */}
      <circle cx="20" cy="20" r="19" fill="url(#void-glow)" />

      {/* Background square with rounded corners */}
      <rect x="2" y="2" width="36" height="36" rx="10" fill="#0f0f18" />
      <rect x="2" y="2" width="36" height="36" rx="10" fill="url(#void-grad-1)" fillOpacity="0.12" />
      <rect x="2" y="2" width="36" height="36" rx="10" stroke="url(#void-grad-1)" strokeWidth="1" strokeOpacity="0.5" />

      {/* Inner portal rings */}
      <circle cx="20" cy="20" r="12" stroke="url(#void-grad-1)" strokeWidth="1.5" strokeOpacity="0.4" fill="none" />
      <circle cx="20" cy="20" r="8" stroke="url(#void-grad-2)" strokeWidth="1" strokeOpacity="0.6" fill="none" />

      {/* V shape — the core VOID symbol */}
      <path
        d="M12 13 L20 27 L28 13"
        stroke="url(#void-grad-1)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Center dot */}
      <circle cx="20" cy="20" r="2" fill="url(#void-grad-1)" />

      {/* Corner accents */}
      <circle cx="8" cy="8" r="1.5" fill="#8b5cf6" fillOpacity="0.5" />
      <circle cx="32" cy="8" r="1.5" fill="#06b6d4" fillOpacity="0.5" />
      <circle cx="8" cy="32" r="1.5" fill="#06b6d4" fillOpacity="0.3" />
      <circle cx="32" cy="32" r="1.5" fill="#8b5cf6" fillOpacity="0.3" />
    </svg>
  );
}
