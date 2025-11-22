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
    'inline-flex items-center justify-center font-heading font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed papyrus-texture-overlay border-2';

  const variants = {
    primary:
      'bg-papyrus-darker border-papyrus-accent text-papyrus-text hover:bg-papyrus-accent hover:scale-105 active:scale-95 papyrus-shadow',
    secondary:
      'bg-papyrus-dark border-papyrus-border text-papyrus-text hover:bg-papyrus-darker hover:scale-105 active:scale-95 papyrus-shadow',
    ghost:
      'bg-transparent border-papyrus-border text-papyrus-text hover:bg-papyrus-dark hover:border-papyrus-accent active:scale-95',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
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
