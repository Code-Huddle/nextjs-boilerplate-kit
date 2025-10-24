import { createClient } from '@supabase/supabase-js';
import { User } from '@/types/auth';
import { setUserData, clearUserData, getUserData } from './cookies';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const signUpWithRole = async (email: string, password: string, role: User['role']) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role
        }
      }
    });

    if (error) throw error;

    // Store user data in cookies for middleware access
    if (data.user && typeof window !== 'undefined') {
      setUserData({
        role,
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
      });
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Get user role from metadata or cookies
    const role = data.user?.user_metadata?.role || getUserData()?.role || 'user';
    
    // Store user data in cookies for middleware access
    if (data.user && typeof window !== 'undefined') {
      setUserData({
        role,
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
      });
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    // Clear user data from cookies
    if (typeof window !== 'undefined') {
      clearUserData();
    }
    
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    return { error };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    const role = user?.user_metadata?.role || getUserData()?.role || 'user';
    
    return { user: { ...user, role }, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
};
