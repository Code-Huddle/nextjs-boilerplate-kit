import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  return NextResponse.json(await prisma.user.findMany());
}

export async function POST(request: Request) {
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  const user = await prisma.user.create({ data: { name, email } });
  return NextResponse.json(user, { status: 201 });
}
