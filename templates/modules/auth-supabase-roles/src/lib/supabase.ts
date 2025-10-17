import { createClient } from '@supabase/supabase-js';
import { User } from '@/types/auth';

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

    // Store role in localStorage for immediate access
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role);
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

    // Get user role from metadata or localStorage
    const role = data.user?.user_metadata?.role || localStorage.getItem('userRole') || 'user';
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', role);
    }

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userRole');
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
    
    const role = user?.user_metadata?.role || localStorage.getItem('userRole') || 'user';
    
    return { user: { ...user, role }, error: null };
  } catch (error: any) {
    return { user: null, error };
  }
};
