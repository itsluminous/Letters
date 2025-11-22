'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PapyrusScroll } from '@/components/letters';
import { useContacts } from '@/lib/hooks/useContacts';
import { useToast } from '@/lib/contexts/ToastContext';
import { createClient } from '@/lib/supabase/client';
import { PapyrusLoadingOverlay } from '@/components/ui/PapyrusSpinner';

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
 */
export default function ComposePage() {
  const router = useRouter();
  const { contacts, isLoading: contactsLoading } = useContacts();
  const { showError, showSuccess } = useToast();
  const [isSending, setIsSending] = useState(false);
  const supabase = createClient();

  const handleSave = async (content: string, recipientId: string) => {
    try {
      setIsSending(true);

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Validate inputs
      if (!content.trim()) {
        throw new Error('Letter content is required');
      }

      if (!recipientId) {
        throw new Error('Please select a recipient');
      }

      // Create letter in database
      const { error: insertError } = await supabase
        .from('letters')
        .insert({
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

      showSuccess('Letter sent successfully!');
      // Navigate to home page after successful send
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send letter';
      showError(errorMessage);
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  // Convert contacts to recipient options format
  const recipientOptions = contacts.map(contact => ({
    id: contact.contactUserId,
    name: contact.displayName,
  }));

  if (contactsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-papyrus-text font-heading text-xl">
          Loading contacts...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto relative">
      <PapyrusLoadingOverlay isLoading={isSending} text="Sending letter..." />
      
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-papyrus-text text-center mb-2">
          Compose New Letter
        </h1>
        {contacts.length === 0 && (
          <p className="text-center text-sm sm:text-base text-papyrus-text-light font-body px-4">
            You need to add contacts before you can send letters.{' '}
            <button
              onClick={() => router.push('/contacts/add')}
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
      />
    </div>
  );
}
