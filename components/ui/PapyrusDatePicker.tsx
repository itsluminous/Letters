"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

export interface PapyrusDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  error?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const PapyrusDatePicker: React.FC<PapyrusDatePickerProps> = ({
  value,
  onChange,
  label,
  error,
  placeholder = "Select date...",
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className={cn("w-full group relative", className)} ref={containerRef}>
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
          "border-b-2 border-[#5c4a3f]/30 transition-all duration-300",
          "hover:border-[#8b0000] focus:outline-none",
          "flex items-center justify-between",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-800/60 text-red-900"
        )}
      >
        <span className={cn(!value && "text-ink-faded/50")}>
          {value ? format(value, "MMMM d, yyyy") : placeholder}
        </span>

        {/* Icon: Quill or Inkpot style */}
        <svg
          className="w-5 h-5 text-ink-faded opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-4 left-0 bg-[#e3d5b8] shadow-scroll p-4 min-w-[280px] rounded-sm animate-in fade-in zoom-in-95 duration-200 border border-[#2c1a0f]/10">
          {/* Grain texture overlay for popup */}
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')]"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b border-ink/20 pb-2">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1 hover:text-wax transition-colors"
              >
                ←
              </button>
              <span className="font-heading font-bold text-ink text-sm tracking-wide">
                {format(currentMonth, "MMMM yyyy")}
              </span>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1 hover:text-wax transition-colors"
              >
                →
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-[10px] font-serif text-ink-faded uppercase tracking-widest mb-2"
                >
                  {day}
                </div>
              ))}
              {emptyDays.map((_, i) => (
                <div key={`e-${i}`} />
              ))}
              {daysInMonth.map((day) => {
                const isSelected = value && isSameDay(day, value);
                const isToday = isSameDay(day, new Date());
                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => handleDateSelect(day)}
                    className={cn(
                      "w-8 h-8 flex items-center justify-center text-sm font-serif rounded-full transition-all",
                      isSelected
                        ? "bg-wax text-[#f0e6d2] shadow-sm font-bold"
                        : "hover:bg-ink/10 text-ink",
                      isToday && !isSelected && "border border-ink/40"
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-800 font-serif italic">{error}</p>
      )}
    </div>
  );
};
