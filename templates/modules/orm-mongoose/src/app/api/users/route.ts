import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireApiUser } from '@/lib/server-auth';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  await connectDB();
  return NextResponse.json(await User.find({ ownerId: auth.user.id }).sort({ createdAt: -1 }));
}

export async function POST(request: NextRequest) {
  const auth = await requireApiUser(request);
  if (!auth.ok) return auth.response;
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  await connectDB();
  const user = await User.create({ ownerId: auth.user.id, name, email });
  return NextResponse.json(user, { status: 201 });
}
