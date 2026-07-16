import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  await connectDB();
  const user = await User.findById((await params).id);
  return user ? NextResponse.json(user) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}

export async function PUT(request: Request, { params }: Context) {
  const { name, email } = await request.json() as { name?: string; email?: string };
  await connectDB();
  const user = await User.findOneAndUpdate(
    { _id: (await params).id },
    { ...(name ? { name } : {}), ...(email ? { email } : {}) },
    { new: true, runValidators: true },
  );
  return user ? NextResponse.json(user) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}

export async function DELETE(_request: Request, { params }: Context) {
  await connectDB();
  const user = await User.findByIdAndDelete((await params).id);
  return user ? NextResponse.json({ deleted: true }) : NextResponse.json({ error: 'User not found' }, { status: 404 });
}
