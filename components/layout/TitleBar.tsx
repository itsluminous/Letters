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

  const handleAddContact = () => {
    router.push('/contacts/add');
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
    <header className="bg-papyrus-dark/50 border-b-4 border-papyrus-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* App Title */}
          <div className="flex-shrink-0">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-papyrus-text tracking-widest">
              LETTERS
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <PapyrusButton
              variant="secondary"
              size="sm"
              onClick={handleCreateLetter}
              className="hidden sm:inline-flex"
            >
              New Letter
            </PapyrusButton>
            <PapyrusButton
              variant="secondary"
              size="sm"
              onClick={handleCreateLetter}
              className="sm:hidden"
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

            <PapyrusButton
              variant="ghost"
              size="sm"
              onClick={handleAddContact}
              className="hidden sm:inline-flex"
            >
              Add Contact
            </PapyrusButton>
            
            {/* Profile Icon */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-papyrus-darker/50 border-2 border-papyrus-accent/50 hover:bg-papyrus-accent/50 transition-colors duration-200"
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
