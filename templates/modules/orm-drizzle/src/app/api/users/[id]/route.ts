import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db, users } from '@/lib/db';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const id = Number.parseInt((await params).id, 10);
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  const [updated] = await db.update(users)
    .set({ ...(name ? { name } : {}), ...(email ? { email } : {}), updatedAt: new Date() })
    .where(eq(users.id, id)).returning();
  return updated ? NextResponse.json(updated) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: Context) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
  return deleted ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}
