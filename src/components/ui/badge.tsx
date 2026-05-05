import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium font-mono transition-all duration-150",
  {
    variants: {
      variant: {
        default: [
          "bg-void-purple/12 text-[#a78bfa] border border-void-purple/25",
          "shadow-[0_0_8px_rgba(139,92,246,0.15)]",
        ].join(" "),
        secondary: "bg-void-surface text-void-muted border border-void-border",
        cyan: "bg-void-cyan/10 text-[#38bdf8] border border-void-cyan/25 shadow-[0_0_8px_rgba(6,182,212,0.12)]",
        green: "bg-void-green/10 text-[#34d399] border border-void-green/25 shadow-[0_0_8px_rgba(16,185,129,0.12)]",
        red: "bg-red-500/10 text-red-400 border border-red-500/20",
        yellow: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        orange: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        pink: "bg-pink-500/10 text-pink-400 border border-pink-500/20",
        outline: "border border-void-border text-void-muted",
        gradient: [
          "bg-gradient-to-r from-void-purple/15 to-void-cyan/10",
          "text-[#a78bfa] border border-void-purple/20",
        ].join(" "),
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
