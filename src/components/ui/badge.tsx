import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-mono font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-void-purple/10 text-void-purple border border-void-purple/20",
        secondary: "bg-void-surface text-void-muted border border-void-border",
        cyan: "bg-void-cyan/10 text-void-cyan border border-void-cyan/20",
        green: "bg-void-green/10 text-void-green border border-void-green/20",
        red: "bg-red-500/10 text-red-400 border border-red-500/20",
        yellow: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
        outline: "border border-void-border text-void-muted",
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
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
