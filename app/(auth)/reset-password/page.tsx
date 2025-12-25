"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { PapyrusButton } from "@/components/ui/PapyrusButton";
import { PapyrusInput } from "@/components/ui/PapyrusInput";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await resetPassword(email);

    if (error) {
      setError(error.message || "Failed to send reset email");
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 papyrus-texture">
        <div className="w-full max-w-md">
          <div className="bg-papyrus-bg border-4 border-papyrus-border papyrus-shadow-lg p-8 papyrus-texture-overlay">
            <h1 className="text-2xl font-heading font-bold text-center mb-4 text-papyrus-text">
              Check Your Email
            </h1>
            <p className="text-center text-papyrus-text-light font-body mb-6">
              We&apos;ve sent a password reset link to <strong>{email}</strong>.
              Please check your inbox and follow the instructions.
            </p>
            <Link href="/login">
              <PapyrusButton variant="secondary" size="lg" className="w-full">
                Back to Sign In
              </PapyrusButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 papyrus-texture">
      <div className="w-full max-w-md">
        <div className="bg-papyrus-bg border-4 border-papyrus-border papyrus-shadow-lg p-8 papyrus-texture-overlay">
          <h1 className="text-3xl font-heading font-bold text-center mb-2 text-papyrus-text">
            Reset Password
          </h1>
          <p className="text-center text-papyrus-text-light mb-8 font-body italic">
            Enter your email to receive a reset link
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

            {error && (
              <div className="p-3 bg-red-100 border-2 border-red-600 text-red-800 text-sm font-body">
                {error}
              </div>
            )}

            <PapyrusButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </PapyrusButton>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-papyrus-accent hover:text-papyrus-text font-body underline"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
