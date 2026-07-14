import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireApiUser } from '@/lib/server-auth';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  const id = Number.parseInt((await params).id, 10);
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  const result = await prisma.user.updateMany({
    where: { id, ownerId: auth.user.id },
    data: { ...(name ? { name } : {}), ...(email ? { email } : {}) },
  });
  if (!result.count) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(await prisma.user.findFirst({ where: { id, ownerId: auth.user.id } }));
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  const result = await prisma.user.deleteMany({ where: { id, ownerId: auth.user.id } });
  return result.count ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}
