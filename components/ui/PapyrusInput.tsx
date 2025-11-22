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
        <label className="block mb-2 text-sm font-heading font-bold text-papyrus-text uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 font-body text-base text-papyrus-text bg-papyrus-bg/50 border-2 border-papyrus-border',
            'focus:outline-none focus:border-papyrus-accent focus:bg-papyrus-bg',
            'placeholder:text-papyrus-text-light placeholder:italic',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'transition-colors duration-200',
            'min-h-[50px]',
            error && 'border-red-500/70',
            'papyrus-texture-overlay'
          )}
          {...props}
        />
        <div className="absolute inset-0 border border-papyrus-text/10 pointer-events-none" />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-700 font-body">{error}</p>
      )}
    </div>
  );
});

PapyrusInput.displayName = 'PapyrusInput';
