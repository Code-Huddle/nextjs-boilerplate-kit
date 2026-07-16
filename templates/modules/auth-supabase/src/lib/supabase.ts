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
