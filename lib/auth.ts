'use client';

export interface User {
  id: string;
  email: string;
  name: string;
  subscription: 'free' | 'pro' | 'premium';
  createdAt: string;
  points?: number;
  level?: number;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
}

// Client-side session management
const SESSION_KEY = 'habit_tracker_session';

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const session = localStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
};

export const setCurrentUser = (user: User) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

export const logoutUser = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
};
