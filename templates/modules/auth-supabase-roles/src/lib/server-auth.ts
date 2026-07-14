import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export type ApiUser = { id: string; email: string | null; role: 'user' | 'admin' };
export type ApiAuthResult =
  | { ok: true; user: ApiUser }
  | { ok: false; response: NextResponse };

export async function requireApiUser(_request: NextRequest): Promise<ApiAuthResult> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return {
    ok: true,
    user: {
      id: data.user.id,
      email: data.user.email ?? null,
      role: data.user.app_metadata?.role === 'admin' ? 'admin' : 'user',
    },
  };
}
