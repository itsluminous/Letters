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
  const maxVisibleLetters = 5;
  const unreadCount = type === 'inbox' ? letters.filter(l => !l.isRead).length : 0;

  const getDisplayName = (userId: string | undefined, fallback: string) => {
    if (!userId) return fallback;
    const contact = contacts.find(c => c.contactUserId === userId);
    return contact?.displayName || fallback;
  };

  const getStackStyle = (index: number) => {
    const rotation = (Math.random() - 0.5) * 3;
    const offsetX = index * 6;
    const offsetY = index * 4;
    const scale = 1 - index * 0.03;
    const zIndex = maxVisibleLetters - index;

    return {
      transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`,
      zIndex,
    };
  };

  if (letters.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center text-center',
          'min-h-[400px] bg-papyrus-dark/30 border-4 border-dashed border-papyrus-border',
          'p-8',
          className
        )}
      >
        <div>
          <p className="font-heading text-xl text-papyrus-text mb-2">
            No letters here
          </p>
          <p className="font-body text-papyrus-text-light">
            {type === 'inbox'
              ? 'Add a contact to start receiving letters.'
              : 'Compose a new letter to get started.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      {type === 'inbox' && unreadCount > 0 && (
        <div className="absolute -top-4 -right-4 z-50">
          <div className="bg-papyrus-accent border-2 border-white/50 shadow-papyrus-lg rounded-full w-12 h-12 flex items-center justify-center">
            <span className="font-heading text-white text-xl font-bold">
              {unreadCount}
            </span>
          </div>
        </div>
      )}

      <div className="relative w-full" style={{ minHeight: '350px' }}>
        {letters.slice(0, maxVisibleLetters).map((letter, index) => {
          const isSelected = currentIndex === index;
          const isUnread = !letter.isRead;
          
          return (
            <div
              key={letter.id}
              className={cn(
                'absolute inset-0 cursor-pointer transition-all duration-300 ease-in-out',
                'bg-papyrus-bg bg-papyrus-texture border-2',
                isSelected
                  ? 'border-papyrus-accent shadow-papyrus-lg'
                  : 'border-papyrus-border shadow-papyrus hover:border-papyrus-darker',
                'p-6',
              )}
              style={getStackStyle(index)}
              onClick={() => onLetterSelect(letter.id)}
            >
              <div className="absolute top-3 right-3">
                {type === 'inbox' && (
                  <div
                    className={cn(
                      'w-3.5 h-3.5 rounded-full border-2',
                      isUnread
                        ? 'bg-papyrus-accent border-papyrus-accent/50'
                        : 'bg-transparent border-papyrus-border'
                    )}
                    title={isUnread ? 'Unread' : 'Read'}
                  />
                )}
              </div>

              <div className="pointer-events-none">
                <div className="mb-4 pb-3 border-b-2 border-papyrus-border/70">
                  <div className="flex justify-between items-start gap-2">
                    <div className="font-heading text-papyrus-text text-base">
                      {type === 'inbox' ? (
                        <p>From: {getDisplayName(letter.author?.id, 'Unknown')}</p>
                      ) : (
                        <p>To: {getDisplayName(letter.recipient?.id, 'Unknown')}</p>
                      )}
                    </div>
                    <div className="font-heading text-papyrus-text-light text-sm text-right flex-shrink-0">
                      <p>{format(letter.createdAt, 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                </div>

                <div className="font-handwriting text-lg text-papyrus-text line-clamp-3">
                  {letter.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {letters.length > maxVisibleLetters && (
        <div className="mt-4 text-center">
          <p className="font-body text-sm text-papyrus-text-light">
            +{letters.length - maxVisibleLetters} more letter{letters.length - maxVisibleLetters !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};
