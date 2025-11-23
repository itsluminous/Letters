'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLetters, useContacts } from '@/lib/hooks';
import { LetterStack, FilterPanel, ViewMode } from '@/components/letters';
import { LetterGrid } from '@/components/letters/LetterGrid';
import { LetterList } from '@/components/letters/LetterList';
import { PapyrusButton, PapyrusSpinner } from '@/components/ui';
import { LetterFilters } from '@/lib/supabase/types';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useToast } from '@/lib/contexts/ToastContext';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('stack');

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

  // Handle letter selection from stack/grid/list
  const handleLetterSelect = (letterId: string) => {
    const index = letters.findIndex(l => l.id === letterId);
    if (index !== -1) {
      setCurrentIndex(index);
      // Switch to stack view when a letter is selected from grid/list
      if (viewMode !== 'stack') {
        setViewMode('stack');
      }
      
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

  const handleFilterChange = (newFilters: LetterFilters) => {
    setFilters(newFilters);
    // Reset selection when filters change
    setCurrentIndex(0);
  };

  const hasActiveFilters = filters.contactIds.length > 0 || filters.beforeDate !== null || filters.afterDate !== null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filter Panel - only show if contacts loaded successfully and there are contacts */}
      {!contactsLoading && !contactsError && contacts && contacts.length > 0 && (
        <div className="mb-4 sm:mb-6">
          <FilterPanel
            contacts={contacts}
            filters={filters}
            onFilterChange={handleFilterChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </div>
      )}

      {/* Empty state - no letters */}
      {letters.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md px-4">
            <div className="bg-papyrus-bg border-4 border-papyrus-border papyrus-texture papyrus-shadow p-8 mb-6">
              <h2 className="font-heading text-2xl text-papyrus-text mb-4">
                {hasActiveFilters ? 'No Matching Letters' : 'No Letters Yet'}
              </h2>
              <p className="font-body text-papyrus-text-light mb-6">
                {hasActiveFilters 
                  ? 'No letters match your current filters. Try adjusting your filter criteria.'
                  : "You haven't received any letters yet. Add a contact to start exchanging letters with your partner."}
              </p>
              {!hasActiveFilters && (
                <PapyrusButton onClick={() => router.push('/contacts/add')}>
                  Add Contact
                </PapyrusButton>
              )}
            </div>
            {!hasActiveFilters && (
              <p className="font-body text-sm text-papyrus-text-light">
                Tip: Share your user ID with your partner so they can add you as a contact too! {user?.id && `(${user.id})`}
              </p>
            )}
          </div>
        </div>
      ) : (
        /* Render based on view mode */
        <>
          {viewMode === 'stack' && (
            <LetterStack
              letters={letters}
              type="inbox"
              onLetterSelect={handleLetterSelect}
              currentIndex={currentIndex}
              contacts={contacts}
            />
          )}
          {viewMode === 'grid' && (
            <LetterGrid
              letters={letters}
              type="inbox"
              onLetterSelect={handleLetterSelect}
              contacts={contacts}
            />
          )}
          {viewMode === 'list' && (
            <LetterList
              letters={letters}
              type="inbox"
              onLetterSelect={handleLetterSelect}
              contacts={contacts}
            />
          )}
        </>
      )}
    </div>
  );
}
