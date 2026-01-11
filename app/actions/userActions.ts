'use server';

import { connectDB } from '@/lib/db';
import { User as UserModel } from '@/lib/models';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export interface UserData {
  id?: string;
  email: string;
  name: string;
  password?: string;
  subscription?: 'free' | 'pro' | 'premium';
  points?: number;
  level?: number;
  createdAt?: string;
}

// Get user by ID
export async function getUser(userId: string) {
  try {
    await connectDB();
    const user = await UserModel.findById(userId).select('-password').lean();

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const { _id, ...userWithoutId } = user;

    return {
      success: true,
      data: {
        ...userWithoutId,
        id: _id.toString(),
      },
    };
  } catch (error) {
    console.error('Get user error:', error);
    return { success: false, error: 'Failed to fetch user' };
  }
}

// Sign up user
export async function signupUser(userData: {
  email: string;
  password: string;
  name: string;
}) {
  try {
    await connectDB();

    // Check if user exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user
    const newUser = await UserModel.create({
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      subscription: 'free',
      points: 0,
      level: 1,
    });

    revalidatePath('/login');

    return {
      success: true,
      data: {
        id: newUser._id?.toString(),
        email: newUser.email,
        name: newUser.name,
        subscription: newUser.subscription,
        points: newUser.points,
        level: newUser.level,
        createdAt: newUser.createdAt,
      },
    };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: 'Failed to create user account' };
  }
}

// Login user
export async function loginUser(credentials: {
  email: string;
  password: string;
}) {
  try {
    await connectDB();

    // Find user
    const user = await UserModel.findOne({ email: credentials.email });
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!isPasswordCorrect) {
      return { success: false, error: 'Invalid credentials' };
    }

    return {
      success: true,
      data: {
        id: user._id?.toString(),
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        points: user.points,
        level: user.level,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed' };
  }
}

// Update user subscription
export async function updateUserSubscription(
  userId: string,
  subscription: 'free' | 'pro' | 'premium'
) {
  try {
    await connectDB();

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    ).select('-password');

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: user._id?.toString(),
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        points: user.points,
        level: user.level,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    console.error('Update subscription error:', error);
    return { success: false, error: 'Failed to update subscription' };
  }
}

// Update user points
export async function updateUserPoints(userId: string, points: number) {
  try {
    await connectDB();

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { points },
      { new: true }
    ).select('-password');

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: user._id?.toString(),
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        points: user.points,
        level: user.level,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    console.error('Update points error:', error);
    return { success: false, error: 'Failed to update points' };
  }
}

// Update user level
export async function updateUserLevel(userId: string, level: number) {
  try {
    await connectDB();

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { level },
      { new: true }
    ).select('-password');

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        id: user._id?.toString(),
        email: user.email,
        name: user.name,
        subscription: user.subscription,
        points: user.points,
        level: user.level,
        createdAt: user.createdAt,
      },
    };
  } catch (error) {
    console.error('Update level error:', error);
    return { success: false, error: 'Failed to update level' };
  }
}

// Update user profile
export async function updateUserProfile(userId: string, data: { name?: string; email?: string }) {
  try {
    await connectDB();

    const updates: any = {};
    if (data.name) updates.name = data.name;
    if (data.email) updates.email = data.email; // Note: In a real app, email change might require verification or checking uniqueness.

    const user = await UserModel.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select('-password');

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    revalidatePath('/dashboard');

    const { _id, ...userWithoutId } = user.toObject();

    return {
      success: true,
      data: {
        ...userWithoutId,
        id: _id.toString(),
      },
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

// Get all users (leaderboard)
export async function getAllUsers() {
  try {
    await connectDB();
    const users = await UserModel.find()
      .select('-password')
      .lean()
      .sort({ points: -1 });

    return {
      success: true,
      data: users.map((user: any) => {
        const { _id, ...userWithoutId } = user;
        return {
          ...userWithoutId,
          id: _id.toString(),
        };
      }),
    };
  } catch (error) {
    console.error('Get users error:', error);
    return { success: false, error: 'Failed to fetch users' };
  }
}
