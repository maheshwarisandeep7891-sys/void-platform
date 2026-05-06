import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean;
    glass?: boolean;
    glow?: boolean;
    gradient?: boolean;
    premium?: boolean;
  }
>(({ className, hover, glass, glow, gradient, premium, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-void-border bg-void-card text-void-text",
      "shadow-[0_2px_12px_rgba(0,0,0,0.4)]",
      "transition-all duration-300",
      hover && [
        "cursor-pointer",
        "hover:border-[rgba(139,92,246,0.3)]",
        "hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(139,92,246,0.15),0_0_20px_rgba(139,92,246,0.08)]",
        "hover:-translate-y-1",
        "active:translate-y-0 active:scale-[0.99]",
      ],
      glass && "frosted",
      glow && "shadow-[0_0_24px_rgba(139,92,246,0.2),0_2px_12px_rgba(0,0,0,0.4)] border-[rgba(139,92,246,0.2)]",
      gradient && "bg-gradient-to-br from-[rgba(139,92,246,0.06)] via-[rgba(6,182,212,0.03)] to-transparent",
      premium && [
        "bg-gradient-to-br from-[rgba(139,92,246,0.08)] to-[rgba(6,182,212,0.04)]",
        "border-[rgba(139,92,246,0.2)]",
        "shadow-[0_0_30px_rgba(139,92,246,0.1),0_4px_20px_rgba(0,0,0,0.4)]",
        "depth-noise",
      ],
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight text-void-text", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-void-muted", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
