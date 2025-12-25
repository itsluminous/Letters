"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface PapyrusSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
}

export const PapyrusSpinner: React.FC<PapyrusSpinnerProps> = ({
  size = "md",
  className,
  text,
}) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-papyrus-border border-t-papyrus-accent",
          sizes[size]
        )}
      />
      {text && (
        <p className="text-papyrus-text-light font-body text-sm animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export interface PapyrusLoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
}

export const PapyrusLoadingOverlay: React.FC<PapyrusLoadingOverlayProps> = ({
  isLoading,
  text = "Loading...",
  className,
}) => {
  if (!isLoading) return null;

  return (
    <div
      className={cn(
        "absolute inset-0 bg-papyrus-bg/80 backdrop-blur-sm",
        "flex items-center justify-center z-40",
        className
      )}
    >
      <div className="bg-papyrus-bg border-2 border-papyrus-border papyrus-shadow p-6 papyrus-texture-overlay">
        <PapyrusSpinner size="lg" text={text} />
      </div>
    </div>
  );
};
