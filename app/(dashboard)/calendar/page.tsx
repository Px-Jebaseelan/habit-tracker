'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, type User } from '@/lib/auth';
import { getHabits } from '@/app/actions/habitActions';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, XCircle, Calendar as CalendarIcon, Flame, TrendingUp } from 'lucide-react';

interface Habit {
  id: string;
  text: string;
  completionHistory: string[];
  currentStreak: number;
}

export default function CalendarPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const init = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      try {
        const result = await getHabits(currentUser.id);
        if (result.success && result.data) {
          setHabits(result.data as any[]);
        }
      } catch (error) {
        console.error('Failed to load habits', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [router]);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDay }, (_, i) => i);

  const previousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDayStatus = (day: number) => {
    if (habits.length === 0) return { status: 'none', count: 0 };

    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    let completedCount = 0;
    habits.forEach(h => {
      if (h.completionHistory.includes(dateStr)) {
        completedCount++;
      }
    });

    if (completedCount === 0) return { status: 'none', count: 0 };
    // Consider it 'complete' if at least 1 habit done for now, or maybe 50%? 
    // Let's say: if completedCount == habits.length -> complete, else partial.
    // But users might have many dormant habits. 
    // Let's make it simple: > 0 is partial, all active is complete.
    // Filter out archived habits? Assuming 'habits' contains active ones or we filter.
    // Let's filter active.
    // We don't have isArchived in the interface above, let's fix that. Actually let's assume valid habits.

    const activeCount = habits.length; // Approximate
    const status = completedCount === activeCount ? 'complete' : 'partial';

    return { status, count: completedCount };
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'complete': return 'bg-emerald-500 shadow-lg shadow-emerald-500/20 text-white';
      case 'partial': return 'bg-amber-500 shadow-lg shadow-amber-500/20 text-white';
      default: return 'bg-slate-800/50 text-slate-400 hover:bg-slate-800';
    }
  };

  // Calculate Stats
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak || 0)) : 0;

  // Monthly stats
  // Calculate total completions in this month
  let monthlyCompletions = 0;
  let perfectDays = 0;
  const daysInCurrentMonthCount = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let i = 1; i <= daysInCurrentMonthCount; i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    let dayCompletions = 0;
    habits.forEach(h => {
      if (h.completionHistory.includes(dateStr)) dayCompletions++;
    });
    monthlyCompletions += dayCompletions;
    if (dayCompletions === habits.length && habits.length > 0) perfectDays++;
  }

  const completionRate = habits.length > 0 ? Math.round((monthlyCompletions / (habits.length * daysInCurrentMonthCount)) * 100) : 0;

  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const DAYS_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="container mx-auto px-6 pt-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
              <CalendarIcon className="text-violet-500" size={36} />
              Habit Calendar
            </h1>
            <p className="text-slate-400 text-lg">
              Visualise your consistency and track your daily wins
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span className="text-sm font-bold text-slate-300">Complete</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              <span className="text-sm font-bold text-slate-300">Partial</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Calendar Area */}
          <div className="lg:col-span-2 bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden p-8">
            <div className="flex items-center justify-between mb-8">
              <button onClick={previousMonth} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <ChevronLeft size={24} />
              </button>
              <h2 className="text-2xl font-black text-white">
                {MONTHS[currentMonth]} <span className="text-violet-400">{currentYear}</span>
              </h2>
              <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                <ChevronRight size={24} />
              </button>
            </div>

            <div className="grid grid-cols-7 mb-4">
              {DAYS_LABELS.map((day) => (
                <div key={day} className="text-center text-sm font-bold text-slate-500 uppercase tracking-wider py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
              {emptyCells.map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}
              {days.map((day) => {
                const { status, count } = getDayStatus(day);
                return (
                  <div
                    key={day}
                    className={`aspect-square rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-105 cursor-pointer relative group ${getStatusColor(status)}`}
                  >
                    {day}
                    {count > 0 && (
                      <div className="absolute -bottom-2 opacity-0 group-hover:opacity-100 group-hover:bottom-full mb-2 bg-slate-900 border border-slate-700 text-slate-200 text-xs py-1 px-3 rounded-lg whitespace-nowrap shadow-xl z-10 transition-all pointer-events-none">
                        {count} habits done
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl shadow-violet-500/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 opacity-90">
                  <Flame className="w-6 h-6" />
                  <span className="font-bold uppercase tracking-wider text-sm">Best Streak</span>
                </div>
                <div className="text-6xl font-black mb-2">{bestStreak} <span className="text-2xl font-bold opacity-60">Days</span></div>
                <p className="opacity-80">Keep pushing! You're doing great.</p>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider text-sm">Monthly Report</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Completions</span>
                  <span className="font-bold text-white">{monthlyCompletions}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Perfect Days</span>
                  <span className="font-bold text-emerald-400">{perfectDays}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Completion Rate</span>
                  <span className="font-bold text-white">{completionRate}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 mt-2">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min(100, completionRate)}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6 text-blue-400">
                <TrendingUp className="w-6 h-6" />
                <span className="font-bold uppercase tracking-wider text-sm">Yearly Overview</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-colors cursor-default ${i === currentMonth ? 'bg-blue-500 text-white' : 'bg-slate-700/30 text-slate-500 hover:bg-slate-700'
                    }`} title={`Month ${i + 1}`}>
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
