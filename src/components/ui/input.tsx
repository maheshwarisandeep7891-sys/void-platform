import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-xl border border-void-border",
            "bg-void-surface/60 backdrop-blur-sm",
            "px-3 py-1 text-sm text-void-text",
            "shadow-[0_1px_4px_rgba(0,0,0,0.3)]",
            "transition-all duration-150",
            "placeholder:text-void-muted/60",
            "focus-visible:outline-none",
            "focus-visible:ring-2 focus-visible:ring-void-purple/40",
            "focus-visible:border-void-purple/60",
            "focus-visible:bg-void-surface",
            "focus-visible:shadow-[0_0_16px_rgba(139,92,246,0.15)]",
            "disabled:cursor-not-allowed disabled:opacity-40",
            "font-mono",
            error && "border-red-500/50 focus-visible:ring-red-500/40 focus-visible:border-red-500/60",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-400 font-mono flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
