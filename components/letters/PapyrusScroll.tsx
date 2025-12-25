"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Letter, Contact } from "@/lib/supabase/types";
import { format } from "date-fns";
import { PapyrusButton } from "@/components/ui";

export interface PapyrusScrollProps {
  letter?: Letter;
  mode: "view" | "edit" | "compose";
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
  const [content, setContent] = useState(letter?.content || "");
  const [selectedRecipientId, setSelectedRecipientId] = useState(
    letter?.recipientId || ""
  );
  const [isEditing, setIsEditing] = useState(
    mode === "edit" || mode === "compose"
  );
  const [isSaving, setIsSaving] = useState(false);

  const isCompose = mode === "compose";
  const displayDate = letter?.createdAt || new Date();

  const getAuthorDisplayName = () => {
    if (!letter?.author) return "You";
    const contact = contacts.find((c) => c.contactUserId === letter.author?.id);
    return contact?.displayName || letter.author.email;
  };

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
      console.error("Failed to save:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className={cn(
        "relative w-full max-w-4xl mx-auto",
        "bg-[#fffbf0]", // The Paper
        "shadow-papyrus-lg", // The Lift
        "p-8 sm:p-12 md:p-16",
        "min-h-[500px]",
        className
      )}
    >
      {/* Metadata Header */}
      <div className="mb-8 border-b-2 border-ink/10 pb-4 flex justify-between items-end">
        <div className="font-heading text-ink">
          <p className="text-sm font-bold uppercase tracking-widest text-ink-light">
            {isCompose ? "From: You" : `From: ${getAuthorDisplayName()}`}
          </p>
          {!isCompose && letter?.recipient && (
            <p className="text-xs mt-1 text-ink-light">
              To: {letter.recipient.email}
            </p>
          )}
        </div>
        <div className="text-right font-serif text-ink-light italic">
          {format(displayDate, "MMMM d, yyyy")}
        </div>
      </div>

      {/* Content Area */}
      <div className="relative">
        {isCompose && (
          <div className="mb-8">
            <select
              value={selectedRecipientId}
              onChange={(e) => setSelectedRecipientId(e.target.value)}
              className="w-full bg-transparent border-b border-ink/20 py-2 font-heading font-bold text-ink focus:outline-none focus:border-wax"
            >
              <option value="">Select Recipient...</option>
              {recipientOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] bg-transparent font-handwriting text-2xl text-ink leading-loose focus:outline-none resize-none p-0 placeholder:text-ink-light/30"
            placeholder="My dearest friend..."
            disabled={isSaving}
          />
        ) : (
          <div className="min-h-[400px] font-handwriting text-2xl text-ink leading-loose whitespace-pre-wrap">
            {content}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {(isCompose || isEditing) && (
        <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-ink/5">
          {isEditing && !isCompose && (
            <button
              onClick={() => setIsEditing(false)}
              className="text-ink-light hover:text-ink font-heading uppercase text-xs font-bold tracking-widest"
            >
              Cancel
            </button>
          )}
          <PapyrusButton
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
          >
            {isSaving
              ? "Sealing..."
              : isCompose
                ? "Seal & Send"
                : "Save Corrections"}
          </PapyrusButton>
        </div>
      )}

      {/* Action Bar (View Mode) */}
      {mode === "view" && showActions && (
        <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Add Edit/Delete icons here styled as subtle ink marks */}
          <button
            onClick={() => setIsEditing(true)}
            className="text-ink-light hover:text-wax"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};
