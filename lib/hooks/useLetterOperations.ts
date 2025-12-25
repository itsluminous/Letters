"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { logError, getUserFriendlyErrorMessage } from "@/lib/utils/errorLogger";

/**
 * Custom hook for letter operations (update, delete)
 *
 * Provides functions to update and delete letters with proper error handling
 * and user-friendly error messages
 *
 * @returns Object containing updateLetter and deleteLetter functions
 */
export function useLetterOperations() {
  const supabase = createClient();
  const router = useRouter();

  /**
   * Update a letter's content
   * Only works if the letter hasn't been read by the recipient
   *
   * @param letterId - The ID of the letter to update
   * @param content - The new content for the letter
   * @throws Error if update fails or letter has been read
   */
  const updateLetter = async (letterId: string, content: string) => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update the letter
      const { data, error } = await supabase
        .from("letters")
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", letterId)
        .eq("author_id", user.id)
        .eq("is_read", false)
        .select()
        .single();

      if (error) {
        console.error("Error updating letter:", error);
        throw new Error(
          "Failed to update letter. It may have already been read."
        );
      }

      if (!data) {
        throw new Error("Letter not found or cannot be updated");
      }

      return data;
    } catch (err) {
      logError(err, { context: "useLetterOperations.updateLetter", letterId });
      throw err instanceof Error
        ? err
        : new Error(getUserFriendlyErrorMessage(err));
    }
  };

  /**
   * Delete a letter
   * Only works if the letter hasn't been read by the recipient
   *
   * @param letterId - The ID of the letter to delete
   * @throws Error if deletion fails or letter has been read
   */
  const deleteLetter = async (letterId: string) => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Delete the letter
      const { error } = await supabase
        .from("letters")
        .delete()
        .eq("id", letterId)
        .eq("author_id", user.id)
        .eq("is_read", false);

      if (error) {
        console.error("Error deleting letter:", error);
        throw new Error(
          "Failed to delete letter. It may have already been read."
        );
      }

      // Navigate back to sent view after successful deletion
      router.push("/sent");
      router.refresh();
    } catch (err) {
      logError(err, { context: "useLetterOperations.deleteLetter", letterId });
      throw err instanceof Error
        ? err
        : new Error(getUserFriendlyErrorMessage(err));
    }
  };

  return {
    updateLetter,
    deleteLetter,
  };
}
