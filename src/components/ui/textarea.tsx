import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-void-border bg-void-surface px-3 py-2 text-sm text-void-text shadow-sm transition-colors",
            "placeholder:text-void-muted",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-void-purple focus-visible:border-void-purple",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none font-mono",
            error && "border-red-500/50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-400 font-mono">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
