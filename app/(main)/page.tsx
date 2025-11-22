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
  const { showError, showSuccess } = useToast();
  const [filters, setFilters] = useState<LetterFilters>({
    contactIds: [],
    beforeDate: null,
    afterDate: null,
  });
  const { letters, isLoading, error, markAsRead, refetch } = useLetters(filters);
  const { contacts, isLoading: contactsLoading, error: contactsError } = useContacts();
  const [selectedLetterId, setSelectedLetterId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log('HomePage state:', {
      isLoading,
      error,
      lettersCount: letters.length,
      contactsLoading,
      contactsError,
      contactsCount: contacts?.length,
    });
  }, [isLoading, error, letters.length, contactsLoading, contactsError, contacts?.length]);

  // Show error toasts
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  useEffect(() => {
    if (contactsError) {
      showError(contactsError);
    }
  }, [contactsError, showError]);

  // Set initial selected letter when letters load
  useEffect(() => {
    if (letters.length > 0 && !selectedLetterId) {
      setSelectedLetterId(letters[0].id);
      setCurrentIndex(0);
    }
  }, [letters, selectedLetterId]);

  // Handle letter selection from stack
  const handleLetterSelect = (letterId: string) => {
    const index = letters.findIndex(l => l.id === letterId);
    if (index !== -1) {
      setSelectedLetterId(letterId);
      setCurrentIndex(index);
      
      // Mark as read if unread
      const letter = letters[index];
      if (!letter.isRead) {
        markAsRead(letterId).catch(err => {
          const message = err instanceof Error ? err.message : 'Failed to mark letter as read';
          showError(message);
        });
      }
    }
  };

  // Handle navigation
  const handleNavigate = (index: number) => {
    if (index >= 0 && index < letters.length) {
      const letter = letters[index];
      setSelectedLetterId(letter.id);
      setCurrentIndex(index);
      
      // Mark as read if unread
      if (!letter.isRead) {
        markAsRead(letter.id).catch(err => {
          const message = err instanceof Error ? err.message : 'Failed to mark letter as read';
          showError(message);
        });
      }
    }
  };

  // Loading state - only show loading if letters are loading
  // Don't block on contacts loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <PapyrusSpinner size="lg" text="Loading your letters..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md bg-papyrus-bg border-4 border-papyrus-border papyrus-shadow-lg p-8 papyrus-texture-overlay">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="font-heading text-xl text-papyrus-text mb-4">
            Failed to load letters
          </p>
          <p className="font-body text-papyrus-text-light mb-6">
            {error}
          </p>
          <PapyrusButton onClick={() => refetch()}>
            Try Again
          </PapyrusButton>
        </div>
      </div>
    );
  }

  // Empty state - no letters
  if (letters.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md px-4">
          <div className="bg-papyrus-bg border-4 border-papyrus-border papyrus-texture papyrus-shadow p-8 mb-6">
            <h2 className="font-heading text-2xl text-papyrus-text mb-4">
              No Letters Yet
            </h2>
            <p className="font-body text-papyrus-text-light mb-6">
              You haven&apos;t received any letters yet. Add a contact to start exchanging letters with your partner.
            </p>
            <PapyrusButton onClick={() => router.push('/contacts/add')}>
              Add Contact
            </PapyrusButton>
          </div>
          <p className="font-body text-sm text-papyrus-text-light">
            Tip: Share your user ID with your partner so they can add you as a contact too! {user?.id && `(${user.id})`}
          </p>
        </div>
      </div>
    );
  }

  const selectedLetter = letters.find(l => l.id === selectedLetterId);

  const handleFilterChange = (newFilters: LetterFilters) => {
    setFilters(newFilters);
    // Reset selection when filters change
    setSelectedLetterId(null);
    setCurrentIndex(0);
  };

  return (
    <div className="container mx-auto">
      {/* Filter Panel - only show if contacts loaded successfully and there are contacts */}
      {!contactsLoading && !contactsError && contacts && contacts.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <FilterPanel
            contacts={contacts}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Letter Stack - Hidden on mobile when letter is selected, visible on desktop */}
        <div className={cn(
          'lg:col-span-4',
          selectedLetter && 'hidden lg:block'
        )}>
          <LetterStack
            letters={letters}
            type="inbox"
            onLetterSelect={handleLetterSelect}
            currentIndex={currentIndex}
            contacts={contacts}
          />
        </div>

        {/* Letter Viewer - Full width on mobile, right side on desktop */}
        <div className={cn(
          'lg:col-span-8',
          !selectedLetter && 'hidden lg:block'
        )}>
          {selectedLetter ? (
            <LetterNavigation
              letters={letters}
              currentIndex={currentIndex}
              onNavigate={handleNavigate}
            >
              {(letter) => (
                <PapyrusScroll
                  letter={letter}
                  mode="view"
                  contacts={contacts}
                />
              )}
            </LetterNavigation>
          ) : (
            <div className="flex items-center justify-center min-h-[400px] sm:min-h-[500px] bg-papyrus-bg border-2 sm:border-4 border-papyrus-border papyrus-texture papyrus-shadow">
              <p className="font-body text-sm sm:text-base text-papyrus-text-light">
                Select a letter to read
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile back button when viewing a letter */}
      {selectedLetter && (
        <div className="lg:hidden fixed bottom-4 left-4 z-50">
          <button
            onClick={() => {
              setSelectedLetterId(null);
              setCurrentIndex(0);
            }}
            className="flex items-center gap-2 bg-papyrus-dark border-2 border-papyrus-border papyrus-shadow-lg px-4 py-3 font-heading text-papyrus-text hover:bg-papyrus-darker active:bg-papyrus-darker transition-colors min-h-[44px]"
            aria-label="Back to letter list"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            <span>Back</span>
          </button>
        </div>
      )}
    </div>
  );
}
