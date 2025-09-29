 import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { User as AppUser, AuthState } from '../types';

interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: AuthError | null }>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ user: User | null; session: any; error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
  updateUserProfile: (updates: Partial<Pick<AppUser, 'full_name' | 'role' | 'country_code' | 'avatar_url'>>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthContext: initial session:', session, 'error:', error);
        if (error) {
          setError(error.message);
        } else if (session?.user) {
          await setUserFromSession(session.user);
        }
      } catch (err) {
        setError('Failed to get session');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_sessionEvent, session) => {
        console.log('AuthContext: auth state changed:', _sessionEvent, session);
        if (session?.user) {
          await setUserFromSession(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const setUserFromSession = async (authUser: User): Promise<void> => {
    try {
      // Get additional user data from profiles table if needed
      // For now, map Supabase user to our AppUser type
      const appUser: AppUser = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.user_metadata?.name,
        avatar_url: authUser.user_metadata?.avatar_url,
        role: authUser.user_metadata?.role || 'ambassador', // Default role
        country_code: authUser.user_metadata?.country_code,
        created_at: authUser.created_at,
        updated_at: authUser.updated_at || authUser.created_at,
      };
      setUser(appUser);
      setError(null);
    } catch (err) {
      setError('Failed to set user data');
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError(error.message);
      }
      return { user: data.user, error };
    } catch (err) {
      const errorMessage = 'Sign in failed';
      setError(errorMessage);
      return { user: null, error: { message: errorMessage } as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });
      if (error) {
        setError(error.message);
      }
      return { user: data.user, session: data.session, error };
    } catch (err) {
      const errorMessage = 'Sign up failed';
      setError(errorMessage);
      return { user: null, session: null, error: { message: errorMessage } as AuthError };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError('Sign out failed');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) {
        setError(error.message);
        throw error;
      }
      // Redirect happens automatically on success
    } catch (err) {
      const errorMessage = 'Google sign in failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (updates: Partial<Pick<AppUser, 'full_name' | 'role' | 'country_code' | 'avatar_url'>>) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });
      if (error) {
        return { error: error.message };
      }
      // Update local user state
      if (user && data.user) {
        const updatedUser: AppUser = {
          ...user,
          full_name: updates.full_name ?? user.full_name,
          role: updates.role ?? user.role,
          country_code: updates.country_code ?? user.country_code,
          avatar_url: updates.avatar_url ?? user.avatar_url,
        };
        setUser(updatedUser);
      }
      return { error: null };
    } catch (err) {
      const errorMessage = 'Failed to update profile';
      setError(errorMessage);
      return { error: errorMessage };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signOut,
    signUp,
    signInWithGoogle,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
