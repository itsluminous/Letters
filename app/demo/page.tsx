'use client';

import { useState } from 'react';
import {
  PapyrusButton,
  PapyrusInput,
  PapyrusSelect,
  PapyrusDatePicker,
  PapyrusDialog,
  PapyrusConfirmDialog,
} from '@/components/ui';
import { PapyrusScroll, LetterNavigation, LetterStack } from '@/components/letters';
import { Letter } from '@/lib/supabase/types';

export default function DemoPage() {
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [multiSelectValue, setMultiSelectValue] = useState<string[]>([]);
  const [dateValue, setDateValue] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [scrollMode, setScrollMode] = useState<'view' | 'edit' | 'compose'>('view');
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [selectedLetterId, setSelectedLetterId] = useState<string>('1');

  const mockLetter: Letter = {
    id: '1',
    authorId: 'author-1',
    recipientId: 'recipient-1',
    content: 'My dearest friend,\n\nI hope this letter finds you in good health and high spirits. The autumn leaves have begun to fall, painting the world in shades of amber and gold. I find myself thinking of our last conversation and the wisdom you shared.\n\nYour words have stayed with me, and I wanted to express my gratitude for your friendship and counsel.\n\nWith warm regards,\nYour friend',
    createdAt: new Date('2024-11-15T14:30:00'),
    updatedAt: new Date('2024-11-15T14:30:00'),
    isRead: false,
    readAt: null,
    author: {
      id: 'author-1',
      email: 'friend@example.com',
      lastLoginAt: new Date('2024-11-20T10:00:00'),
    },
    recipient: {
      id: 'recipient-1',
      email: 'you@example.com',
      lastLoginAt: new Date('2024-11-22T09:00:00'),
    },
  };

  const mockRecipients = [
    { id: 'recipient-1', name: 'Alice Smith' },
    { id: 'recipient-2', name: 'Bob Johnson' },
    { id: 'recipient-3', name: 'Carol Williams' },
  ];

  const mockLetters: Letter[] = [
    {
      id: '1',
      authorId: 'author-1',
      recipientId: 'recipient-1',
      content: 'My dearest friend,\n\nI hope this letter finds you in good health and high spirits. The autumn leaves have begun to fall, painting the world in shades of amber and gold.\n\nI find myself thinking of our last conversation and the wisdom you shared. Your words have stayed with me, and I wanted to express my gratitude for your friendship and counsel.\n\nWith warm regards,\nYour friend',
      createdAt: new Date('2024-11-15T14:30:00'),
      updatedAt: new Date('2024-11-15T14:30:00'),
      isRead: false,
      readAt: null,
      author: {
        id: 'author-1',
        email: 'alice@example.com',
        lastLoginAt: new Date('2024-11-20T10:00:00'),
      },
    },
    {
      id: '2',
      authorId: 'author-2',
      recipientId: 'recipient-1',
      content: 'Dear companion,\n\nThe winter solstice approaches, and with it comes a time of reflection. I wanted to share with you some thoughts that have been occupying my mind lately.\n\nLife moves in mysterious ways, and I am grateful for the journey we share together.\n\nYours truly,\nA friend',
      createdAt: new Date('2024-11-18T10:15:00'),
      updatedAt: new Date('2024-11-18T10:15:00'),
      isRead: false,
      readAt: null,
      author: {
        id: 'author-2',
        email: 'bob@example.com',
        lastLoginAt: new Date('2024-11-21T15:30:00'),
      },
    },
    {
      id: '3',
      authorId: 'author-3',
      recipientId: 'recipient-1',
      content: 'Hello there,\n\nI just wanted to drop you a quick note to say hello and see how you are doing. It has been too long since we last spoke.\n\nLet us catch up soon over tea!\n\nBest wishes,\nYour pal',
      createdAt: new Date('2024-11-20T16:45:00'),
      updatedAt: new Date('2024-11-20T16:45:00'),
      isRead: true,
      readAt: new Date('2024-11-21T09:00:00'),
      author: {
        id: 'author-3',
        email: 'carol@example.com',
        lastLoginAt: new Date('2024-11-22T08:00:00'),
      },
    },
  ];

  const selectOptions = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  return (
    <div className="min-h-screen p-8 papyrus-texture">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-heading font-bold text-papyrus-text mb-8">
          Papyrus UI Components Demo
        </h1>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-papyrus-text">
            Buttons
          </h2>
          <div className="flex flex-wrap gap-4">
            <PapyrusButton variant="primary" size="sm">
              Primary Small
            </PapyrusButton>
            <PapyrusButton variant="primary" size="md">
              Primary Medium
            </PapyrusButton>
            <PapyrusButton variant="primary" size="lg">
              Primary Large
            </PapyrusButton>
          </div>
          <div className="flex flex-wrap gap-4">
            <PapyrusButton variant="secondary">Secondary</PapyrusButton>
            <PapyrusButton variant="ghost">Ghost</PapyrusButton>
            <PapyrusButton disabled>Disabled</PapyrusButton>
          </div>
        </section>

        {/* Input */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-papyrus-text">
            Input
          </h2>
          <PapyrusInput
            label="Your Name"
            placeholder="Enter your name..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <PapyrusInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            error="This field is required"
          />
        </section>

        {/* Select */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-papyrus-text">
            Select
          </h2>
          <PapyrusSelect
            label="Single Select"
            options={selectOptions}
            value={selectValue}
            onChange={(value) => setSelectValue(value as string)}
            placeholder="Choose an option..."
          />
          <PapyrusSelect
            label="Multi Select"
            options={selectOptions}
            value={multiSelectValue}
            onChange={(value) => setMultiSelectValue(value as string[])}
            placeholder="Choose multiple options..."
            multiple
          />
        </section>

        {/* Date Picker */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-papyrus-text">
            Date Picker
          </h2>
          <PapyrusDatePicker
            label="Select Date"
            value={dateValue}
            onChange={setDateValue}
            placeholder="Pick a date..."
          />
          {dateValue && (
            <p className="text-papyrus-text-light font-body">
              Selected: {dateValue.toLocaleDateString()}
            </p>
          )}
        </section>

        {/* Dialogs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-papyrus-text">
            Dialogs
          </h2>
          <div className="flex gap-4">
            <PapyrusButton onClick={() => setIsDialogOpen(true)}>
              Open Dialog
            </PapyrusButton>
            <PapyrusButton onClick={() => setIsConfirmOpen(true)}>
              Open Confirm Dialog
            </PapyrusButton>
          </div>
        </section>

        {/* Letter Stack */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-papyrus-text">
            Letter Stack Visualization
          </h2>
          <p className="text-papyrus-text-light font-body">
            Click on any letter in the stack to select it. The stack shows up to 5 letters
            with 3D stacking effects, rotation variance, and read/unread indicators.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-heading font-semibold text-papyrus-text mb-4">
                Inbox Stack (with unread count)
              </h3>
              <LetterStack
                letters={mockLetters}
                type="inbox"
                onLetterSelect={(id) => {
                  setSelectedLetterId(id);
                  console.log('Selected letter:', id);
                }}
                currentIndex={mockLetters.findIndex(l => l.id === selectedLetterId)}
              />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-papyrus-text mb-4">
                Sent Stack (with read status & edit/delete for unread)
              </h3>
              <LetterStack
                letters={mockLetters.map(l => ({
                  ...l,
                  recipient: {
                    id: 'recipient-1',
                    email: 'recipient@example.com',
                    lastLoginAt: new Date('2024-11-21T10:00:00'),
                  }
                }))}
                type="sent"
                onLetterSelect={(id) => {
                  setSelectedLetterId(id);
                  console.log('Selected sent letter:', id);
                }}
                currentIndex={mockLetters.findIndex(l => l.id === selectedLetterId)}
                onEdit={(id) => {
                  console.log('Edit letter:', id);
                  alert(`Edit letter ${id}`);
                }}
                onDelete={(id) => {
                  console.log('Delete letter:', id);
                  if (confirm('Delete this letter?')) {
                    alert(`Deleted letter ${id}`);
                  }
                }}
              />
            </div>
          </div>
        </section>

        {/* Letter Navigation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-papyrus-text">
            Letter Navigation with Page-Turning Animation
          </h2>
          <p className="text-papyrus-text-light font-body">
            Use arrow buttons, keyboard arrows (← →), swipe gestures (mobile), or
            horizontal scroll/wheel (desktop) to navigate between letters.
          </p>
          <LetterNavigation
            letters={mockLetters}
            currentIndex={currentLetterIndex}
            onNavigate={setCurrentLetterIndex}
            enableGestures={true}
          >
            {(letter) => (
              <PapyrusScroll
                letter={letter}
                mode="view"
                showActions={false}
              />
            )}
          </LetterNavigation>
        </section>

        {/* PapyrusScroll */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-papyrus-text">
            Papyrus Scroll (Standalone)
          </h2>
          <div className="flex gap-4 mb-4">
            <PapyrusButton
              variant={scrollMode === 'view' ? 'primary' : 'secondary'}
              onClick={() => setScrollMode('view')}
            >
              View Mode
            </PapyrusButton>
            <PapyrusButton
              variant={scrollMode === 'edit' ? 'primary' : 'secondary'}
              onClick={() => setScrollMode('edit')}
            >
              Edit Mode
            </PapyrusButton>
            <PapyrusButton
              variant={scrollMode === 'compose' ? 'primary' : 'secondary'}
              onClick={() => setScrollMode('compose')}
            >
              Compose Mode
            </PapyrusButton>
          </div>
          <PapyrusScroll
            letter={scrollMode === 'compose' ? undefined : mockLetter}
            mode={scrollMode}
            showActions={scrollMode === 'view'}
            recipientOptions={mockRecipients}
            onSave={async (content, recipientId) => {
              console.log('Save:', { content, recipientId });
              alert('Letter sent!');
            }}
            onEdit={async (content) => {
              console.log('Edit:', content);
              alert('Letter updated!');
            }}
            onDelete={async () => {
              console.log('Delete');
              alert('Letter deleted!');
            }}
          />
        </section>

        {/* Typography Samples */}
        <section className="space-y-4">
          <h2 className="text-2xl font-heading font-semibold text-papyrus-text">
            Typography
          </h2>
          <div className="space-y-2">
            <p className="font-heading text-xl">
              Heading Font (Cinzel): The quick brown fox jumps over the lazy
              dog
            </p>
            <p className="font-body text-lg">
              Body Font (Lora): The quick brown fox jumps over the lazy dog
            </p>
            <p className="font-handwriting text-2xl">
              Handwriting Font (Caveat): The quick brown fox jumps over the
              lazy dog
            </p>
          </div>
        </section>
      </div>

      {/* Dialog Components */}
      <PapyrusDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Sample Dialog"
        footer={
          <>
            <PapyrusButton
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </PapyrusButton>
            <PapyrusButton onClick={() => setIsDialogOpen(false)}>
              Confirm
            </PapyrusButton>
          </>
        }
      >
        <p>
          This is a sample dialog with papyrus styling. You can put any content
          here.
        </p>
      </PapyrusDialog>

      <PapyrusConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => alert('Confirmed!')}
        title="Confirm Action"
        message="Are you sure you want to proceed with this action?"
        confirmText="Yes, proceed"
        cancelText="No, cancel"
      />
    </div>
  );
}
