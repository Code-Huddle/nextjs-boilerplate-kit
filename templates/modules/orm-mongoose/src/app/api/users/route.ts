import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  await connectDB();
  return NextResponse.json(await User.find().sort({ createdAt: -1 }));
}

export async function POST(request: Request) {
  const { name, email } = await request.json() as { name?: string; email?: string };
  if (!name || !email) return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  await connectDB();
  const user = await User.create({ name, email });
  return NextResponse.json(user, { status: 201 });
}
