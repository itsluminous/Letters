'use client';

import React, { useState, useEffect } from 'react';
import { PapyrusButton } from '@/components/ui/PapyrusButton';
import { ProfileMenu } from './ProfileMenu';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';

export function TitleBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useAuth();

  // Handle Esc key to close info popup
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isInfoOpen) {
        setIsInfoOpen(false);
      }
    };

    if (isInfoOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isInfoOpen]);

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

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsInfoOpen(false);
    }
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
                Write New Letter
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
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={handleBackdropClick}
        >
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
                Why Write Letters?
              </h2>
              <div className="font-body text-papyrus-text space-y-4">
                <p>When couples are upset, disappointed, or frustrated, they temporarily lose access to their loving feelings (trust, caring, appreciation). In this state, verbal communication often fails because it escalates into fighting, with one person feeling blamed and the other becoming defensive.</p>
                
                <p><b>Writing creates a &ldquo;circuit breaker&rdquo; in this negative loop.</b></p>
                
                <h4>How Letter Writing Helps:</h4>
                <ol>
                    <li><b>Safe Emotional Release:</b> Writing allows you to express feelings of anger, sadness, and fear freely without the immediate fear of hurting your partner or being judged.</li>
                    <li><b>Centering Yourself:</b> The act of writing releases the intensity of negative emotions, making room for positive feelings (like love and understanding) to re-emerge.</li>
                    <li><b>Better Communication:</b> Once the letter is written, you are no longer reacting from raw emotion. You can approach your partner with a more centered, loving attitude, increasing the chances of being heard and understood.</li>
                </ol>
                
                <h4>The &ldquo;Love Letter&rdquo; Structure for Processing Emotions:</h4>
                <p>The most effective method involves writing through all five emotional stages:</p>
                <ul>
                    <li><b>Anger & Blame</b> (&ldquo;I am furious...&rdquo;)</li>
                    <li><b>Sadness & Hurt</b> (&ldquo;I am sad that...&rdquo;)</li>
                    <li><b>Fear & Insecurity</b> (&ldquo;I am afraid that...&rdquo;)</li>
                    <li><b>Regret & Responsibility</b> (&ldquo;I am sorry that...&rdquo;)</li>
                    <li><b>Love & Forgiveness</b> (&ldquo;I love you and understand...&rdquo;)</li>
                </ul>

                <h3>Example Situations (Use Cases)</h3>

                <h4>1. Forgetfulness & Unreliability</h4>
                <p><b>The Trigger:</b> One partner misses an important appointment or task, causing anger and disappointment.</p>
                <p><b>The Letter Approach:</b> Instead of yelling, the frustrated partner writes a letter expressing the anger and underlying fear (&ldquo;I&apos;m afraid I can&apos;t trust you&rdquo;).</p>
                <p><b>The Result:</b> The anger is filtered, and the writer can approach the partner with love and acceptance, leading to a constructive solution instead of a fight.</p>
                
                <h4>2. Indifference & Rejection</h4>
                <p><b>The Trigger:</b> One partner ignores the other, maybe by being preoccupied with a book or phone when intimacy is desired.</p>
                <p><b>The Letter Approach:</b> The hurt partner writes about their frustration (&ldquo;I am angry you ignore me&rdquo;) and sadness (&ldquo;I don&apos;t feel special&rdquo;).</p>
                <p><b>The Result:</b> The writing provides the strength to confidently and lovingly ask for attention, rather than withdrawing or complaining bitterly.</p>

                <h4>3. Heated Arguments</h4>
                <p><b>The Trigger:</b> A disagreement (like over finances) quickly escalates into yelling and personal attacks.</p>
                <p><b>The Letter Approach:</b> One partner recognizes the escalating conflict, calls a pause, and writes out all their intense feelings, including defensiveness and judgment.</p>
                <p><b>The Result:</b> Having processed the emotion, the partner returns calm and understanding, enabling them to resolve the issue lovingly.</p>
                
                <h4>4. Misplaced Blame</h4>
                <p><b>The Trigger:</b> One partner is upset about an external event (e.g., mail was forgotten), and their frustration is inadvertently directed at the other partner.</p>
                <p><b>The Letter Approach:</b> The partner feeling blamed writes a letter processing their hurt and fear (&ldquo;I&apos;m afraid I can&apos;t make you happy&rdquo;).</p>
                <p><b>The Result:</b> The defensive feelings are released. The partner can then respond with empathy and a hug (&ldquo;I&apos;m sorry you didn&apos;t get your mail&rdquo;), turning a potential conflict into a loving moment.</p>

                <h3>Info Card: The Power of the Virtual Letter</h3>

                <p><b>Why exchange letters with your partner?</b></p>
                <p>Use the letter format when you need to share difficult feelings (anger, hurt, fear) but want to avoid a fight. Writing allows you to fully vent and process your emotions so that you can approach your partner from a place of love, understanding, and forgiveness.</p>

                <p><b>Remember:</b></p>
                <ul>
                    <li><b>It&apos;s a Filter:</b> Writing releases the negative intensity first.</li>
                    <li><b>It’s Flexible:</b> You don&apos;t always have to send the letter. Sometimes, just writing it is enough to heal the moment.</li>
                </ul>

                <p>PS : This app is based on Letter writing idea from the book <i>Men Are from Mars, Women Are from Venus</i></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
