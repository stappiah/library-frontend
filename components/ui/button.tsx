import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variantClasses = {
      default:
        "bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100",
      secondary:
        "border border-zinc-200 bg-white text-zinc-900 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-zinc-700",
      ghost: "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
      destructive: "bg-rose-600 text-white hover:bg-rose-500",
    };

    const sizeClasses = {
      default: "h-11 px-5",
      sm: "h-9 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
