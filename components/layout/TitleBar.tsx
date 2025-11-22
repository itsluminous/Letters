'use client';

import React, { useState } from 'react';
import { PapyrusButton } from '@/components/ui/PapyrusButton';
import { ProfileMenu } from './ProfileMenu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

export function TitleBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  const handleCreateLetter = () => {
    router.push('/compose');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  const handleSentLetters = () => {
    router.push('/sent');
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-papyrus-dark border-b-4 border-papyrus-border papyrus-shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* App Title */}
          <div className="flex-shrink-0">
            <button
              onClick={handleGoHome}
              className="font-heading text-2xl sm:text-3xl font-bold text-papyrus-text tracking-wide hover:text-papyrus-accent transition-colors duration-200 cursor-pointer"
              aria-label="Go to homepage"
            >
              Letters
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <PapyrusButton
              variant="primary"
              size="sm"
              onClick={handleCreateLetter}
              className="hidden sm:inline-flex cursor-pointer"
            >
              Create New Letter
            </PapyrusButton>
            <PapyrusButton
              variant="primary"
              size="sm"
              onClick={handleCreateLetter}
              className="sm:hidden cursor-pointer"
              aria-label="Create new letter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </PapyrusButton>

            {/* Profile Icon */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-papyrus-darker border-2 border-papyrus-accent papyrus-shadow hover:bg-papyrus-accent transition-colors duration-200 cursor-pointer"
                aria-label="Profile menu"
                aria-expanded={isMenuOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-papyrus-text"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <ProfileMenu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                onSentLetters={handleSentLetters}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
