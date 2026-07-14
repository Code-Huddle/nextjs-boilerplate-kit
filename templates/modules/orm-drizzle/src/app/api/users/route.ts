import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, users } from '@/lib/db';
import { requireApiUser } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  return NextResponse.json(await db.select().from(users).where(eq(users.ownerId, auth.user.id)));
}

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  const [created] = await db.insert(users).values({ ownerId: auth.user.id, name, email }).returning();
  return NextResponse.json(created, { status: 201 });
}
