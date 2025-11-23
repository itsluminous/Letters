'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Letter, Contact } from '@/lib/supabase/types';
import { format } from 'date-fns';

export interface LetterStackProps {
  letters: Letter[];
  type: 'inbox' | 'sent';
  onLetterSelect: (letterId: string) => void;
  currentIndex: number;
  contacts?: Contact[];
  className?: string;
}

export const LetterStack: React.FC<LetterStackProps> = ({
  letters, type, onLetterSelect, currentIndex, contacts = [], className,
}) => {
  const [maxVisibleLetters, setMaxVisibleLetters] = React.useState(5);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  
  React.useEffect(() => {
    const updateStackDepth = () => setMaxVisibleLetters(window.innerWidth < 768 ? 3 : 5);
    updateStackDepth();
    window.addEventListener('resize', updateStackDepth);
    return () => window.removeEventListener('resize', updateStackDepth);
  }, []);
  
  const visibleLetters = letters.slice(0, maxVisibleLetters);
  const unreadCount = type === 'inbox' ? letters.filter(l => !l.isRead).length : 0;

  const getDisplayName = (userId: string | undefined, fallback: string) => {
    if (!userId) return fallback;
    const contact = contacts.find(c => c.contactUserId === userId);
    return contact?.displayName || fallback;
  };

  const getStackStyle = (index: number) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const rotation = (Math.random() - 0.5) * 2; 
    const offsetX = index * (isMobile ? 5 : 8);
    const offsetY = index * (isMobile ? 4 : 6);
    const scale = 1 - index * 0.02;
    const zIndex = maxVisibleLetters - index;

    return {
      transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`,
      zIndex,
    };
  };

  if (letters.length === 0) {
    return (
      <div className={cn(
          'flex items-center justify-center min-h-[300px] md:min-h-[400px]',
          'bg-[#fffbf0] border border-papyrus-border shadow-papyrus', // Lighter background
          'p-8 text-center rounded-sm',
          className
        )}>
        <div>
          <p className="font-heading text-xl text-ink mb-2">No letters yet</p>
          <p className="font-body text-ink-light italic">
            {type === 'inbox' ? 'Add a contact to start receiving letters' : 'Compose a letter to get started'}
          </p>
        </div>
      </div>
    );
  }

  const currentLetter = letters[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < letters.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      onLetterSelect(letters[currentIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onLetterSelect(letters[currentIndex + 1].id);
    }
  };

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext(); // Swipe left = next letter
    } else if (isRightSwipe) {
      handlePrevious(); // Swipe right = previous letter
    }
  };

  return (
    <div className={cn('relative', className)}>
      {/* Unread count badge */}
      {type === 'inbox' && unreadCount > 0 && (
        <div className="absolute -top-3 -right-3 z-50">
          <div className="bg-wax border-2 border-white shadow-md rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-heading text-[#f4e8d0] text-md font-bold">{unreadCount}</span>
          </div>
        </div>
      )}

      {/* Navigation Arrows - Overlay on sides */}
      {hasPrevious && (
        <button
          onClick={handlePrevious}
          className={cn(
            'absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40',
            'w-10 h-10 sm:w-12 sm:h-12 rounded-full',
            'border-2 border-papyrus-text/60 shadow-lg',
            'flex items-center justify-center',
            'hover:bg-papyrus-dark hover:border-papyrus-text hover:scale-110 transition-all duration-200 cursor-pointer',
            'text-papyrus-text group'
          )}
          aria-label="Previous letter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-7 sm:w-7 group-hover:text-papyrus-bg"
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
      )}

      {hasNext && (
        <button
          onClick={handleNext}
          className={cn(
            'absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40',
            'w-10 h-10 sm:w-12 sm:h-12 rounded-full',
            'border-2 border-papyrus-text/60 shadow-lg',
            'flex items-center justify-center',
            'hover:bg-papyrus-dark hover:border-papyrus-text hover:scale-110 transition-all duration-200 cursor-pointer',
            'text-papyrus-text group'
          )}
          aria-label="Next letter"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 sm:h-7 sm:w-7 group-hover:text-papyrus-bg"
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
      )}

      {/* Stack visualization - letters behind the current one */}
      <div 
        className="relative w-full" 
        style={{ minHeight: '500px' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {visibleLetters.map((letter, index) => {
          const stackIndex = index - currentIndex;
          if (stackIndex < 0) return null; // Don't show letters before current
          
          const isTop = stackIndex === 0;
          
          return (
            <div
              key={letter.id}
              className={cn(
                'absolute inset-0 transition-all duration-300',
                !isTop && 'pointer-events-none'
              )}
              style={getStackStyle(stackIndex)}
            >
              {isTop ? (
                // Top letter - full PapyrusScroll
                <div className="relative w-full bg-[#fffbf0] shadow-papyrus-lg p-6 sm:p-8 md:p-12">
                  {/* Read Status Indicator */}
                  {type === 'inbox' && !letter.isRead && (
                    <div className="absolute top-4 right-4 w-3 h-3 bg-wax rounded-full border-2 border-white" />
                  )}

                  {/* Letter counter */}
                  <div className="border-t border-ink/5 text-center">
                    <span className="font-heading text-xs text-ink-light uppercase tracking-widest">
                      Letter {currentIndex + 1} of {letters.length}
                    </span>
                  </div>

                  {/* Metadata Header */}
                  <div className="mb-6 border-b-2 border-ink/10 pb-4">
                    <div className="flex justify-between items-end mb-2">
                      <div className="font-serif text-ink">
                        <p className="text-sm font-bold tracking-widest text-ink-light">
                          {type === 'inbox' 
                            ? `From: ${getDisplayName(letter.author?.id, letter.author?.email || 'Unknown')}` 
                            : `To: ${getDisplayName(letter.recipient?.id, letter.recipient?.email || 'Unknown')}`}
                        </p>
                      </div>
                      <div className="text-right font-serif text-ink-light italic">
                        {format(letter.createdAt, 'MMMM d, yyyy')}
                      </div>
                    </div>
                    
                    {/* Read status for sent letters */}
                    {type === 'sent' && (
                      <div className="flex items-center gap-2 mt-2">
                        {letter.isRead && letter.readAt ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-green-600"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-body text-green-700">
                              Seen on {format(letter.readAt, 'MMM d, yyyy')}
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-ink-light"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                            </svg>
                            <span className="text-xs font-body text-ink-light italic">
                              Not yet seen
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content - Full text in handwriting with max height and scroll */}
                  <div className="min-h-[200px] max-h-[calc(100vh-400px)] sm:max-h-[calc(100vh-350px)] overflow-y-auto font-handwriting text-xl sm:text-2xl text-ink leading-loose whitespace-pre-wrap scrollbar-thin scrollbar-thumb-papyrus-border scrollbar-track-papyrus-bg">
                    {letter.content}
                  </div>
                </div>
              ) : (
                // Background letters - just show as stacked papers
                <div className="w-full h-full bg-[#fffbf0] border border-ink/10 shadow-papyrus" />
              )}
            </div>
          );
        })}
      </div>


    </div>
  );
};