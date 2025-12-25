"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

export interface PapyrusSelectOption {
  value: string;
  label: string;
}

export interface PapyrusSelectProps {
  options: PapyrusSelectOption[];
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  multiple?: boolean;
  className?: string;
  disabled?: boolean;
}

export const PapyrusSelect: React.FC<PapyrusSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
  multiple = false,
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) =>
      containerRef.current &&
      !containerRef.current.contains(e.target as Node) &&
      setIsOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const next = current.includes(optionValue)
        ? current.filter((v) => v !== optionValue)
        : [...current, optionValue];
      onChange(next);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const isSelected = (v: string) =>
    Array.isArray(value) ? value.includes(v) : value === v;

  // Get display label
  const displayLabel =
    !value || (Array.isArray(value) && value.length === 0)
      ? null
      : options.find(
          (o) => o.value === (Array.isArray(value) ? value[0] : value)
        )?.label;

  return (
    <div className={cn("w-full relative", className)} ref={containerRef}>
      {label && (
        <label className="block mb-1 text-xs font-heading font-bold uppercase tracking-widest text-ink-faded">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full py-2 text-left font-hand text-2xl text-ink bg-transparent",
          "border-b-2 border-[#5c4a3f]/30 hover:border-wax",
          "flex items-center justify-between transition-colors duration-300 focus:outline-none",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-800/60"
        )}
      >
        <span className={cn(!displayLabel && "text-ink-faded/50 italic")}>
          {displayLabel ||
            (multiple && Array.isArray(value) && value.length > 0
              ? `${value.length} selected`
              : placeholder)}
        </span>
        <span
          className={`text-xs text-ink-faded transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[#e3d5b8] shadow-scroll rounded-sm overflow-hidden border border-[#2c1a0f]/10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full px-6 py-3 text-left font-serif text-lg transition-colors",
                "hover:bg-[#2c1a0f]/5 text-ink",
                isSelected(option.value) && "bg-ink/10 font-bold text-wax"
              )}
            >
              <span className="inline-block w-6 text-center font-hand">
                {isSelected(option.value) ? "✓" : ""}
              </span>
              {option.label}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="mt-2 text-sm text-red-800 font-serif italic">{error}</p>
      )}
    </div>
  );
};
