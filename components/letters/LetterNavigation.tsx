'use client';

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { Letter } from '@/lib/supabase/types';
import { useLetterNavigation } from '@/lib/hooks/useLetterNavigation';

/**
 * Props for the LetterNavigation component
 */
export interface LetterNavigationProps {
  /** Array of letters to navigate through */
  letters: Letter[];
  /** Current letter index */
  currentIndex: number;
  /** Callback when navigation occurs */
  onNavigate: (index: number) => void;
  /** Render function for letter content */
  children: (letter: Letter, index: number) => React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Enable gesture-based navigation (default: true) */
  enableGestures?: boolean;
}

// Page-turning animation variants
const pageTurnVariants = {
  enter: (direction: number) => ({
    rotateY: direction > 0 ? 90 : -90,
    opacity: 0,
    scale: 0.8,
    transformOrigin: direction > 0 ? 'left center' : 'right center',
  }),
  center: {
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transformOrigin: 'center center',
  },
  exit: (direction: number) => ({
    rotateY: direction > 0 ? -90 : 90,
    opacity: 0,
    scale: 0.8,
    transformOrigin: direction > 0 ? 'right center' : 'left center',
  }),
};

const transition = {
  duration: 0.6,
  ease: [0.43, 0.13, 0.23, 0.96] as [number, number, number, number],
};

/**
 * LetterNavigation component with page-turning animations
 * 
 * Provides a complete navigation experience for browsing through letters with:
 * - Arrow button navigation
 * - Keyboard arrow key support (← →)
 * - Touch swipe gestures (mobile)
 * - Trackpad/mouse wheel horizontal scrolling (desktop)
 * - Smooth page-turning animations using Framer Motion
 * - Papyrus-themed styling
 * 
 * @example
 * ```tsx
 * <LetterNavigation
 *   letters={letters}
 *   currentIndex={0}
 *   onNavigate={(index) => setCurrentIndex(index)}
 * >
 *   {(letter) => <PapyrusScroll letter={letter} mode="view" />}
 * </LetterNavigation>
 * ```
 */
export const LetterNavigation: React.FC<LetterNavigationProps> = ({
  letters,
  currentIndex,
  onNavigate,
  children,
  className,
  enableGestures = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const {
    currentLetter,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
    direction,
    handleSwipe,
    handleWheel,
  } = useLetterNavigation(letters, currentIndex, {
    onNavigate,
    enableGestures,
  });

  // Touch event handlers for mobile swipe gestures
  useEffect(() => {
    if (!enableGestures || !containerRef.current) return;

    const container = containerRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const deltaX = e.touches[0].clientX - touchStartRef.current.x;
      const deltaY = e.touches[0].clientY - touchStartRef.current.y;

      // Only prevent default if horizontal swipe is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;

      const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;

      // Only trigger swipe if horizontal movement is dominant
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        handleSwipe(deltaX);
      }

      touchStartRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enableGestures, handleSwipe]);

  // Wheel event handler for desktop trackpad/mouse wheel
  useEffect(() => {
    if (!enableGestures || !containerRef.current) return;

    const container = containerRef.current;

    const handleWheelEvent = (e: WheelEvent) => {
      // Only handle horizontal scroll or vertical scroll with shift key
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
        e.preventDefault();
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
        handleWheel(delta);
      }
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheelEvent);
    };
  }, [enableGestures, handleWheel]);

  // Keyboard navigation
  useEffect(() => {
    if (!enableGestures) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enableGestures, goNext, goPrev]);

  if (letters.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative w-full', className)}>
      {/* Navigation arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-10 px-2 sm:px-4">
        {/* Left arrow */}
        <button
          onClick={goPrev}
          disabled={!canGoPrev}
          className={cn(
            'pointer-events-auto',
            'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
            'flex items-center justify-center',
            'bg-papyrus-bg border-3 border-papyrus-border',
            'papyrus-texture papyrus-shadow',
            'transition-all duration-200',
            'hover:bg-papyrus-dark hover:scale-110',
            'active:scale-95',
            'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-papyrus-bg',
            'focus:outline-none focus:ring-2 focus:ring-papyrus-accent focus:ring-offset-2'
          )}
          aria-label="Previous letter"
          title="Previous letter (← or swipe right)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 text-papyrus-text"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Right arrow */}
        <button
          onClick={goNext}
          disabled={!canGoNext}
          className={cn(
            'pointer-events-auto',
            'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14',
            'flex items-center justify-center',
            'bg-papyrus-bg border-3 border-papyrus-border',
            'papyrus-texture papyrus-shadow',
            'transition-all duration-200',
            'hover:bg-papyrus-dark hover:scale-110',
            'active:scale-95',
            'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-papyrus-bg',
            'focus:outline-none focus:ring-2 focus:ring-papyrus-accent focus:ring-offset-2'
          )}
          aria-label="Next letter"
          title="Next letter (→ or swipe left)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6 text-papyrus-text"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Letter content with page-turning animation */}
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ perspective: '2000px' }}
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentLetter?.id || currentIndex}
            custom={direction}
            variants={pageTurnVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="w-full"
          >
            {currentLetter && children(currentLetter, currentIndex)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Letter counter */}
      {letters.length > 1 && (
        <div className="mt-4 text-center">
          <p className="font-heading text-papyrus-text-light text-sm">
            Letter {currentIndex + 1} of {letters.length}
          </p>
        </div>
      )}
    </div>
  );
};
