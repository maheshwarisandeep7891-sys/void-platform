import React from "react";
import { cn } from "@/lib/utils";

interface VoidLogoProps {
  size?: number;
  className?: string;
  variant?: "icon" | "full" | "wordmark";
  animated?: boolean;
}

export function VoidLogo({ size = 32, className, variant = "icon", animated = false }: VoidLogoProps) {
  if (variant === "wordmark") {
    return (
      <span
        className={cn("font-black tracking-tighter font-mono select-none", className)}
        style={{
          fontSize: size,
          background: "linear-gradient(135deg, #c4b5fd 0%, #a78bfa 40%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.05em",
        }}
      >
        VOID
      </span>
    );
  }

  if (variant === "full") {
    return (
      <div className={cn("flex items-center gap-3 select-none", className)}>
        <VoidIcon size={size} animated={animated} />
        <span
          className="font-black font-mono tracking-tighter"
          style={{
            fontSize: size * 0.8,
            background: "linear-gradient(135deg, #e2e8f0 0%, #c4b5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.05em",
          }}
        >
          VOID
        </span>
      </div>
    );
  }

  return <VoidIcon size={size} animated={animated} className={className} />;
}

function VoidIcon({ size = 32, animated = false, className }: { size?: number; animated?: boolean; className?: string }) {
  const id = `void-${Math.random().toString(36).slice(2, 7)}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(animated && "animate-pulse-glow", className)}
      style={{ filter: "drop-shadow(0 0 8px rgba(139,92,246,0.4))" }}
    >
      <defs>
        <linearGradient id={`${id}-g1`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id={`${id}-g2`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id={`${id}-g3`} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0f0f18" />
          <stop offset="100%" stopColor="#1a1a2e" />
        </linearGradient>
        <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-shadow`}>
          <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#8b5cf6" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Outer glow circle */}
      <circle cx="24" cy="24" r="23" fill={`url(#${id}-glow)`} />

      {/* Main background */}
      <rect x="1" y="1" width="46" height="46" rx="14" fill={`url(#${id}-g3)`} />

      {/* Gradient overlay */}
      <rect x="1" y="1" width="46" height="46" rx="14" fill={`url(#${id}-g1)`} fillOpacity="0.08" />

      {/* Border */}
      <rect x="1" y="1" width="46" height="46" rx="14" stroke={`url(#${id}-g1)`} strokeWidth="1.5" strokeOpacity="0.6" />

      {/* Outer ring */}
      <circle cx="24" cy="24" r="16" stroke={`url(#${id}-g1)`} strokeWidth="1" strokeOpacity="0.3" fill="none" strokeDasharray="3 2" />

      {/* Middle ring */}
      <circle cx="24" cy="24" r="11" stroke={`url(#${id}-g2)`} strokeWidth="1.5" strokeOpacity="0.5" fill="none" />

      {/* Inner ring */}
      <circle cx="24" cy="24" r="6" stroke={`url(#${id}-g1)`} strokeWidth="1" strokeOpacity="0.4" fill="none" />

      {/* V shape - main symbol */}
      <path
        d="M14 15 L24 33 L34 15"
        stroke={`url(#${id}-g1)`}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter={`url(#${id}-shadow)`}
      />

      {/* Center glow dot */}
      <circle cx="24" cy="24" r="2.5" fill={`url(#${id}-g1)`} opacity="0.9" />
      <circle cx="24" cy="24" r="1.5" fill="white" opacity="0.6" />

      {/* Corner accent dots */}
      <circle cx="9" cy="9" r="1.5" fill="#a78bfa" opacity="0.6" />
      <circle cx="39" cy="9" r="1.5" fill="#38bdf8" opacity="0.6" />
      <circle cx="9" cy="39" r="1.5" fill="#38bdf8" opacity="0.4" />
      <circle cx="39" cy="39" r="1.5" fill="#a78bfa" opacity="0.4" />

      {/* Top highlight */}
      <rect x="8" y="1" width="32" height="1" rx="0.5" fill="white" fillOpacity="0.08" />
    </svg>
  );
}
