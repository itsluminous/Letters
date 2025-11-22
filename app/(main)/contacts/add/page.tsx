'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContacts } from '@/lib/hooks/useContacts';
import { useToast } from '@/lib/contexts/ToastContext';
import { PapyrusButton } from '@/components/ui/PapyrusButton';
import { PapyrusInput } from '@/components/ui/PapyrusInput';
import { PapyrusSpinner } from '@/components/ui/PapyrusSpinner';

export default function AddContactPage() {
  const router = useRouter();
  const { addContact } = useContacts();
  const { showError, showSuccess } = useToast();
  const [userId, setUserId] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

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
      showSuccess(`${displayName} has been added to your contacts!`);
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
          <p className="text-sm sm:text-base text-center text-papyrus-text-light mb-6 sm:mb-8 font-body italic">
            Add a friend to exchange letters with
          </p>

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
