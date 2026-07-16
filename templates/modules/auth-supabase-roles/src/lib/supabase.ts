import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

/** False when env is missing/placeholder so UI can degrade during build or local setup. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// createBrowserClient throws if URL/key are empty; use placeholders so `next build`
// can prerender pages that import this module before real credentials are set.
export const supabase = createBrowserClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-publishable-key',
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
