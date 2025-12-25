'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContacts } from '@/lib/hooks/useContacts';
import { useToast } from '@/lib/contexts/ToastContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { PapyrusButton } from '@/components/ui/PapyrusButton';
import { PapyrusInput } from '@/components/ui/PapyrusInput';
import { PapyrusSpinner } from '@/components/ui/PapyrusSpinner';

export default function AddContactPage() {
  const router = useRouter();
  const { addContact } = useContacts();
  const { showError, showSuccess } = useToast();
  const { user } = useAuth();
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyUserId = async () => {
    if (user?.id) {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    if (!displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await addContact(userId.trim(), displayName.trim());
      
      // Check if user is adding themselves
      if (user?.id === userId.trim()) {
        showSuccess(`${displayName} added! Writing letters to yourself is a beautiful way to heal and reflect.`);
      } else {
        showSuccess(`${displayName} has been added to your contacts!`);
      }
      
      // Navigate back to home page on success
      router.push('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add contact';
      
      // Check if it's a user validation error
      if (errorMessage.includes('User ID does not exist')) {
        setErrors({ userId: 'User ID does not exist. Please check and try again.' });
        showError('User ID does not exist. Please check and try again.');
      } else if (errorMessage.includes('duplicate') || errorMessage.includes('already exists')) {
        setErrors({ general: 'This contact has already been added.' });
        showError('This contact has already been added.');
      } else {
        setErrors({ general: errorMessage });
        showError(errorMessage);
      }
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="bg-papyrus-bg border-2 sm:border-4 border-papyrus-border papyrus-shadow-lg p-4 sm:p-6 md:p-8 papyrus-texture-overlay">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-center mb-2 text-papyrus-text">
            Add Contact
          </h1>
          <p className="text-sm sm:text-base text-center text-papyrus-text-light mb-4 sm:mb-6 font-body italic">
            Add a friend to exchange letters with
          </p>

          {/* User ID Display */}
          {user?.id && (
            <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-papyrus-darker border-2 border-papyrus-border">
              <div className="text-xs sm:text-sm text-papyrus-text-light font-body mb-2">
                Your User ID
              </div>
              <div className="flex items-center gap-2">
                <code className="text-xs sm:text-sm text-papyrus-text font-mono flex-1 break-all">
                  {user.id}
                </code>
                <button
                  type="button"
                  onClick={handleCopyUserId}
                  className="flex-shrink-0 p-2 hover:bg-papyrus-accent rounded transition-colors duration-150 border border-papyrus-border"
                  aria-label="Copy user ID"
                  title={copied ? 'Copied!' : 'Copy user ID'}
                >
                  {copied ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-papyrus-text"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="text-xs text-papyrus-text-light font-body mt-2 italic">
                Share this ID with others so they can add you as a contact
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <PapyrusInput
              label="User ID"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter their user ID"
              error={errors.userId}
              disabled={loading}
            />

            <PapyrusInput
              label="Display Name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How you want to see their name"
              error={errors.displayName}
              disabled={loading}
            />

            {errors.general && (
              <div className="p-3 bg-red-100 border-2 border-red-600 text-red-800 text-sm font-body">
                {errors.general}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <PapyrusButton
                type="button"
                variant="ghost"
                size="lg"
                className="flex-1 min-h-[44px]"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </PapyrusButton>
              <PapyrusButton
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1 min-h-[44px]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <PapyrusSpinner size="sm" />
                    Adding...
                  </span>
                ) : (
                  'Add Contact'
                )}
              </PapyrusButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
