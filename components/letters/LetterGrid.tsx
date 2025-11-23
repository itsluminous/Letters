'use client';

import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Letter, Contact } from '@/lib/supabase/types';
import { format } from 'date-fns';

export interface LetterGridProps {
  letters: Letter[];
  type: 'inbox' | 'sent';
  onLetterSelect: (letterId: string) => void;
  contacts?: Contact[];
  className?: string;
}

export const LetterGrid: React.FC<LetterGridProps> = ({
  letters, type, onLetterSelect, contacts = [], className,
}) => {
  const getDisplayName = (userId: string | undefined, fallback: string) => {
    if (!userId) return fallback;
    const contact = contacts.find(c => c.contactUserId === userId);
    return contact?.displayName || fallback;
  };

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6', className)}>
      {letters.map((letter) => (
        <div
          key={letter.id}
          onClick={() => onLetterSelect(letter.id)}
          className={cn(
            'relative bg-[#fffbf0] border border-ink/10 shadow-papyrus',
            'p-4 sm:p-6 cursor-pointer transition-all duration-200',
            'hover:shadow-papyrus-lg hover:border-wax/30'
          )}
        >
          {/* Read Status Indicator */}
          {type === 'inbox' && !letter.isRead && (
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-wax rounded-full border border-white" />
          )}

          {/* Header */}
          <div className="border-b border-ink/10 pb-3 mb-3">
            <p className="text-xs font-serif font-bold tracking-wide text-ink-light truncate">
              {type === 'inbox' 
                ? `From: ${getDisplayName(letter.author?.id, letter.author?.email || 'Unknown')}` 
                : `To: ${getDisplayName(letter.recipient?.id, letter.recipient?.email || 'Unknown')}`}
            </p>
            <p className="text-xs font-serif text-ink-light italic mt-1">
              {format(letter.createdAt, 'MMM d, yyyy')}
            </p>
          </div>

          {/* Content Preview */}
          <div className="font-handwriting text-base text-ink/80 line-clamp-4 leading-relaxed">
            {letter.content}
          </div>

          {/* Read status for sent letters */}
          {type === 'sent' && (
            <div className="mt-3 pt-3 border-t border-ink/5">
              {letter.isRead && letter.readAt ? (
                <div className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-body text-green-700">
                    Seen {format(letter.readAt, 'MMM d')}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5 text-ink-light"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  <span className="text-xs font-body text-ink-light italic">
                    Not seen
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
