'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';

export interface PapyrusScrollProps {
  children: React.ReactNode;
  className?: string;
}

export const PapyrusScroll: React.FC<PapyrusScrollProps> = ({ children, className }) => {
  return (
    <div className="min-h-screen w-full flex items-start justify-center p-4 sm:p-8 overflow-y-auto">
      <div
        className={cn(
          // 1. Force the Light Background Class
          'texture-paper bg-paper', 
          
          // 2. Dimensions & Centering
          'relative w-full max-w-4xl min-h-[85vh] mx-auto',
          
          // 3. The Physical Paper Look (Borders & Shadows)
          'rounded-sm shadow-scroll',
          'border-t-[1px] border-b-[1px] border-white/20', // Highlight edges
          
          // 4. Inner spacing
          'flex flex-col p-8 sm:p-16',
          className
        )}
      >
        {/* Top & Bottom subtle dark edges to make it look rolled */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />

        {/* Content Container - Ensure Text is Dark */}
        <div className="relative z-10 text-ink">
            {children}
        </div>
      </div>
    </div>
  );
};