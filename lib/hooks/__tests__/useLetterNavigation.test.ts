import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLetterNavigation } from '../useLetterNavigation';
import { Letter } from '@/lib/supabase/types';

describe('useLetterNavigation', () => {
  const mockLetters: Letter[] = [
    {
      id: 'letter-1',
      authorId: 'author-1',
      recipientId: 'recipient-1',
      content: 'First letter',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      isRead: false,
      readAt: null,
    },
    {
      id: 'letter-2',
      authorId: 'author-2',
      recipientId: 'recipient-1',
      content: 'Second letter',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      isRead: false,
      readAt: null,
    },
    {
      id: 'letter-3',
      authorId: 'author-3',
      recipientId: 'recipient-1',
      content: 'Third letter',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      isRead: false,
      readAt: null,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with the correct index and letter', () => {
    const { result } = renderHook(() => useLetterNavigation(mockLetters, 0));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentLetter).toEqual(mockLetters[0]);
  });

  it('should navigate to next letter when goNext is called', () => {
    const { result } = renderHook(() => useLetterNavigation(mockLetters, 0));

    act(() => {
      result.current.goNext();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentLetter).toEqual(mockLetters[1]);
    expect(result.current.direction).toBe(1);
  });

  it('should navigate to previous letter when goPrev is called', () => {
    const { result } = renderHook(() => useLetterNavigation(mockLetters, 1));

    act(() => {
      result.current.goPrev();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentLetter).toEqual(mockLetters[0]);
    expect(result.current.direction).toBe(-1);
  });

  it('should not navigate beyond the last letter', () => {
    const { result } = renderHook(() => useLetterNavigation(mockLetters, 2));

    expect(result.current.canGoNext).toBe(false);

    act(() => {
      result.current.goNext();
    });

    expect(result.current.currentIndex).toBe(2);
    expect(result.current.currentLetter).toEqual(mockLetters[2]);
  });

  it('should not navigate before the first letter', () => {
    const { result } = renderHook(() => useLetterNavigation(mockLetters, 0));

    expect(result.current.canGoPrev).toBe(false);

    act(() => {
      result.current.goPrev();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentLetter).toEqual(mockLetters[0]);
  });

  it('should correctly report canGoNext and canGoPrev at boundaries', () => {
    // At first letter
    const { result: firstResult } = renderHook(() => useLetterNavigation(mockLetters, 0));
    expect(firstResult.current.canGoPrev).toBe(false);
    expect(firstResult.current.canGoNext).toBe(true);

    // At middle letter
    const { result: middleResult } = renderHook(() => useLetterNavigation(mockLetters, 1));
    expect(middleResult.current.canGoPrev).toBe(true);
    expect(middleResult.current.canGoNext).toBe(true);

    // At last letter
    const { result: lastResult } = renderHook(() => useLetterNavigation(mockLetters, 2));
    expect(lastResult.current.canGoPrev).toBe(true);
    expect(lastResult.current.canGoNext).toBe(false);
  });

  it('should navigate to specific index with goToIndex', () => {
    const { result } = renderHook(() => useLetterNavigation(mockLetters, 0));

    act(() => {
      result.current.goToIndex(2);
    });

    expect(result.current.currentIndex).toBe(2);
    expect(result.current.currentLetter).toEqual(mockLetters[2]);
    expect(result.current.direction).toBe(1);
  });

  it('should set correct direction when navigating backwards with goToIndex', () => {
    const { result } = renderHook(() => useLetterNavigation(mockLetters, 2));

    act(() => {
      result.current.goToIndex(0);
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.direction).toBe(-1);
  });

  it('should call onNavigate callback when navigating', () => {
    const onNavigate = vi.fn();
    const { result } = renderHook(() =>
      useLetterNavigation(mockLetters, 0, { onNavigate })
    );

    act(() => {
      result.current.goNext();
    });

    expect(onNavigate).toHaveBeenCalledWith(1);
  });

  it('should handle swipe gestures when enabled', () => {
    const { result } = renderHook(() =>
      useLetterNavigation(mockLetters, 1, { enableGestures: true })
    );

    // Swipe left (negative deltaX) - go to next
    act(() => {
      result.current.handleSwipe(-60);
    });

    expect(result.current.currentIndex).toBe(2);

    // Swipe right (positive deltaX) - go to previous
    act(() => {
      result.current.handleSwipe(60);
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('should not respond to swipe gestures when disabled', () => {
    const { result } = renderHook(() =>
      useLetterNavigation(mockLetters, 1, { enableGestures: false })
    );

    act(() => {
      result.current.handleSwipe(-60);
    });

    expect(result.current.currentIndex).toBe(1); // Should not change
  });

  it('should handle wheel/trackpad scroll when enabled', () => {
    const { result } = renderHook(() =>
      useLetterNavigation(mockLetters, 1, { enableGestures: true })
    );

    // Scroll down (positive deltaY) - go to next
    act(() => {
      result.current.handleWheel(60);
    });

    expect(result.current.currentIndex).toBe(2);

    // Scroll up (negative deltaY) - go to previous
    act(() => {
      result.current.handleWheel(-60);
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('should handle empty letters array', () => {
    const { result } = renderHook(() => useLetterNavigation([], 0));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentLetter).toBeNull();
    expect(result.current.canGoNext).toBe(false);
    expect(result.current.canGoPrev).toBe(false);
  });

  it('should adjust index when letters array changes', () => {
    const { result, rerender } = renderHook(
      ({ letters }) => useLetterNavigation(letters, 2),
      { initialProps: { letters: mockLetters } }
    );

    expect(result.current.currentIndex).toBe(2);

    // Reduce letters array to only 2 items
    rerender({ letters: mockLetters.slice(0, 2) });

    expect(result.current.currentIndex).toBe(1); // Should adjust to last valid index
  });
});
