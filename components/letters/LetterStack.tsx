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
  letters,
  type,
  onLetterSelect,
  currentIndex,
  contacts = [],
  className,
}) => {
  // Responsive stack depth: 3 on mobile, 5 on desktop
  const [maxVisibleLetters, setMaxVisibleLetters] = React.useState(5);
  
  React.useEffect(() => {
    const updateStackDepth = () => {
      setMaxVisibleLetters(window.innerWidth < 768 ? 3 : 5);
    };
    
    updateStackDepth();
    window.addEventListener('resize', updateStackDepth);
    return () => window.removeEventListener('resize', updateStackDepth);
  }, []);
  
  const visibleLetters = letters.slice(0, maxVisibleLetters);
  const unreadCount = type === 'inbox' ? letters.filter(l => !l.isRead).length : 0;

  // Helper function to get display name for a user
  const getDisplayName = (userId: string | undefined, fallback: string) => {
    if (!userId) return fallback;
    const contact = contacts.find(c => c.contactUserId === userId);
    return contact?.displayName || fallback;
  };

  // Calculate 3D stacking properties for each letter
  const getStackStyle = (index: number) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const rotation = (Math.random() - 0.5) * 4; // Random rotation between -2 and 2 degrees
    // Responsive offsets: smaller on mobile
    const offsetX = index * (isMobile ? 5 : 8); // Horizontal offset for depth
    const offsetY = index * (isMobile ? 4 : 6); // Vertical offset for depth
    const scale = 1 - index * 0.02; // Scale reduction for lower items
    const zIndex = maxVisibleLetters - index;

    return {
      transform: `
        translate(${offsetX}px, ${offsetY}px) 
        rotate(${rotation}deg) 
        scale(${scale})
      `,
      zIndex,
    };
  };

  if (letters.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center',
          'min-h-[300px] md:min-h-[400px]',
          'bg-papyrus-bg border-4 border-papyrus-border',
          'papyrus-texture papyrus-shadow',
          'p-8',
          className
        )}
      >
        <div className="text-center">
          <p className="font-heading text-xl text-papyrus-text mb-2">
            No letters yet
          </p>
          <p className="font-body text-papyrus-text-light">
            {type === 'inbox'
              ? 'Add a contact to start receiving letters'
              : 'Compose a letter to get started'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {/* Unread count badge for inbox */}
      {type === 'inbox' && unreadCount > 0 && (
        <div className="absolute -top-3 -right-3 z-50">
          <div className="bg-papyrus-accent border-2 border-papyrus-border papyrus-shadow-lg rounded-full w-12 h-12 flex items-center justify-center">
            <span className="font-heading text-white text-lg font-bold">
              {unreadCount}
            </span>
          </div>
        </div>
      )}

      {/* Letter stack */}
      <div className="relative w-full" style={{ minHeight: '300px' }}>
        {visibleLetters.map((letter, index) => {
          const isSelected = currentIndex === index;
          const isUnread = !letter.isRead;
          
          return (
            <div
              key={letter.id}
              className={cn(
                'absolute inset-0 cursor-pointer transition-all duration-300',
                'bg-papyrus-bg border-4 papyrus-texture',
                isSelected
                  ? 'border-papyrus-accent papyrus-shadow-lg'
                  : 'border-papyrus-border papyrus-shadow hover:border-papyrus-darker active:border-papyrus-accent',
                'p-4 sm:p-6 md:p-8',
                'min-h-[44px]' // Minimum touch target
              )}
              style={getStackStyle(index)}
              onClick={() => onLetterSelect(letter.id)}
            >
              {/* Read/Unread indicator */}
              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                {type === 'inbox' && (
                  <div
                    className={cn(
                      'w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2',
                      isUnread
                        ? 'bg-papyrus-accent border-papyrus-accent'
                        : 'bg-transparent border-papyrus-border'
                    )}
                    title={isUnread ? 'Unread' : 'Read'}
                  />
                )}
                {type === 'sent' && letter.readAt && (
                  <div
                    className="text-xs sm:text-sm font-body text-papyrus-text-light"
                    title={`Read on ${format(letter.readAt, 'MMM d, yyyy')}`}
                  >
                    ✓ Read
                  </div>
                )}
                {type === 'sent' && !letter.readAt && letter.recipient?.lastLoginAt && (
                  <div
                    className="text-xs sm:text-sm font-body text-papyrus-text-light"
                    title={`Last seen ${format(letter.recipient.lastLoginAt, 'MMM d, yyyy')}`}
                  >
                    Unread
                  </div>
                )}
              </div>

              {/* Letter preview content */}
              <div className="pointer-events-none">
                <div className="mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-2 border-papyrus-border">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-heading text-papyrus-text text-xs sm:text-sm md:text-base">
                      {type === 'inbox' ? (
                        <p>From: {getDisplayName(letter.author?.id, letter.author?.email || 'Unknown')}</p>
                      ) : (
                        <p>To: {getDisplayName(letter.recipient?.id, letter.recipient?.email || 'Unknown')}</p>
                      )}
                    </div>
                    <div className="font-heading text-papyrus-text-light text-xs sm:text-sm text-right flex-shrink-0">
                      <p className="hidden sm:block">{format(letter.createdAt, 'MMM d, yyyy')}</p>
                      <p className="sm:hidden">{format(letter.createdAt, 'M/d/yy')}</p>
                    </div>
                  </div>
                </div>

                {/* Letter content preview */}
                <div className="font-handwriting text-sm sm:text-base md:text-lg text-papyrus-text line-clamp-2 sm:line-clamp-3">
                  {letter.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stack depth indicator */}
      {letters.length > maxVisibleLetters && (
        <div className="mt-4 text-center">
          <p className="font-body text-sm text-papyrus-text-light">
            +{letters.length - maxVisibleLetters} more letter
            {letters.length - maxVisibleLetters !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};
