'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Contact } from '@/lib/supabase/types';
import { logError, getUserFriendlyErrorMessage, retryWithBackoff } from '@/lib/utils/errorLogger';

/**
 * Custom hook for fetching and managing contacts
 * 
 * Fetches contacts for the current user and provides functionality
 * to add new contacts with automatic retry logic
 * 
 * @returns Object containing contacts array, loading state, error, and utility functions
 */
export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await retryWithBackoff(async () => {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Fetch contacts
        const { data: contactsData, error: contactsError } = await supabase
          .from('contacts')
          .select('*')
          .eq('user_id', user.id)
          .order('display_name', { ascending: true });

        if (contactsError) throw contactsError;

        const contactsList: Contact[] = (contactsData || []).map(contact => ({
          id: contact.id,
          userId: contact.user_id,
          contactUserId: contact.contact_user_id,
          displayName: contact.display_name,
          createdAt: new Date(contact.created_at),
        }));

        setContacts(contactsList);
        setIsLoading(false);
      });
    } catch (err) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      logError(err, { context: 'useContacts.fetchContacts' });
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [supabase]);

  const addContact = useCallback(async (contactUserId: string, displayName: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Add contact - database foreign key constraint will validate user exists
      const { error: insertError } = await supabase
        .from('contacts')
        .insert({
          user_id: user.id,
          contact_user_id: contactUserId,
          display_name: displayName,
        });

      if (insertError) {
        // Check if error is due to foreign key constraint violation
        if (insertError.code === '23503') {
          throw new Error('User ID does not exist. Please check and try again.');
        }
        // Check if error is due to duplicate contact
        if (insertError.code === '23505') {
          throw new Error('This contact already exists.');
        }
        throw insertError;
      }

      // Refetch contacts
      await fetchContacts();
    } catch (err) {
      logError(err, { context: 'useContacts.addContact', contactUserId, displayName });
      throw err instanceof Error ? err : new Error(getUserFriendlyErrorMessage(err));
    }
  }, [supabase, fetchContacts]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return {
    contacts,
    isLoading,
    error,
    refetch: fetchContacts,
    addContact,
  };
}
