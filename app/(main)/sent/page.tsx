"use client";

import { useState, useEffect } from "react";
import { useSentLetters, useContacts, useLetterOperations } from "@/lib/hooks";
import { LetterStack, FilterPanel, ViewMode } from "@/components/letters";
import { LetterGrid } from "@/components/letters/LetterGrid";
import { LetterList } from "@/components/letters/LetterList";
import {
  PapyrusButton,
  PapyrusSpinner,
  PapyrusConfirmDialog,
} from "@/components/ui";
import { LetterFilters } from "@/lib/supabase/types";
import { useToast } from "@/lib/contexts/ToastContext";
import { useRouter } from "next/navigation";

export default function SentLettersPage() {
  const router = useRouter();
  const { showError, showSuccess } = useToast();
  const { updateLetter, deleteLetter } = useLetterOperations();
  const [filters, setFilters] = useState<LetterFilters>({
    contactIds: [],
    beforeDate: null,
    afterDate: null,
  });
  const { letters, isLoading, error, refetch } = useSentLetters(filters);
  const {
    contacts,
    isLoading: contactsLoading,
    error: contactsError,
  } = useContacts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [letterToDelete, setLetterToDelete] = useState<string | null>(null);

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
    const index = letters.findIndex((l) => l.id === letterId);
    if (index !== -1) {
      setCurrentIndex(index);
      // Switch to stack view when a letter is selected from grid/list
      if (viewMode !== "stack") {
        setViewMode("stack");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <PapyrusSpinner size="lg" text="Loading your sent letters..." />
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
            Failed to load sent letters
          </p>
          <p className="font-body text-papyrus-text-light mb-6">{error}</p>
          <PapyrusButton onClick={() => refetch()}>Try Again</PapyrusButton>
        </div>
      </div>
    );
  }

  const handleFilterChange = (newFilters: LetterFilters) => {
    setFilters(newFilters);
    // Reset selection when filters change
    setCurrentIndex(0);
  };

  const handleEdit = (letterId: string) => {
    // Navigate to compose page with letter ID for editing
    router.push(`/compose?edit=${letterId}`);
  };

  const handleDelete = (letterId: string) => {
    setLetterToDelete(letterId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!letterToDelete) return;

    try {
      await deleteLetter(letterToDelete);
      showSuccess("Letter deleted successfully");
      await refetch();
      setDeleteConfirmOpen(false);
      setLetterToDelete(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete letter";
      showError(message);
    }
  };

  const hasActiveFilters =
    filters.contactIds.length > 0 ||
    filters.beforeDate !== null ||
    filters.afterDate !== null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="mb-4 sm:mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl text-papyrus-text">
          Sent Letters
        </h1>
        <p className="font-body text-sm sm:text-base text-papyrus-text-light mt-1 sm:mt-2">
          View and manage letters you&apos;ve sent
        </p>
      </div>

      {/* Filter Panel - only show if contacts loaded successfully and there are contacts */}
      {!contactsLoading &&
        !contactsError &&
        contacts &&
        contacts.length > 0 && (
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

      {/* Empty state - no sent letters */}
      {letters.length === 0 ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md px-4">
            <div className="bg-papyrus-bg border-4 border-papyrus-border papyrus-texture papyrus-shadow p-8">
              <h2 className="font-heading text-2xl text-papyrus-text mb-4">
                {hasActiveFilters ? "No Matching Letters" : "No Sent Letters"}
              </h2>
              <p className="font-body text-papyrus-text-light mb-6">
                {hasActiveFilters
                  ? "No letters match your current filters. Try adjusting your filter criteria."
                  : "You haven't sent any letters yet. Compose a new letter to get started."}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Render based on view mode */
        <>
          {viewMode === "stack" && (
            <LetterStack
              letters={letters}
              type="sent"
              onLetterSelect={handleLetterSelect}
              currentIndex={currentIndex}
              contacts={contacts}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
          {viewMode === "grid" && (
            <LetterGrid
              letters={letters}
              type="sent"
              onLetterSelect={handleLetterSelect}
              contacts={contacts}
            />
          )}
          {viewMode === "list" && (
            <LetterList
              letters={letters}
              type="sent"
              onLetterSelect={handleLetterSelect}
              contacts={contacts}
            />
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <PapyrusConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setLetterToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Letter"
        message="Are you sure you want to delete this letter? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
