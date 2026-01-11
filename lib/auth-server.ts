import { User as MongoUser, Habit } from './models';
import connectDB from './db';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'pro' | 'premium';
  createdAt: string;
  points?: number;
  level?: number;
}

// Helper to convert MongoDB document to User interface
export const mongoUserToUser = (mongoUser: any): User => ({
  id: mongoUser._id?.toString() || mongoUser.id,
  email: mongoUser.email,
  name: mongoUser.name,
  subscription: mongoUser.subscription,
  points: mongoUser.points || 0,
  level: mongoUser.level || 1,
  createdAt: mongoUser.createdAt?.toISOString() || new Date().toISOString(),
});

// Server-side database functions
export const createUserDB = async (email: string, password: string, name: string): Promise<User | null> => {
  try {
    await connectDB();

    const existingUser = await MongoUser.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await MongoUser.create({
      email,
      password: hashedPassword,
      name,
      subscription: 'free',
      points: 0,
      level: 1,
    });

    return mongoUserToUser(newUser);
  } catch (error) {
    console.error('Create user error:', error);
    return null;
  }
};

export const loginUserDB = async (email: string, password: string): Promise<User | null> => {
  try {
    await connectDB();

    const user = await MongoUser.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }

    return mongoUserToUser(user);
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const updateUserSubscriptionDB = async (userId: string, subscription: 'free' | 'pro' | 'premium') => {
  try {
    await connectDB();

    const user = await MongoUser.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );

    return mongoUserToUser(user);
  } catch (error) {
    console.error('Update subscription error:', error);
    return null;
  }
};

export const updateUserPointsDB = async (userId: string, points: number) => {
  try {
    await connectDB();

    const user = await MongoUser.findByIdAndUpdate(
      userId,
      { points },
      { new: true }
    );

    return mongoUserToUser(user);
  } catch (error) {
    console.error('Update points error:', error);
    return null;
  }
};

export const updateUserLevelDB = async (userId: string, level: number) => {
  try {
    await connectDB();

    const user = await MongoUser.findByIdAndUpdate(
      userId,
      { level },
      { new: true }
    );

    return mongoUserToUser(user);
  } catch (error) {
    console.error('Update level error:', error);
    return null;
  }
};
