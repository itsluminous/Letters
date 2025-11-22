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

  return (
    <div className={cn('relative', className)}>
      {type === 'inbox' && unreadCount > 0 && (
        <div className="absolute -top-3 -right-3 z-50">
          <div className="bg-wax border-2 border-white shadow-md rounded-full w-10 h-10 flex items-center justify-center">
            <span className="font-heading text-[#f4e8d0] text-md font-bold">{unreadCount}</span>
          </div>
        </div>
      )}

      <div className="relative w-full" style={{ minHeight: '300px' }}>
        {visibleLetters.map((letter, index) => {
          const isSelected = currentIndex === index;
          return (
            <div
              key={letter.id}
              className={cn(
                'absolute inset-0 cursor-pointer transition-all duration-300',
                'bg-[#fffbf0] border', // Clean paper background
                isSelected
                  ? 'border-wax shadow-papyrus-lg' // Active state: Red border
                  : 'border-ink/10 shadow-papyrus hover:border-ink/30', // Inactive state
                'p-6 sm:p-8',
                'flex flex-col'
              )}
              style={getStackStyle(index)}
              onClick={() => onLetterSelect(letter.id)}
            >
              {/* Header */}
              <div className="border-b border-ink/10 pb-2 mb-2 flex justify-between items-end">
                 <div className="font-heading text-ink text-sm font-bold uppercase tracking-wide">
                    {type === 'inbox' 
                      ? `From: ${getDisplayName(letter.author?.id, letter.author?.email || 'Unknown')}` 
                      : `To: ${getDisplayName(letter.recipient?.id, letter.recipient?.email || 'Unknown')}`}
                 </div>
                 <div className="font-serif text-ink-light text-xs">
                    {format(letter.createdAt, 'MMM d, yyyy')}
                 </div>
              </div>

              {/* Content Preview - Handwriting */}
              <div className="font-handwriting text-xl text-ink/80 line-clamp-3 leading-relaxed pt-2">
                {letter.content}
              </div>
              
              {/* Read Status */}
              {type === 'inbox' && !letter.isRead && (
                  <div className="absolute top-3 right-3 w-2 h-2 bg-wax rounded-full" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};