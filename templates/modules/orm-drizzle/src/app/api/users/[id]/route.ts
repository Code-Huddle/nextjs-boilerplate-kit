import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { db, users } from '@/lib/db';
import { requireApiUser } from '@/lib/server-auth';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  const id = Number.parseInt((await params).id, 10);
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  const [updated] = await db.update(users)
    .set({ ...(name ? { name } : {}), ...(email ? { email } : {}), updatedAt: new Date() })
    .where(and(eq(users.id, id), eq(users.ownerId, auth.user.id))).returning();
  return updated ? NextResponse.json(updated) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  const [deleted] = await db.delete(users).where(and(eq(users.id, id), eq(users.ownerId, auth.user.id))).returning();
  return deleted ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}
