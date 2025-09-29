import { supabase } from '../utils/supabase';
import { User } from '../types';

/**
 * Update user profile metadata in Supabase Auth
 */
export const updateUserProfile = async (updates: Partial<Pick<User, 'role' | 'country_code' | 'full_name'>>): Promise<{ user: User | null; error: any }> => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  });

  if (error) {
    return { user: null, error };
  }

  // Return updated user data
  const updatedUser: User = {
    id: data.user.id,
    email: data.user.email || '',
    full_name: data.user.user_metadata?.full_name || '',
    role: data.user.user_metadata?.role || 'ambassador',
    country_code: data.user.user_metadata?.country_code,
    created_at: data.user.created_at,
    updated_at: data.user.updated_at || data.user.created_at,
  };

  return { user: updatedUser, error: null };
};

/**
 * Ensure user exists in the public.users table
 */
export const ensureUserInDatabase = async (userData: User): Promise<{ error: any }> => {
  const { error } = await supabase.rpc('ensure_user_in_database', {
    user_id: userData.id,
    user_email: userData.email,
    user_full_name: userData.full_name,
    user_role: userData.role,
    user_country_code: userData.country_code,
  });

  if (error) {
    console.error('Error ensuring user in database:', error);
  }

  return { error };
};

/**
 * Get current user profile from auth
 */
export const getCurrentUserProfile = async (): Promise<{ user: User | null; error: any }> => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return { user: null, error };
  }

  const appUser: User = {
    id: user.id,
    email: user.email || '',
    full_name: user.user_metadata?.full_name || '',
    role: user.user_metadata?.role || 'ambassador',
    country_code: user.user_metadata?.country_code,
    created_at: user.created_at,
    updated_at: user.updated_at || user.created_at,
  };

  return { user: appUser, error: null };
};
