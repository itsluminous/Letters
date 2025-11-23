'use client';

import React, { useState } from 'react';
import { PapyrusButton } from '@/components/ui/PapyrusButton';
import { ProfileMenu } from './ProfileMenu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

export function TitleBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
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
              className="flex items-center gap-2 font-heading text-2xl sm:text-3xl font-bold text-papyrus-text tracking-wide hover:text-papyrus-accent transition-colors duration-200 cursor-pointer"
              aria-label="Go to homepage"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 sm:h-8 sm:w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Letters
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <PapyrusButton
                variant="primary"
                size="sm"
                onClick={handleCreateLetter}
                className="cursor-pointer"
              >
                Create New Letter
              </PapyrusButton>
              <button
                onClick={() => setIsInfoOpen(true)}
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-papyrus-border hover:bg-papyrus-accent transition-colors duration-200 cursor-pointer"
                aria-label="About this app"
                title="About this app"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-papyrus-text"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="sm:hidden flex items-center gap-2">
              <PapyrusButton
                variant="primary"
                size="sm"
                onClick={handleCreateLetter}
                className="cursor-pointer"
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
              <button
                onClick={() => setIsInfoOpen(true)}
                className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-papyrus-border hover:bg-papyrus-accent transition-colors duration-200 cursor-pointer"
                aria-label="About this app"
                title="About this app"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-papyrus-text"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

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

      {/* Info Popup */}
      {isInfoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative bg-papyrus-bg border-4 border-papyrus-border papyrus-shadow-lg papyrus-texture-overlay max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 sm:p-8">
              {/* Close button */}
              <button
                onClick={() => setIsInfoOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-papyrus-darker transition-colors cursor-pointer"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-papyrus-text"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Content */}
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-papyrus-text mb-4">
                About Letters
              </h2>
              <div className="font-body text-papyrus-text space-y-4">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
