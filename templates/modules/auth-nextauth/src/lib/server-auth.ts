import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth } from '../../auth';

export type ApiUser = { id: string; email: string | null; role: 'user' | 'admin' };
export type ApiAuthResult =
  | { ok: true; user: ApiUser }
  | { ok: false; response: NextResponse };

export async function requireApiUser(_request: NextRequest): Promise<ApiAuthResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  return {
    ok: true,
    user: { id: session.user.id, email: session.user.email ?? null, role: 'user' },
  };
}
