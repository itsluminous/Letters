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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Changes: 
           1. Changed bg to white/60 for a 'clean paper on desk' look 
           2. Added stronger shadow
           3. Removed heavy borders
        */}
        <div className="bg-[#fffbf0] shadow-papyrus-lg p-8 sm:p-12 relative rounded-sm border border-[#d4c4a8]">
            {/* Decorative Corners */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#8b7355]/40" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#8b7355]/40" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#8b7355]/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#8b7355]/40" />

          <h1 className="text-4xl font-heading font-bold text-center mb-2 text-ink drop-shadow-sm">
            Letters
          </h1>
          <p className="text-center text-ink-light mb-10 font-body italic text-lg">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">
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

            <div className="pt-4">
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
            </div>
          </form>

          <div className="mt-8 space-y-3 text-center border-t border-[#d4c4a8]/30 pt-6">
            <Link
              href="/reset-password"
              className="block text-sm text-ink-light hover:text-wax font-body decoration-dashed underline underline-offset-4"
            >
              Forgot your password?
            </Link>
            <div className="text-sm text-ink-light font-body">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-wax hover:text-wax-hover font-bold hover:underline"
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