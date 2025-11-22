'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLetters, useContacts } from '@/lib/hooks';
import { LetterStack, FilterPanel } from '@/components/letters';
import { LetterNavigation } from '@/components/letters/LetterNavigation';
import { PapyrusScroll } from '@/components/letters/PapyrusScroll';
import { PapyrusButton, PapyrusSpinner } from '@/components/ui';
import { LetterFilters } from '@/lib/supabase/types';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { cn } from '@/lib/utils/cn';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { showError } = useToast();
  const [filters, setFilters] = useState<LetterFilters>({
    contactIds: [],
    beforeDate: null,
    afterDate: null,
  });
  const { letters, isLoading, error, markAsRead, refetch } = useLetters(filters);
  const { contacts, isLoading: contactsLoading, error: contactsError } = useContacts();
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (error) showError(error);
    if (contactsError) showError(contactsError);
  }, [error, contactsError, showError]);

  useEffect(() => {
    if (letters.length > 0 && !selectedLetterId) {
      setSelectedLetterId(letters[0].id);
      setCurrentIndex(0);
    }
  }, [letters, selectedLetterId]);

  const handleLetterSelect = (letterId: string) => {
    const index = letters.findIndex(l => l.id === letterId);
    if (index !== -1) {
      setSelectedLetterId(letterId);
      setCurrentIndex(index);
      if (!letters[index].isRead) {
        markAsRead(letterId).catch(err => showError(err instanceof Error ? err.message : 'Failed to mark as read'));
      }
    }
  };

  const handleNavigate = (index: number) => {
    if (index >= 0 && index < letters.length) {
      const letter = letters[index];
      setSelectedLetterId(letter.id);
      setCurrentIndex(index);
      if (!letter.isRead) {
        markAsRead(letter.id).catch(err => showError(err instanceof Error ? err.message : 'Failed to mark as read'));
      }
    }
  };

  const handleFilterChange = (newFilters: LetterFilters) => {
    setFilters(newFilters);
    setSelectedLetterId(null);
    setCurrentIndex(0);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <PapyrusSpinner size="lg" text="Loading your letters..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md bg-papyrus-dark/30 border-4 border-dashed border-papyrus-border p-8">
          <h2 className="font-heading text-2xl text-papyrus-text mb-4">Error Loading Letters</h2>
          <p className="font-body text-papyrus-text-light mb-6">{error}</p>
          <PapyrusButton onClick={() => refetch()}>Try Again</PapyrusButton>
        </div>
      </div>
    );
  }

  if (letters.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md p-4">
          <div className="bg-papyrus-dark/30 border-4 border-dashed border-papyrus-border p-8 mb-6">
            <h2 className="font-heading text-2xl text-papyrus-text mb-4">Your Scroll is Empty</h2>
            <p className="font-body text-papyrus-text-light mb-6">
              Add a contact to begin exchanging letters.
            </p>
            <PapyrusButton onClick={() => router.push('/contacts/add')}>Add a Contact</PapyrusButton>
          </div>
        </div>
      </div>
    );
  }

  const selectedLetter = letters.find(l => l.id === selectedLetterId);

  return (
    <div>
      {!contactsLoading && !contactsError && contacts && contacts.length > 0 && (
        <div className="mb-8">
          <FilterPanel contacts={contacts} filters={filters} onFilterChange={handleFilterChange} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className={cn('lg:col-span-4', selectedLetter && 'hidden lg:block')}>
          <LetterStack
            letters={letters}
            type="inbox"
            onLetterSelect={handleLetterSelect}
            currentIndex={currentIndex}
            contacts={contacts}
          />
        </div>

        <div className={cn('lg:col-span-8', !selectedLetter && 'hidden lg:block')}>
          {selectedLetter ? (
            <LetterNavigation letters={letters} currentIndex={currentIndex} onNavigate={handleNavigate}>
              {(letter) => <PapyrusScroll letter={letter} mode="view" contacts={contacts} />}
            </LetterNavigation>
          ) : (
            <div className="flex items-center justify-center min-h-[600px] bg-papyrus-dark/30 border-4 border-dashed border-papyrus-border">
              <p className="font-heading text-xl text-papyrus-text-light">Select a letter to read</p>
            </div>
          )}
        </div>
      </div>

      {selectedLetter && (
        <div className="lg:hidden fixed bottom-4 left-4 z-50">
          <PapyrusButton
            size="sm"
            variant="secondary"
            onClick={() => setSelectedLetterId(null)}
            aria-label="Back to letter list"
          >
            Back to Letters
          </PapyrusButton>
        </div>
      )}
    </div>
  );
}
