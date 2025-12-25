"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { cn } from "@/lib/utils/cn";

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
  const router = useRouter();
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleAddContact = () => {
    router.push("/contacts/add");
    onClose();
  };

  const handleCopyUserId = async () => {
    if (user?.id) {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={cn(
        "absolute right-0 mt-2 w-64 bg-papyrus-dark border-2 border-papyrus-border papyrus-shadow-lg",
        "animate-in"
      )}
      role="menu"
      aria-orientation="vertical"
    >
      <div className="py-1">
        {/* User ID Display */}
        {user?.id && (
          <div className="px-4 py-3 border-b border-papyrus-border">
            <div className="text-xs text-papyrus-text-light font-body mb-1">
              Your User ID
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs text-papyrus-text font-mono flex-1 truncate">
                {user.id}
              </code>
              <button
                onClick={handleCopyUserId}
                className="flex-shrink-0 p-1 hover:bg-papyrus-darker rounded transition-colors duration-150 cursor-pointer"
                aria-label="Copy user ID"
                title={copied ? "Copied!" : "Copy user ID"}
              >
                {copied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600"
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
                    className="h-4 w-4 text-papyrus-text"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onSentLetters}
          className="w-full text-left px-4 py-2 text-papyrus-text font-body hover:bg-papyrus-darker transition-colors duration-150 cursor-pointer"
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
          onClick={handleAddContact}
          className="w-full text-left px-4 py-2 text-papyrus-text font-body hover:bg-papyrus-darker transition-colors duration-150 cursor-pointer"
          role="menuitem"
        >
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            <span>Add Contact</span>
          </div>
        </button>

        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2 text-papyrus-text font-body hover:bg-papyrus-darker transition-colors duration-150 cursor-pointer"
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
