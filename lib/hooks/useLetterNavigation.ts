"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Letter } from "@/lib/supabase/types";

/**
 * Options for configuring the letter navigation hook
 */
export interface UseLetterNavigationOptions {
  /** Callback fired when navigation occurs */
  onNavigate?: (index: number) => void;
  /** Enable gesture-based navigation (swipe, wheel) */
  enableGestures?: boolean;
}

/**
 * Return value from the useLetterNavigation hook
 */
export interface UseLetterNavigationReturn {
  /** Current letter index in the array */
  currentIndex: number;
  /** Current letter object or null if no letters */
  currentLetter: Letter | null;
  /** Navigate to the next letter */
  goNext: () => void;
  /** Navigate to the previous letter */
  goPrev: () => void;
  /** Navigate to a specific index */
  goToIndex: (index: number) => void;
  /** Whether navigation to next is possible */
  canGoNext: boolean;
  /** Whether navigation to previous is possible */
  canGoPrev: boolean;
  /** Direction of last navigation (1 = forward, -1 = backward) */
  direction: number;
  /** Handle swipe gesture with deltaX */
  handleSwipe: (deltaX: number) => void;
  /** Handle wheel/trackpad scroll with deltaY */
  handleWheel: (deltaY: number) => void;
}

// Responsive thresholds based on device type
const getSwipeThreshold = () => {
  if (typeof window === "undefined") return 50;
  // Lower threshold on mobile for easier swiping
  return window.innerWidth < 768 ? 30 : 50;
};

const WHEEL_THRESHOLD = 50; // Minimum wheel delta for navigation

/**
 * Custom hook for managing letter navigation state and gestures
 *
 * Provides navigation controls, boundary detection, and gesture handling
 * for navigating through a collection of letters.
 *
 * @param letters - Array of letters to navigate through
 * @param initialIndex - Starting index (default: 0)
 * @param options - Configuration options
 * @returns Navigation state and control functions
 *
 * @example
 * ```tsx
 * const { currentLetter, goNext, goPrev, canGoNext, canGoPrev } =
 *   useLetterNavigation(letters, 0, {
 *     onNavigate: (index) => console.log('Navigated to', index),
 *     enableGestures: true
 *   });
 * ```
 */

export function useLetterNavigation(
  letters: Letter[],
  initialIndex: number = 0,
  options: UseLetterNavigationOptions = {}
): UseLetterNavigationReturn {
  const { onNavigate, enableGestures = true } = options;

  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, letters.length - 1))
  );
  const [direction, setDirection] = useState(0);

  const wheelAccumulatorRef = useRef(0);
  const lastWheelTimeRef = useRef(0);

  // Update index if letters array changes
  useEffect(() => {
    if (letters.length === 0) {
      setCurrentIndex(0);
    } else if (currentIndex >= letters.length) {
      setCurrentIndex(letters.length - 1);
    }
  }, [letters.length, currentIndex]);

  const currentLetter = letters[currentIndex] || null;
  const canGoNext = currentIndex < letters.length - 1;
  const canGoPrev = currentIndex > 0;

  const goNext = useCallback(() => {
    if (canGoNext) {
      setDirection(1);
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onNavigate?.(newIndex);
    }
  }, [canGoNext, currentIndex, onNavigate]);

  const goPrev = useCallback(() => {
    if (canGoPrev) {
      setDirection(-1);
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onNavigate?.(newIndex);
    }
  }, [canGoPrev, currentIndex, onNavigate]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < letters.length && index !== currentIndex) {
        setDirection(index > currentIndex ? 1 : -1);
        setCurrentIndex(index);
        onNavigate?.(index);
      }
    },
    [letters.length, currentIndex, onNavigate]
  );

  const handleSwipe = useCallback(
    (deltaX: number) => {
      if (!enableGestures) return;

      const threshold = getSwipeThreshold();

      if (deltaX < -threshold) {
        // Swipe left - go to next
        goNext();
      } else if (deltaX > threshold) {
        // Swipe right - go to previous
        goPrev();
      }
    },
    [enableGestures, goNext, goPrev]
  );

  const handleWheel = useCallback(
    (deltaY: number) => {
      if (!enableGestures) return;

      const now = Date.now();
      const timeDiff = now - lastWheelTimeRef.current;

      // Reset accumulator if too much time has passed
      if (timeDiff > 200) {
        wheelAccumulatorRef.current = 0;
      }

      lastWheelTimeRef.current = now;
      wheelAccumulatorRef.current += deltaY;

      if (wheelAccumulatorRef.current > WHEEL_THRESHOLD) {
        // Scroll down - go to next
        goNext();
        wheelAccumulatorRef.current = 0;
      } else if (wheelAccumulatorRef.current < -WHEEL_THRESHOLD) {
        // Scroll up - go to previous
        goPrev();
        wheelAccumulatorRef.current = 0;
      }
    },
    [enableGestures, goNext, goPrev]
  );

  return {
    currentIndex,
    currentLetter,
    goNext,
    goPrev,
    goToIndex,
    canGoNext,
    canGoPrev,
    direction,
    handleSwipe,
    handleWheel,
  };
}
