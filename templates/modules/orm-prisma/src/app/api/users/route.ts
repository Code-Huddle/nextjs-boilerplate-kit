import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiUser } from '@/lib/server-auth';

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  return NextResponse.json(await prisma.user.findMany({ where: { ownerId: auth.user.id } }));
}

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  const user = await prisma.user.create({ data: { ownerId: auth.user.id, name, email } });
  return NextResponse.json(user, { status: 201 });
}
