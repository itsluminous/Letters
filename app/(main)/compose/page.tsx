"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PapyrusScroll } from "@/components/letters";
import { useContacts } from "@/lib/hooks/useContacts";
import { useToast } from "@/lib/contexts/ToastContext";
import { createClient } from "@/lib/supabase/client";
import { PapyrusLoadingOverlay } from "@/components/ui/PapyrusSpinner";
import { Letter } from "@/lib/supabase/types";

/**
 * Compose Letter Page
 *
 * Allows users to compose and send new letters to their contacts
 * Features:
 * - Editable papyrus scroll interface
 * - Recipient selection from contacts list
 * - Auto-populated date and time
 * - Form validation (content and recipient required)
 * - Letter creation with Supabase
 * - Edit existing unseen letters
 */
export default function ComposePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editLetterId = searchParams.get("edit");
  const { contacts, isLoading: contactsLoading } = useContacts();
  const { showError, showSuccess } = useToast();
  const [isSending, setIsSending] = useState(false);
  const [isLoadingLetter, setIsLoadingLetter] = useState(false);
  const [editingLetter, setEditingLetter] = useState<Letter | null>(null);
  const supabase = createClient();

  // Load letter for editing if edit parameter is present
  useEffect(() => {
    const loadLetter = async () => {
      if (!editLetterId) return;

      setIsLoadingLetter(true);
      try {
        const { data, error } = await supabase
          .from("letters")
          .select("*")
          .eq("id", editLetterId)
          .single();

        if (error) throw error;

        if (!data) {
          throw new Error("Letter not found");
        }

        // Check if letter has been read - can't edit if read
        if (data.is_read) {
          showError("Cannot edit a letter that has already been seen");
          router.push("/sent");
          return;
        }

        // Transform to Letter type (without author/recipient details for editing)
        const letter: Letter = {
          id: data.id,
          authorId: data.author_id,
          recipientId: data.recipient_id,
          content: data.content,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          isRead: data.is_read,
          readAt: data.read_at ? new Date(data.read_at) : null,
        };

        setEditingLetter(letter);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load letter";
        showError(errorMessage);
        router.push("/sent");
      } finally {
        setIsLoadingLetter(false);
      }
    };

    loadLetter();
  }, [editLetterId, supabase, showError, router]);

  const handleSave = async (content: string, recipientId: string) => {
    try {
      setIsSending(true);

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Validate inputs
      if (!content.trim()) {
        throw new Error("Letter content is required");
      }

      if (!recipientId) {
        throw new Error("Please select a recipient");
      }

      if (editingLetter) {
        // Update existing letter
        const { error: updateError } = await supabase
          .from("letters")
          .update({
            content: content.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingLetter.id);

        if (updateError) {
          throw updateError;
        }

        showSuccess("Letter updated successfully!");
      } else {
        // Create new letter
        const { error: insertError } = await supabase.from("letters").insert({
          author_id: user.id,
          recipient_id: recipientId,
          content: content.trim(),
          is_read: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (insertError) {
          throw insertError;
        }

        showSuccess("Letter sent successfully!");
      }

      // Navigate to sent page after successful save
      router.push("/sent");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send letter";
      showError(errorMessage);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  // Convert contacts to recipient options format
  const recipientOptions = contacts.map((contact) => ({
    id: contact.contactUserId,
    name: contact.displayName,
  }));

  if (contactsLoading || isLoadingLetter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-papyrus-text font-heading text-xl">
          {isLoadingLetter ? "Loading letter..." : "Loading contacts..."}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto relative">
      <PapyrusLoadingOverlay
        isLoading={isSending}
        text={editingLetter ? "Updating letter..." : "Sending letter..."}
      />

      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-papyrus-text text-center mb-2">
          {editingLetter ? "Edit Letter" : "Compose New Letter"}
        </h1>
        {contacts.length === 0 && !editingLetter && (
          <p className="text-center text-sm sm:text-base text-papyrus-text-light font-body px-4">
            You need to add contacts before you can send letters.{" "}
            <button
              onClick={() => router.push("/contacts/add")}
              className="text-papyrus-accent underline hover:text-papyrus-darker active:text-papyrus-darker min-h-[44px] inline-flex items-center"
            >
              Add a contact
            </button>
          </p>
        )}
      </div>

      <PapyrusScroll
        mode="compose"
        onSave={handleSave}
        recipientOptions={recipientOptions}
        letter={editingLetter || undefined}
        contacts={contacts}
      />
    </div>
  );
}
