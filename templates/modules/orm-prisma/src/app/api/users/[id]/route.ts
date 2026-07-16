import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Context) {
  const id = Number.parseInt((await params).id, 10);
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  const result = await prisma.user.updateMany({
    where: { id },
    data: { ...(name ? { name } : {}), ...(email ? { email } : {}) },
  });
  if (!result.count) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  return NextResponse.json(await prisma.user.findUnique({ where: { id } }));
}

export async function DELETE(_request: Request, { params }: Context) {
  const id = Number.parseInt((await params).id, 10);
  if (!Number.isInteger(id)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  const result = await prisma.user.deleteMany({ where: { id } });
  return result.count ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}
