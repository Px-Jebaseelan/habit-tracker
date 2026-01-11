import { connectDB } from '@/lib/db';
import { User } from '@/lib/models';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      name,
      subscription: 'free',
      points: 0,
      level: 1,
    });

    // Return user without password
    const userResponse = {
      _id: newUser._id,
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      subscription: newUser.subscription,
      points: newUser.points,
      level: newUser.level,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
