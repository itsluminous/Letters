'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

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
  placeholder = 'Select date...',
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startDayOfWeek = monthStart.getDay();
  const emptyDays = Array(startDayOfWeek).fill(null);

  const weekDays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  return (
    <div className={cn('w-full', className)} ref={containerRef}>
      {label && (
        <label className="block mb-2 text-sm font-heading font-semibold text-papyrus-text">
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'w-full px-4 py-2 font-body text-left text-papyrus-text bg-papyrus-bg border-2 border-papyrus-border papyrus-texture-overlay',
            'focus:outline-none focus:border-papyrus-accent focus:ring-2 focus:ring-papyrus-accent/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            'flex items-center justify-between',
            error && 'border-red-600'
          )}
        >
          <span className={cn(!value && 'text-papyrus-text-light italic')}>
            {value ? format(value, 'MMM dd, yyyy') : placeholder}
          </span>
          <div className="flex items-center gap-2">
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-papyrus-text-light hover:text-papyrus-text"
              >
                ✕
              </button>
            )}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 mt-1 bg-papyrus-bg border-2 border-papyrus-accent papyrus-shadow-lg p-4 min-w-[280px]">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="p-1 hover:bg-papyrus-dark rounded transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <span className="font-heading font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                type="button"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="p-1 hover:bg-papyrus-dark rounded transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Week Days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-heading font-semibold text-papyrus-text-light"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, index) => (
                <div key={`empty-${index}`} />
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
                      'p-2 text-sm font-body rounded transition-colors',
                      'hover:bg-papyrus-dark',
                      isSelected &&
                        'bg-papyrus-accent text-white font-semibold',
                      isToday && !isSelected && 'border border-papyrus-accent',
                      !isSameMonth(day, currentMonth) && 'text-papyrus-text-light'
                    )}
                  >
                    {format(day, 'd')}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 font-body">{error}</p>
      )}
    </div>
  );
};
