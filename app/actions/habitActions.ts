'use server';

import { connectDB } from '@/lib/db';
import { Habit as HabitModel } from '@/lib/models';
import { revalidatePath } from 'next/cache';

export interface HabitAction {
  id?: string;
  userId: string;
  text: string;
  icon?: string;
  category?: string;
  frequency?: string;
  done?: boolean;
  currentStreak?: number;
  completionHistory?: string[];
  lastCompletedDate?: string | null;
  isArchived?: boolean;
  reminderTime?: string | null;
  notes?: string;
  daysOfWeek?: string[];
}

// Get all habits for a user
export async function getHabits(userId: string) {
  try {
    await connectDB();
    const habits = await HabitModel.find({ userId }).lean();
    return {
      success: true,
      data: habits.map((habit: any) => ({
        ...habit,
        id: habit._id?.toString() || habit.id,
      })),
    };
  } catch (error) {
    console.error('Get habits error:', error);
    return { success: false, error: 'Failed to fetch habits' };
  }
}

// Create new habit
export async function createHabit(habit: HabitAction) {
  try {
    await connectDB();

    const newHabit = await HabitModel.create({
      userId: habit.userId,
      text: habit.text,
      icon: habit.icon || '📌',
      category: habit.category || 'general',
      frequency: habit.frequency || 'daily',
      done: false,
      currentStreak: 0,
      completionHistory: [],
      lastCompletedDate: null,
      isArchived: false,
      reminderTime: habit.reminderTime || null,
      notes: habit.notes || '',
      daysOfWeek: habit.daysOfWeek || [],
    });

    revalidatePath('/dashboard/habits');

    return {
      success: true,
      data: {
        ...newHabit.toObject(),
        id: newHabit._id?.toString(),
      },
    };
  } catch (error) {
    console.error('Create habit error:', error);
    return { success: false, error: 'Failed to create habit' };
  }
}

// Update habit
export async function updateHabit(habitId: string, updates: Partial<HabitAction>) {
  try {
    await connectDB();

    const habit = await HabitModel.findByIdAndUpdate(habitId, updates, {
      new: true,
    });

    if (!habit) {
      return { success: false, error: 'Habit not found' };
    }

    revalidatePath('/dashboard/habits');

    return {
      success: true,
      data: {
        ...habit.toObject(),
        id: habit._id?.toString(),
      },
    };
  } catch (error) {
    console.error('Update habit error:', error);
    return { success: false, error: 'Failed to update habit' };
  }
}

// Toggle habit completion
export async function toggleHabitCompletion(habitId: string, completed: boolean) {
  try {
    await connectDB();

    const habit = await HabitModel.findById(habitId);
    if (!habit) {
      return { success: false, error: 'Habit not found' };
    }

    const today = new Date().toLocaleDateString('sv-SE');
    const completionHistory = habit.completionHistory || [];

    if (completed) {
      // Mark as complete
      if (!completionHistory.includes(today)) {
        completionHistory.push(today);
      }
      habit.done = true;
      habit.lastCompletedDate = today;

      // Update streak
      const yesterday = new Date(Date.now() - 86400000).toLocaleDateString('sv-SE');
      if (habit.lastCompletedDate === yesterday || completionHistory.length === 1) {
        habit.currentStreak = (habit.currentStreak || 0) + 1;
      } else {
        habit.currentStreak = 1;
      }
    } else {
      // Mark as incomplete
      habit.done = false;
      const index = completionHistory.indexOf(today);
      if (index > -1) {
        completionHistory.splice(index, 1);
      }

      // Reset streak if today wasn't completed
      if (habit.lastCompletedDate !== today) {
        habit.currentStreak = 0;
      }
    }

    habit.completionHistory = completionHistory;
    await habit.save();

    revalidatePath('/dashboard/habits');

    return {
      success: true,
      data: {
        ...habit.toObject(),
        id: habit._id?.toString(),
      },
    };
  } catch (error) {
    console.error('Toggle habit error:', error);
    return { success: false, error: 'Failed to toggle habit' };
  }
}

// Delete habit
export async function deleteHabit(habitId: string) {
  try {
    await connectDB();

    const habit = await HabitModel.findByIdAndDelete(habitId);
    if (!habit) {
      return { success: false, error: 'Habit not found' };
    }

    revalidatePath('/dashboard/habits');

    return { success: true, message: 'Habit deleted' };
  } catch (error) {
    console.error('Delete habit error:', error);
    return { success: false, error: 'Failed to delete habit' };
  }
}

// Archive habit
export async function archiveHabit(habitId: string) {
  try {
    await connectDB();

    const habit = await HabitModel.findByIdAndUpdate(
      habitId,
      { isArchived: true },
      { new: true }
    );

    if (!habit) {
      return { success: false, error: 'Habit not found' };
    }

    revalidatePath('/dashboard/habits');

    return {
      success: true,
      data: {
        ...habit.toObject(),
        id: habit._id?.toString(),
      },
    };
  } catch (error) {
    console.error('Archive habit error:', error);
    return { success: false, error: 'Failed to archive habit' };
  }
}
