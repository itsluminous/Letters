'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

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
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-heading font-semibold text-papyrus-text">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 sm:px-4 py-2 sm:py-3 font-body text-sm sm:text-base text-papyrus-text bg-papyrus-bg border-2 border-papyrus-border rounded-none papyrus-texture-overlay',
          'focus:outline-none focus:border-papyrus-accent focus:ring-2 focus:ring-papyrus-accent/20',
          'placeholder:text-papyrus-text-light placeholder:italic',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200',
          'min-h-[44px]', // Minimum touch target
          error && 'border-red-600',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 font-body">{error}</p>
      )}
    </div>
  );
});

PapyrusInput.displayName = 'PapyrusInput';
