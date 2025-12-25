export interface ErrorLog {
  timestamp: Date;
  userId?: string;
  errorType: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
}

/**
 * Log errors to console in development, and optionally to a monitoring service in production
 */
export function logError(
  error: Error | unknown,
  context?: Record<string, any>,
  userId?: string
): void {
  const errorLog: ErrorLog = {
    timestamp: new Date(),
    userId,
    errorType: error instanceof Error ? error.constructor.name : "Unknown",
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    context,
  };

  // Always log to console
  console.error("[Error Log]", errorLog);

  // In production, you could send to a monitoring service like Sentry
  if (process.env.NODE_ENV === "production") {
    // Example: Send to monitoring service
    // sendToMonitoringService(errorLog);
  }
}

/**
 * Get a user-friendly error message from an error object
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Map common error messages to user-friendly versions
    const message = error.message.toLowerCase();

    if (message.includes("network") || message.includes("fetch")) {
      return "Network error. Please check your connection and try again.";
    }

    if (message.includes("timeout")) {
      return "Request timed out. Please try again.";
    }

    if (message.includes("unauthorized") || message.includes("auth")) {
      return "Authentication failed. Please log in again.";
    }

    if (message.includes("not found")) {
      return "The requested resource was not found.";
    }

    if (message.includes("permission") || message.includes("forbidden")) {
      return "You do not have permission to perform this action.";
    }

    // Return the original message if no mapping found
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on authentication errors or client errors
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        if (
          message.includes("auth") ||
          message.includes("unauthorized") ||
          message.includes("forbidden") ||
          message.includes("invalid")
        ) {
          throw error;
        }
      }

      // If this was the last attempt, throw the error
      if (attempt === maxRetries - 1) {
        throw error;
      }

      // Wait before retrying with exponential backoff
      const delay = initialDelay * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));

      console.log(`Retrying... (attempt ${attempt + 2}/${maxRetries})`);
    }
  }

  throw lastError;
}
