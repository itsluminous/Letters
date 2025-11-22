'use client';

import React, { Component, ReactNode } from 'react';
import { PapyrusButton } from './PapyrusButton';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 papyrus-texture">
          <div className="max-w-md w-full bg-papyrus-bg border-4 border-papyrus-border papyrus-shadow-lg p-8 papyrus-texture-overlay">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <h1 className="text-2xl font-heading font-bold text-papyrus-text mb-2">
                Something went wrong
              </h1>
              <p className="text-papyrus-text-light font-body mb-6">
                We encountered an unexpected error. Please try again.
              </p>
              {this.state.error && (
                <details className="mb-6 text-left">
                  <summary className="cursor-pointer text-sm text-papyrus-accent hover:text-papyrus-text font-body">
                    Error details
                  </summary>
                  <pre className="mt-2 p-3 bg-papyrus-dark text-xs overflow-auto max-h-40 font-mono">
                    {this.state.error.message}
                  </pre>
                </details>
              )}
              <div className="flex gap-3 justify-center">
                <PapyrusButton onClick={this.handleReset} variant="primary">
                  Try Again
                </PapyrusButton>
                <PapyrusButton
                  onClick={() => window.location.href = '/'}
                  variant="secondary"
                >
                  Go Home
                </PapyrusButton>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
