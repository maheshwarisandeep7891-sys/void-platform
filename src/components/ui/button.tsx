"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-void-purple focus-visible:ring-offset-2 focus-visible:ring-offset-void-bg",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "relative overflow-hidden select-none",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-void-purple text-white font-semibold",
          "shadow-[0_0_20px_rgba(139,92,246,0.35),0_2px_8px_rgba(0,0,0,0.3)]",
          "hover:bg-[#9d6ff8] hover:shadow-[0_0_28px_rgba(139,92,246,0.5),0_4px_12px_rgba(0,0,0,0.3)]",
          "hover:-translate-y-0.5",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0",
          "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        ].join(" "),
        destructive: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40",
        outline: [
          "border border-void-border bg-transparent text-void-text",
          "hover:bg-void-surface hover:border-void-purple/40 hover:text-void-text",
          "hover:shadow-[0_0_12px_rgba(139,92,246,0.1)]",
        ].join(" "),
        secondary: "bg-void-surface text-void-text border border-void-border hover:bg-void-card hover:border-void-border-hover",
        ghost: "text-void-muted hover:text-void-text hover:bg-void-surface/60",
        link: "text-void-purple underline-offset-4 hover:underline p-0 h-auto",
        cyan: [
          "bg-void-cyan/10 text-void-cyan border border-void-cyan/20",
          "hover:bg-void-cyan/20 hover:border-void-cyan/40",
          "hover:shadow-[0_0_16px_rgba(6,182,212,0.2)]",
        ].join(" "),
        green: [
          "bg-void-green/10 text-void-green border border-void-green/20",
          "hover:bg-void-green/20 hover:border-void-green/40",
          "hover:shadow-[0_0_16px_rgba(16,185,129,0.2)]",
        ].join(" "),
        yellow: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20",
        gradient: [
          "bg-gradient-to-r from-void-purple to-[#6366f1] text-white font-semibold",
          "shadow-[0_0_24px_rgba(139,92,246,0.4)]",
          "hover:shadow-[0_0_36px_rgba(139,92,246,0.55)] hover:-translate-y-0.5",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/10 before:to-white/0",
          "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-500",
        ].join(" "),
        aurora: [
          "bg-gradient-to-r from-[#8b5cf6] via-[#06b6d4] to-[#10b981] text-white font-semibold",
          "shadow-[0_0_24px_rgba(139,92,246,0.3)]",
          "hover:shadow-[0_0_36px_rgba(139,92,246,0.5)] hover:-translate-y-0.5",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/15 before:to-white/0",
          "before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-600",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2 text-sm rounded-xl",
        sm: "h-7 px-3 text-xs rounded-lg",
        lg: "h-11 px-8 text-base rounded-xl",
        xl: "h-13 px-10 text-lg rounded-2xl",
        icon: "h-9 w-9 rounded-xl",
        "icon-sm": "h-7 w-7 rounded-lg",
        "icon-lg": "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {children}
          </>
        ) : children}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
