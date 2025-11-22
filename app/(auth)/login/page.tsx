'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { PapyrusButton } from '@/components/ui/PapyrusButton';
import { PapyrusInput } from '@/components/ui/PapyrusInput';
import { PapyrusSpinner } from '@/components/ui/PapyrusSpinner';

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { showError, showSuccess } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      showError(error.message || 'Invalid email or password');
      setLoading(false);
    } else {
      showSuccess('Successfully logged in!');
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 papyrus-texture">
      <div className="w-full max-w-md">
        <div className="bg-papyrus-bg border-4 border-papyrus-border papyrus-shadow-lg p-8 papyrus-texture-overlay">
          <h1 className="text-3xl font-heading font-bold text-center mb-2 text-papyrus-text">
            Letters
          </h1>
          <p className="text-center text-papyrus-text-light mb-8 font-body italic">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <PapyrusInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />

            <PapyrusInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              disabled={loading}
            />

            <PapyrusButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <PapyrusSpinner size="sm" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </PapyrusButton>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <Link
              href="/reset-password"
              className="block text-sm text-papyrus-accent hover:text-papyrus-text font-body underline"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-papyrus-text-light font-body">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-papyrus-accent hover:text-papyrus-text font-semibold underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
