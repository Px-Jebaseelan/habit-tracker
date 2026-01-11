'use server';

import mongoose, { Schema, Document } from 'mongoose';

export interface IHabit extends Document {
  userId: string;
  text: string;
  icon: string;
  category: string;
  done: boolean;
  frequency: string;
  streak: number;
  history: Date[];
  isArchived: boolean;
  reminders: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabit>(
  {
    userId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    icon: { type: String, default: '📝' },
    category: { type: String, default: 'general' },
    done: { type: Boolean, default: false },
    frequency: { type: String, default: 'daily' },
    streak: { type: Number, default: 0 },
    history: [{ type: Date }],
    isArchived: { type: Boolean, default: false },
    reminders: [{ type: String }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Habit = mongoose.models.Habit || mongoose.model<IHabit>('Habit', HabitSchema);

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  subscription: 'free' | 'pro' | 'premium';
  points: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    subscription: { type: String, enum: ['free', 'pro', 'premium'], default: 'free' },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export interface ISession extends Document {
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: String, required: true, index: true },
    token: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Session = mongoose.models.Session || mongoose.model<ISession>('Session', SessionSchema);
