import { connectDB } from '@/lib/db';
import { Habit } from '@/lib/models';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }

    const habits = await Habit.find({ userId });
    return NextResponse.json({ habits });
  } catch (error) {
    console.error('Get habits error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const { userId, text, icon, category, frequency } = await request.json();

    if (!userId || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const habit = await Habit.create({
      userId,
      text,
      icon: icon || '📝',
      category: category || 'general',
      frequency: frequency || 'daily',
      done: false,
      streak: 0,
      history: [],
      isArchived: false,
      reminders: [],
      notes: '',
    });

    return NextResponse.json({ success: true, habit }, { status: 201 });
  } catch (error) {
    console.error('Create habit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();

    const { habitId, ...updates } = await request.json();

    if (!habitId) {
      return NextResponse.json({ error: 'habitId required' }, { status: 400 });
    }

    const habit = await Habit.findByIdAndUpdate(habitId, updates, { new: true });

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, habit });
  } catch (error) {
    console.error('Update habit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const habitId = url.searchParams.get('id');

    if (!habitId) {
      return NextResponse.json({ error: 'id required' }, { status: 400 });
    }

    const habit = await Habit.findByIdAndDelete(habitId);

    if (!habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete habit error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
