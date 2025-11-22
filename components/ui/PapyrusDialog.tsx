'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils/cn';
import { PapyrusButton } from './PapyrusButton';

export interface PapyrusDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const PapyrusDialog: React.FC<PapyrusDialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-papyrus-text/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={cn(
          'relative bg-papyrus-bg border-4 border-papyrus-accent papyrus-shadow-lg papyrus-texture-overlay',
          'max-w-lg w-full max-h-[90vh] overflow-auto',
          'animate-in fade-in zoom-in duration-200',
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b-2 border-papyrus-border">
            <h2 className="text-2xl font-heading font-bold text-papyrus-text">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-papyrus-text-light hover:text-papyrus-text transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 font-body text-papyrus-text">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t-2 border-papyrus-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export interface PapyrusConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const PapyrusConfirmDialog: React.FC<PapyrusConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <PapyrusDialog
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <PapyrusButton variant="ghost" onClick={onClose}>
            {cancelText}
          </PapyrusButton>
          <PapyrusButton variant="primary" onClick={handleConfirm}>
            {confirmText}
          </PapyrusButton>
        </>
      }
    >
      <p className="text-papyrus-text">{message}</p>
    </PapyrusDialog>
  );
};
