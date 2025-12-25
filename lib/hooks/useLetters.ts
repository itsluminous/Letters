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
 * Custom hook for fetching and managing inbox letters
 *
 * Fetches letters for the current user with the following logic:
 * - Prioritizes unread letters, sorted by oldest first
 * - Falls back to read letters when no unread exist, sorted by newest first
 * - Provides mark-as-read functionality
 * - Supports filtering by contacts and date ranges
 * - Includes automatic retry logic for transient failures
 *
 * @param filters - Optional filters to apply to letter queries
 * @returns Object containing letters array, loading state, error, and utility functions
 */
export function useLetters(filters?: LetterFilters) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const supabase = createClient();

  const fetchLetters = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use retry logic for fetching letters
      await retryWithBackoff(async () => {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Build base query for unread letters
        let unreadQuery = supabase
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
          .eq("recipient_id", user.id)
          .eq("is_read", false);

        // Apply filters to unread query
        if (filters?.contactIds && filters.contactIds.length > 0) {
          unreadQuery = unreadQuery.in("author_id", filters.contactIds);
        }
        if (filters?.beforeDate) {
          unreadQuery = unreadQuery.lt(
            "created_at",
            filters.beforeDate.toISOString()
          );
        }
        if (filters?.afterDate) {
          unreadQuery = unreadQuery.gt(
            "created_at",
            filters.afterDate.toISOString()
          );
        }

        unreadQuery = unreadQuery.order("created_at", { ascending: true }); // Oldest first for unread

        const { data: unreadLetters, error: unreadError } = await unreadQuery;

        if (unreadError) throw unreadError;

        // If we have unread letters, use them
        if (unreadLetters && unreadLetters.length > 0) {
          // For now, we'll use author_id as a placeholder for email
          // In a real app, you'd need an API route to fetch user emails
          const lettersWithAuthors: Letter[] = unreadLetters.map((letter) => ({
            id: letter.id,
            authorId: letter.author_id,
            recipientId: letter.recipient_id,
            content: letter.content,
            createdAt: new Date(letter.created_at),
            updatedAt: new Date(letter.updated_at),
            isRead: letter.is_read,
            readAt: letter.read_at ? new Date(letter.read_at) : null,
            author: {
              id: letter.author_id,
              email: letter.author_id, // Using ID as placeholder
              lastLoginAt: null,
            },
          }));

          setLetters(lettersWithAuthors);
          setIsLoading(false);
          return;
        }

        // If no unread letters, fetch read letters
        let readQuery = supabase
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
          .eq("recipient_id", user.id)
          .eq("is_read", true);

        // Apply filters to read query
        if (filters?.contactIds && filters.contactIds.length > 0) {
          readQuery = readQuery.in("author_id", filters.contactIds);
        }
        if (filters?.beforeDate) {
          readQuery = readQuery.lt(
            "created_at",
            filters.beforeDate.toISOString()
          );
        }
        if (filters?.afterDate) {
          readQuery = readQuery.gt(
            "created_at",
            filters.afterDate.toISOString()
          );
        }

        readQuery = readQuery.order("created_at", { ascending: false }); // Newest first for read

        const { data: readLetters, error: readError } = await readQuery;

        if (readError) throw readError;

        if (readLetters && readLetters.length > 0) {
          const lettersWithAuthors: Letter[] = readLetters.map((letter) => ({
            id: letter.id,
            authorId: letter.author_id,
            recipientId: letter.recipient_id,
            content: letter.content,
            createdAt: new Date(letter.created_at),
            updatedAt: new Date(letter.updated_at),
            isRead: letter.is_read,
            readAt: letter.read_at ? new Date(letter.read_at) : null,
            author: {
              id: letter.author_id,
              email: letter.author_id, // Using ID as placeholder
              lastLoginAt: null,
            },
          }));

          setLetters(lettersWithAuthors);
        } else {
          setLetters([]);
        }

        setIsLoading(false);
      });
    } catch (err) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      logError(err, { context: "useLetters.fetchLetters", filters });
      setError(errorMessage);
      setIsLoading(false);
      setRetryCount((prev) => prev + 1);
    }
  }, [supabase, filters]);

  const markAsRead = useCallback(
    async (letterId: string) => {
      // Optimistic update
      const previousLetters = letters;
      setLetters((prevLetters) =>
        prevLetters.map((letter) =>
          letter.id === letterId
            ? { ...letter, isRead: true, readAt: new Date() }
            : letter
        )
      );

      try {
        await retryWithBackoff(async () => {
          const { error } = await supabase
            .from("letters")
            .update({
              is_read: true,
              read_at: new Date().toISOString(),
            })
            .eq("id", letterId);

          if (error) throw error;
        });

        // Refetch to get proper sorting
        await fetchLetters();
      } catch (err) {
        // Rollback optimistic update on error
        setLetters(previousLetters);
        logError(err, { context: "useLetters.markAsRead", letterId });
        throw new Error(getUserFriendlyErrorMessage(err));
      }
    },
    [supabase, fetchLetters, letters]
  );

  useEffect(() => {
    fetchLetters();
  }, [fetchLetters]);

  return {
    letters,
    isLoading,
    error,
    refetch: fetchLetters,
    markAsRead,
    retryCount,
  };
}
