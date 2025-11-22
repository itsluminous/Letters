'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { Letter, Contact } from '@/lib/supabase/types';
import { format } from 'date-fns';
import { PapyrusButton } from '@/components/ui';

export interface PapyrusScrollProps {
  letter?: Letter;
  mode: 'view' | 'edit' | 'compose';
  onSave?: (content: string, recipientId: string) => Promise<void>;
  onEdit?: (content: string) => Promise<void>;
  onDelete?: () => Promise<void>;
  showActions?: boolean;
  recipientOptions?: Array<{ id: string; name: string }>;
  contacts?: Contact[];
  className?: string;
}

export const PapyrusScroll: React.FC<PapyrusScrollProps> = ({
  letter,
  mode,
  onSave,
  onEdit,
  onDelete,
  showActions = false,
  recipientOptions = [],
  contacts = [],
  className,
}) => {
  const [content, setContent] = useState(letter?.content || '');
  const [selectedRecipientId, setSelectedRecipientId] = useState(
    letter?.recipientId || ''
  );
  const [isEditing, setIsEditing] = useState(mode === 'edit' || mode === 'compose');
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isCompose = mode === 'compose';
  const isView = mode === 'view';
  const canEdit = showActions && !letter?.isRead;
  const canDelete = showActions && !letter?.isRead;

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      if (isCompose && onSave) {
        if (!selectedRecipientId) return;
        await onSave(content, selectedRecipientId);
      } else if (onEdit) {
        await onEdit(content);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsSaving(true);
    try {
      await onDelete();
    } catch (error) {
      console.error('Failed to delete:', error);
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setContent(letter?.content || '');
    setIsEditing(false);
  };

  const currentDate = new Date();
  const displayDate = letter?.createdAt || currentDate;
  
  // Look up author's display name from contacts
  const getAuthorDisplayName = () => {
    if (!letter?.author) return 'You';
    
    // Find contact by matching contact_user_id with author's id
    const contact = contacts.find(c => c.contactUserId === letter.author?.id);
    return contact?.displayName || letter.author.email;
  };
  
  const displayAuthor = getAuthorDisplayName();

  return (
    <div
      className={cn(
        'relative w-full max-w-4xl mx-auto papyrus-shadow-lg',
        'bg-papyrus-bg border-2 sm:border-4 border-papyrus-border',
        'papyrus-texture',
        'p-4 sm:p-6 md:p-8 lg:p-12',
        'min-h-[400px] sm:min-h-[500px] md:min-h-[600px]',
        className
      )}
    >
      {/* Decorative torn edges effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-papyrus-darker to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-t from-papyrus-darker to-transparent" />
      </div>

      {/* Action buttons for sent letters */}
      {isView && canEdit && canDelete && (
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2 z-10">
          <button
            onClick={handleEditClick}
            className="p-2 sm:p-3 bg-papyrus-dark border-2 border-papyrus-border hover:bg-papyrus-darker active:bg-papyrus-darker transition-colors papyrus-shadow min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Edit letter"
            title="Edit letter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-papyrus-text"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 sm:p-3 bg-papyrus-dark border-2 border-papyrus-border hover:bg-red-100 hover:border-red-600 active:bg-red-100 active:border-red-600 transition-colors papyrus-shadow min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Delete letter"
            title="Delete letter"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 text-papyrus-text"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Letter metadata */}
      <div className="mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-papyrus-border">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="font-heading text-papyrus-text">
            <p className="text-xs sm:text-sm md:text-base">
              {isCompose ? 'From: You' : `From: ${displayAuthor}`}
            </p>
            {!isCompose && letter?.recipient && (
              <p className="text-xs sm:text-sm md:text-base">
                To: {letter.recipient.email}
              </p>
            )}
          </div>
          <div className="font-heading text-papyrus-text-light text-xs sm:text-sm md:text-base text-right">
            <p className="hidden sm:block">{format(displayDate, 'MMMM d, yyyy')}</p>
            <p className="sm:hidden">{format(displayDate, 'MMM d, yyyy')}</p>
            <p>{format(displayDate, 'h:mm a')}</p>
          </div>
        </div>
      </div>

      {/* Recipient selection for compose mode */}
      {isCompose && (
        <div className="mb-4 sm:mb-6">
          <label className="block mb-2 font-heading text-papyrus-text font-semibold text-sm sm:text-base">
            To:
          </label>
          <select
            value={selectedRecipientId}
            onChange={(e) => setSelectedRecipientId(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 font-body text-sm sm:text-base text-papyrus-text bg-papyrus-bg border-2 border-papyrus-border papyrus-texture-overlay focus:outline-none focus:border-papyrus-accent focus:ring-2 focus:ring-papyrus-accent/20 min-h-[44px]"
            disabled={isSaving}
          >
            <option value="">Select a recipient...</option>
            {recipientOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Letter content */}
      <div className="relative">
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[250px] sm:min-h-[300px] md:min-h-[400px] px-3 sm:px-4 py-2 sm:py-3 font-handwriting text-base sm:text-lg md:text-xl lg:text-2xl text-papyrus-text bg-transparent border-2 border-papyrus-border focus:outline-none focus:border-papyrus-accent focus:ring-2 focus:ring-papyrus-accent/20 resize-none leading-relaxed"
            placeholder="Write your letter here..."
            disabled={isSaving}
          />
        ) : (
          <div className="min-h-[250px] sm:min-h-[300px] md:min-h-[400px] px-3 sm:px-4 py-2 sm:py-3 font-handwriting text-base sm:text-lg md:text-xl lg:text-2xl text-papyrus-text whitespace-pre-wrap break-words leading-relaxed">
            {content || 'No content'}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {(isCompose || isEditing) && (
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-3 justify-end">
          {isEditing && !isCompose && (
            <PapyrusButton
              variant="secondary"
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="min-h-[44px] w-full sm:w-auto"
            >
              Cancel
            </PapyrusButton>
          )}
          <PapyrusButton
            variant="primary"
            onClick={handleSave}
            disabled={
              isSaving ||
              !content.trim() ||
              (isCompose && !selectedRecipientId)
            }
            className="min-h-[44px] w-full sm:w-auto"
          >
            {isSaving ? 'Saving...' : isCompose ? 'Send Letter' : 'Save Changes'}
          </PapyrusButton>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-papyrus-bg border-4 border-papyrus-border papyrus-texture papyrus-shadow-lg p-4 sm:p-6 max-w-md w-full">
            <h3 className="font-heading text-lg sm:text-xl text-papyrus-text mb-3 sm:mb-4">
              Delete Letter?
            </h3>
            <p className="font-body text-sm sm:text-base text-papyrus-text mb-4 sm:mb-6">
              Are you sure you want to delete this letter? This action cannot be
              undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <PapyrusButton
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSaving}
                className="min-h-[44px] w-full sm:w-auto"
              >
                Cancel
              </PapyrusButton>
              <PapyrusButton
                variant="primary"
                onClick={handleDelete}
                disabled={isSaving}
                className="bg-red-700 hover:bg-red-800 border-red-900 min-h-[44px] w-full sm:w-auto"
              >
                {isSaving ? 'Deleting...' : 'Delete'}
              </PapyrusButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
