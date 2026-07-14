import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
);

export function signUpWithRole(email: string, password: string) {
  return supabase.auth.signUp({ email, password });
}

export function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signOut() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  const role = data.user?.app_metadata?.role === 'admin' ? 'admin' : 'user';
  return { user: data.user ? { ...data.user, role } : null, error };
}
