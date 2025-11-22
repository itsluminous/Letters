'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSentLetters: () => void;
  onLogout: () => void;
}

export function ProfileMenu({
  isOpen,
  onClose,
  onSentLetters,
  onLogout,
}: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        'absolute right-0 mt-2 w-48 bg-papyrus-dark border-2 border-papyrus-border papyrus-shadow-lg',
        'animate-in'
      )}
      role="menu"
      aria-orientation="vertical"
    >
      <div className="py-1">
        <button
          onClick={onSentLetters}
          className="w-full text-left px-4 py-2 text-papyrus-text font-body hover:bg-papyrus-darker transition-colors duration-150"
          role="menuitem"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>Sent</span>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-papyrus-text font-body hover:bg-papyrus-darker transition-colors duration-150"
          role="menuitem"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              />
            </svg>
            <span>Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
}
