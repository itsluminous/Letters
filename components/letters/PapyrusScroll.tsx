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
  
  const getAuthorDisplayName = () => {
    if (!letter?.author) return 'You';
    const contact = contacts.find(c => c.contactUserId === letter.author?.id);
    return contact?.displayName || letter.author.email;
  };
  
  const displayAuthor = getAuthorDisplayName();

  return (
    <div
      className={cn(
        'relative w-full max-w-4xl mx-auto shadow-papyrus-lg',
        'bg-papyrus-bg border-y-4 border-papyrus-darker',
        'bg-papyrus-texture',
        'py-12 px-8 sm:px-12 md:px-16',
        'min-h-[600px]',
        className
      )}
    >
      {/* Rolled ends effect */}
      <div className="absolute -top-4 left-0 w-full h-8 bg-gradient-to-b from-black/20 to-transparent opacity-50" />
      <div className="absolute -bottom-4 left-0 w-full h-8 bg-gradient-to-t from-black/20 to-transparent opacity-50" />
      <div className="absolute -top-1 left-0 w-full h-2 bg-papyrus-dark" />
      <div className="absolute -bottom-1 left-0 w-full h-2 bg-papyrus-dark" />

      {/* Action buttons for sent letters */}
      {isView && canEdit && canDelete && (
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <PapyrusButton size="sm" variant="secondary" onClick={handleEditClick} aria-label="Edit letter" title="Edit letter">
            Edit
          </PapyrusButton>
          <PapyrusButton size="sm" variant="secondary" onClick={() => setShowDeleteConfirm(true)} aria-label="Delete letter" title="Delete letter">
            Delete
          </PapyrusButton>
        </div>
      )}

      {/* Letter metadata */}
      <div className="mb-8 pb-6 border-b-2 border-papyrus-border/70">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
          <div className="font-heading text-papyrus-text">
            <p className="text-base">
              {isCompose ? 'From: You' : `From: ${displayAuthor}`}
            </p>
            {!isCompose && letter?.recipient && (
              <p className="text-base">
                To: {letter.recipient.email}
              </p>
            )}
          </div>
          <div className="font-heading text-papyrus-text-light text-base text-right">
            <p>{format(displayDate, 'MMMM d, yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Recipient selection for compose mode */}
      {isCompose && (
        <div className="mb-6">
          <label className="block mb-2 font-heading text-papyrus-text font-bold uppercase tracking-wider text-sm">
            To:
          </label>
          <select
            value={selectedRecipientId}
            onChange={(e) => setSelectedRecipientId(e.target.value)}
            className="w-full px-4 py-3 font-body text-base text-papyrus-text bg-papyrus-bg/50 border-2 border-papyrus-border focus:outline-none focus:border-papyrus-accent focus:bg-papyrus-bg transition-colors duration-200 min-h-[50px]"
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
            className="w-full min-h-[400px] p-2 font-handwriting text-2xl text-papyrus-text bg-transparent focus:outline-none resize-none leading-relaxed"
            placeholder="Dearest..."
            disabled={isSaving}
          />
        ) : (
          <div className="min-h-[400px] p-2 font-handwriting text-2xl text-papyrus-text whitespace-pre-wrap break-words leading-relaxed">
            {content || ''}
          </div>
        )}
      </div>

      {/* Action buttons */}
      {(isCompose || isEditing) && (
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-end">
          {isEditing && !isCompose && (
            <PapyrusButton
              variant="secondary"
              onClick={handleCancelEdit}
              disabled={isSaving}
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
          >
            {isSaving ? 'Saving...' : isCompose ? 'Send Letter' : 'Save Changes'}
          </PapyrusButton>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-papyrus-bg border-4 border-papyrus-border bg-papyrus-texture shadow-papyrus-lg p-6 max-w-md w-full">
            <h3 className="font-heading text-xl text-papyrus-text mb-4">
              Delete Letter?
            </h3>
            <p className="font-body text-base text-papyrus-text mb-6">
              Are you sure you want to permanently delete this letter? This action cannot be undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <PapyrusButton
                variant="secondary"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSaving}
              >
                Cancel
              </PapyrusButton>
              <PapyrusButton
                variant="primary"
                onClick={handleDelete}
                disabled={isSaving}
                className="bg-red-800 hover:bg-red-900 border-red-900/50"
              >
                {isSaving ? 'Deleting...' : 'Delete Forever'}
              </PapyrusButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
