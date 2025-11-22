# Error Handling and Loading States

This document describes the comprehensive error handling and loading state system implemented in the Letters.

## Components

### 1. Toast Notifications (`PapyrusToast`)
- **Location**: `components/ui/PapyrusToast.tsx`
- **Purpose**: Display temporary notifications for errors, success, warnings, and info messages
- **Features**:
  - Auto-dismisses after configurable duration (default 5 seconds)
  - Manual dismiss option
  - Papyrus-themed styling
  - Four types: error, success, warning, info
  - Stacks multiple toasts vertically

### 2. Toast Context (`ToastContext`)
- **Location**: `lib/contexts/ToastContext.tsx`
- **Purpose**: Global toast management system
- **Usage**:
  ```typescript
  const { showError, showSuccess, showWarning, showInfo } = useToast();
  
  showError('Something went wrong');
  showSuccess('Operation completed!');
  ```

### 3. Loading Spinners (`PapyrusSpinner`)
- **Location**: `components/ui/PapyrusSpinner.tsx`
- **Components**:
  - `PapyrusSpinner`: Standalone spinner with optional text
  - `PapyrusLoadingOverlay`: Full-screen overlay with spinner
- **Sizes**: sm, md, lg, xl
- **Usage**:
  ```typescript
  <PapyrusSpinner size="lg" text="Loading..." />
  <PapyrusLoadingOverlay isLoading={isLoading} text="Saving..." />
  ```

### 4. Error Boundary (`ErrorBoundary`)
- **Location**: `components/ui/ErrorBoundary.tsx`
- **Purpose**: Catch React component errors and display fallback UI
- **Features**:
  - Papyrus-themed error display
  - Error details (expandable)
  - "Try Again" and "Go Home" actions
  - Wraps entire app in root layout

### 5. Error Logger (`errorLogger`)
- **Location**: `lib/utils/errorLogger.ts`
- **Functions**:
  - `logError()`: Log errors with context
  - `getUserFriendlyErrorMessage()`: Convert technical errors to user-friendly messages
  - `retryWithBackoff()`: Retry failed operations with exponential backoff

## Implementation in Hooks

All custom hooks have been updated with:

1. **Error Handling**:
   - Errors are caught and logged with context
   - User-friendly error messages are returned
   - Error state is exposed as string (not Error object)

2. **Retry Logic**:
   - Automatic retry with exponential backoff for transient failures
   - Skips retry for authentication and validation errors
   - Maximum 3 retry attempts by default

3. **Optimistic Updates**:
   - UI updates immediately for better UX
   - Rollback on error
   - Example: `markAsRead` in `useLetters`

## Implementation in Pages

### Authentication Pages
- Display loading spinners during auth operations
- Show toast notifications for errors and success
- Remove inline error displays in favor of toasts

### Main Pages (Home, Sent, Compose)
- Use `PapyrusSpinner` for loading states
- Display error states with retry button
- Show toast notifications for all operations
- Loading overlays for async operations

### Contact Management
- Toast notifications for add/delete operations
- Inline validation errors for form fields
- Loading states on submit buttons

## Error Types and Messages

### Network Errors
- Original: "fetch failed", "network error"
- User-friendly: "Network error. Please check your connection and try again."

### Authentication Errors
- Original: "unauthorized", "auth failed"
- User-friendly: "Authentication failed. Please log in again."

### Timeout Errors
- Original: "timeout"
- User-friendly: "Request timed out. Please try again."

### Not Found Errors
- Original: "not found", "404"
- User-friendly: "The requested resource was not found."

### Permission Errors
- Original: "forbidden", "permission denied"
- User-friendly: "You do not have permission to perform this action."

## Best Practices

1. **Always use toast notifications** for user feedback on operations
2. **Show loading states** for all async operations
3. **Provide retry options** for failed operations
4. **Log errors with context** for debugging
5. **Use optimistic updates** where appropriate for better UX
6. **Display user-friendly error messages** instead of technical details
7. **Wrap components in ErrorBoundary** to catch unexpected errors

## Testing Error Handling

To test error handling:

1. **Network Errors**: Disconnect network and try operations
2. **Authentication Errors**: Use invalid credentials
3. **Validation Errors**: Submit forms with invalid data
4. **Database Errors**: Try operations with invalid IDs
5. **Timeout Errors**: Simulate slow network conditions

## Future Enhancements

- Integration with error monitoring service (e.g., Sentry)
- Offline mode with operation queuing
- More granular retry strategies
- Error analytics and reporting
