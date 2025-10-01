import connectDB from '@/db/connectDb';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await connectDB(); // Make sure to connect to DB

  const { email } = await request.json();
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  console.log("calendlyLink of doctor from DB", user.calendlyLink);
  return NextResponse.json({ calendlyLink: user.calendlyLink });
}
