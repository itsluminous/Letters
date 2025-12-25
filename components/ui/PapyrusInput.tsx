"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

export interface PapyrusInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const PapyrusInput = React.forwardRef<
  HTMLInputElement,
  PapyrusInputProps
>(({ className, label, error, ...props }, ref) => {
  return (
    <div className="w-full group">
      {label && (
        <label className="block mb-1 text-xs font-heading font-bold uppercase tracking-widest text-ink-faded opacity-80 pl-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          // Text Color & Background
          "w-full py-2 bg-transparent font-hand text-2xl text-ink",

          // The Line (Border) - Dark brown to contrast with light paper
          "border-b-2 border-ink/20",

          // States
          "focus:outline-none focus:border-wax focus:border-b-[2px] transition-colors duration-300",
          "placeholder:text-ink-faded/30 placeholder:font-serif placeholder:text-lg placeholder:italic",
          "disabled:opacity-50 disabled:cursor-not-allowed",

          error ? "border-red-800/60 text-red-900" : "",
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-800 font-serif italic pl-1">
          {error}
        </p>
      )}
    </div>
  );
});
PapyrusInput.displayName = "PapyrusInput";
