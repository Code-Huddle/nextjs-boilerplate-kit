import { NextResponse } from 'next/server';
import { db, users } from '@/lib/db';

export async function GET() {
  return NextResponse.json(await db.select().from(users));
}

export async function POST(request: Request) {
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  const [created] = await db.insert(users).values({ name, email }).returning();
  return NextResponse.json(created, { status: 201 });
}
