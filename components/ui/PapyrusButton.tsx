'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface PapyrusButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const PapyrusButton = React.forwardRef<
  HTMLButtonElement,
  PapyrusButtonProps
>(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
  const baseStyles =
    'inline-flex items-center justify-center font-heading font-bold tracking-wider uppercase transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed border-2 focus:outline-none focus:ring-2 focus:ring-papyrus-accent/50';

  const variants = {
    primary:
      'bg-papyrus-accent border-papyrus-text/80 text-white/90 hover:bg-papyrus-text active:bg-papyrus-text/80 shadow-papyrus',
    secondary:
      'bg-papyrus-dark border-papyrus-border text-papyrus-text hover:bg-papyrus-darker active:bg-papyrus-dark shadow-papyrus',
    ghost:
      'bg-transparent border-transparent text-papyrus-text hover:bg-papyrus-dark/50 active:bg-papyrus-dark',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
});

PapyrusButton.displayName = 'PapyrusButton';
