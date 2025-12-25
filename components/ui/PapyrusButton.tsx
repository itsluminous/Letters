"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface PapyrusButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const PapyrusButton = React.forwardRef<
  HTMLButtonElement,
  PapyrusButtonProps
>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-heading font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: cn(
        "bg-wax text-[#f0e6d2] rounded-full shadow-lg",
        "hover:bg-wax-hover hover:scale-105 hover:shadow-xl",
        "active:scale-95",
        "border-2 border-[#4a0404] border-double" // Deep red border
      ),
      secondary: cn(
        "bg-transparent text-ink border-2 border-ink/30 rounded-sm",
        "hover:border-ink hover:bg-ink/5",
        "active:bg-ink/10"
      ),
      ghost:
        "bg-transparent text-ink-faded hover:text-wax hover:underline decoration-wavy decoration-1 underline-offset-4",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "px-8 py-3 text-sm",
      lg: "px-10 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* Add a subtle shine effect to the primary (wax) button */}
        {variant === "primary" && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 pointer-events-none transition-opacity" />
        )}
        {children}
      </button>
    );
  }
);

PapyrusButton.displayName = "PapyrusButton";
