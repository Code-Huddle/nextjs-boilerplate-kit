import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireApiUser } from '@/lib/server-auth';
import User from '@/models/User';

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  await connectDB();
  const user = await User.findOne({ _id: (await params).id, ownerId: auth.user.id });
  return user ? NextResponse.json(user) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}

export async function PUT(request: NextRequest, { params }: Context) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  const { name, email } = await request.json() as { name?: string; email?: string };
  await connectDB();
  const user = await User.findOneAndUpdate(
    { _id: (await params).id, ownerId: auth.user.id },
    { ...(name ? { name } : {}), ...(email ? { email } : {}) },
    { new: true, runValidators: true },
  );
  return user ? NextResponse.json(user) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  await connectDB();
  const user = await User.findOneAndDelete({ _id: (await params).id, ownerId: auth.user.id });
  return user ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}
