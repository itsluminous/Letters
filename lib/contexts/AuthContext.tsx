'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { logError, getUserFriendlyErrorMessage } from '@/lib/utils/errorLogger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        logError(error, { context: 'AuthContext.signUp', email });
      }
      
      return { error };
    } catch (error) {
      logError(error, { context: 'AuthContext.signUp', email });
      return { error: new Error(getUserFriendlyErrorMessage(error)) };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // Update login timestamp
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase
            .from('user_profiles')
            .upsert({
              id: user.id,
              last_login_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
        }
      } else {
        logError(error, { context: 'AuthContext.signIn', email });
      }

      return { error };
    } catch (error) {
      logError(error, { context: 'AuthContext.signIn', email });
      return { error: new Error(getUserFriendlyErrorMessage(error)) };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      });
      
      if (error) {
        logError(error, { context: 'AuthContext.resetPassword', email });
      }
      
      return { error };
    } catch (error) {
      logError(error, { context: 'AuthContext.resetPassword', email });
      return { error: new Error(getUserFriendlyErrorMessage(error)) };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        logError(error, { context: 'AuthContext.updatePassword' });
      }
      
      return { error };
    } catch (error) {
      logError(error, { context: 'AuthContext.updatePassword' });
      return { error: new Error(getUserFriendlyErrorMessage(error)) };
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
