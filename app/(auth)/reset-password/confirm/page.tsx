"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";
import { PapyrusButton } from "@/components/ui/PapyrusButton";
import { PapyrusInput } from "@/components/ui/PapyrusInput";

export default function ResetPasswordConfirmPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])|(?=.*[a-z])(?=.*[0-9])|(?=.*[A-Z])(?=.*[0-9])/.test(
        password
      )
    ) {
      newErrors.password = "Password must contain letters and numbers";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const { error } = await updatePassword(password);

    if (error) {
      setErrors({ general: error.message || "Failed to update password" });
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Redirect to home after successful password reset
      setTimeout(() => router.push("/"), 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 papyrus-texture">
        <div className="w-full max-w-md">
          <div className="bg-papyrus-bg border-4 border-papyrus-border papyrus-shadow-lg p-8 papyrus-texture-overlay">
            <h1 className="text-2xl font-heading font-bold text-center mb-4 text-papyrus-text">
              Password Updated!
            </h1>
            <p className="text-center text-papyrus-text-light font-body">
              Your password has been successfully updated. Redirecting...
            </p>
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
            Set New Password
          </h1>
          <p className="text-center text-papyrus-text-light mb-8 font-body italic">
            Enter your new password
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <PapyrusInput
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              error={errors.password}
              disabled={loading}
            />

            <PapyrusInput
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              error={errors.confirmPassword}
              disabled={loading}
            />

            {errors.general && (
              <div className="p-3 bg-red-100 border-2 border-red-600 text-red-800 text-sm font-body">
                {errors.general}
              </div>
            )}

            <PapyrusButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
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
