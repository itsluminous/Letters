'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils/cn';

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
  placeholder = 'Select...',
  label,
  error,
  multiple = false,
  className,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSelect = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];
      onChange(newValues);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const isSelected = (optionValue: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(optionValue);
    }
    return value === optionValue;
  };

  const getDisplayText = () => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      const selectedLabels = options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label);
      return selectedLabels.join(', ');
    }
    if (!multiple && value) {
      const selected = options.find((opt) => opt.value === value);
      return selected?.label || placeholder;
    }
    return placeholder;
  };

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
            {getDisplayText()}
          </span>
          <svg
            className={cn(
              'w-4 h-4 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-papyrus-bg border-2 border-papyrus-accent papyrus-shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'w-full px-4 py-2 text-left font-body transition-colors duration-150',
                  'hover:bg-papyrus-dark',
                  isSelected(option.value) &&
                    'bg-papyrus-darker font-semibold'
                )}
              >
                {multiple && (
                  <span className="mr-2">
                    {isSelected(option.value) ? '☑' : '☐'}
                  </span>
                )}
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 font-body">{error}</p>
      )}
    </div>
  );
};
