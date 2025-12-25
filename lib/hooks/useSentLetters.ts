"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Letter, LetterFilters } from "@/lib/supabase/types";
import {
  logError,
  getUserFriendlyErrorMessage,
  retryWithBackoff,
} from "@/lib/utils/errorLogger";

/**
 * Custom hook for fetching and managing sent letters
 *
 * Fetches letters authored by the current user with the following logic:
 * - Sorted by newest first
 * - Includes recipient information (email and last login timestamp)
 * - Shows read timestamp when recipient has viewed the letter
 * - Supports filtering by contacts and date ranges
 *
 * @param filters - Optional filters to apply to letter queries
 * @returns Object containing letters array, loading state, error, and utility functions
 */
export function useSentLetters(filters?: LetterFilters) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const fetchSentLetters = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await retryWithBackoff(async () => {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Build query for sent letters
        let query = supabase
          .from("letters")
          .select(
            `
          id,
          author_id,
          recipient_id,
          content,
          created_at,
          updated_at,
          is_read,
          read_at
        `
          )
          .eq("author_id", user.id);

        // Apply filters
        if (filters?.contactIds && filters.contactIds.length > 0) {
          query = query.in("recipient_id", filters.contactIds);
        }
        if (filters?.beforeDate) {
          query = query.lt("created_at", filters.beforeDate.toISOString());
        }
        if (filters?.afterDate) {
          query = query.gt("created_at", filters.afterDate.toISOString());
        }

        // Sort by newest first
        query = query.order("created_at", { ascending: false });

        const { data: sentLetters, error: sentError } = await query;

        if (sentError) throw sentError;

        if (sentLetters && sentLetters.length > 0) {
          // Fetch recipient user profiles to get last_login_at
          const recipientIds = Array.from(
            new Set(sentLetters.map((l) => l.recipient_id))
          );
          const { data: profiles, error: profilesError } = await supabase
            .from("user_profiles")
            .select("id, last_login_at")
            .in("id", recipientIds);

          if (profilesError) {
            console.error("Error fetching recipient profiles:", profilesError);
          }

          // Create a map of recipient profiles
          const profilesMap = new Map((profiles || []).map((p) => [p.id, p]));

          const lettersWithRecipients: Letter[] = sentLetters.map((letter) => ({
            id: letter.id,
            authorId: letter.author_id,
            recipientId: letter.recipient_id,
            content: letter.content,
            createdAt: new Date(letter.created_at),
            updatedAt: new Date(letter.updated_at),
            isRead: letter.is_read,
            readAt: letter.read_at ? new Date(letter.read_at) : null,
            recipient: {
              id: letter.recipient_id,
              email: letter.recipient_id, // Using ID as placeholder
              lastLoginAt: profilesMap.get(letter.recipient_id)?.last_login_at
                ? new Date(profilesMap.get(letter.recipient_id)!.last_login_at!)
                : null,
            },
          }));

          setLetters(lettersWithRecipients);
        } else {
          setLetters([]);
        }

        setIsLoading(false);
      });
    } catch (err) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      logError(err, { context: "useSentLetters.fetchSentLetters", filters });
      setError(errorMessage);
      setIsLoading(false);
    }
  }, [supabase, filters]);

  useEffect(() => {
    fetchSentLetters();
  }, [fetchSentLetters]);

  return {
    letters,
    isLoading,
    error,
    refetch: fetchSentLetters,
  };
}
