'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, type User } from '@/lib/auth';
import { getHabits } from '@/app/actions/habitActions';
import StatCard from '@/app/components/shared/StatCard';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Flame,
  PieChart as PieChartIcon,
  TrendingUp,
  Trophy
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

interface Habit {
  id: string;
  text: string;
  icon: string;
  category: string;
  done: boolean;
  currentStreak: number;
  completionHistory: string[];
  isArchived: boolean;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageCompletionRate: 0,
    bestStreak: 0,
    topHabit: { name: '', streak: 0 },
    thisWeekCompleted: 0,
    thisMonthCompleted: 0,
    categoryStats: [] as any[],
    weeklyActivity: [] as any[],
  });

  useEffect(() => {
    const init = async () => {
      setIsHydrated(true);
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      try {
        const result = await getHabits(currentUser.id);
        if (result.success && result.data) {
          calculateStats(result.data as Habit[]);
        }
      } catch (error) {
        console.error('Failed to load analytics data', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [router]);

  const calculateStats = (habitsData: Habit[]) => {
    // Calculate statistics
    const today = new Date();
    // Get start of current week (Monday)
    const d = new Date(today);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const weekStart = new Date(d.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const weekStartISO = weekStart.toISOString().split('T')[0];
    const monthStartISO = monthStart.toISOString().split('T')[0];

    let totalCompleted = 0;
    let thisWeekCompleted = 0;
    let thisMonthCompleted = 0;
    const bestStreak = Math.max(0, ...habitsData.map((h) => h.currentStreak || 0));
    let topHabit = { name: '', streak: 0 };

    const categoryMap: Record<string, number> = {};
    const weeklyMap: Record<string, number> = { 'Sun': 0, 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0 };

    habitsData.forEach((habit) => {
      // Include archived habits in historical stats? Probably yes for total completion, but maybe exclude from "active" metrics.
      // Let's exclude archived from streak and current performance, but keep for total history if possible.
      // For simplicity, let's process everything but filter active for completion rate.

      totalCompleted += habit.completionHistory?.length || 0;

      if (habit.completionHistory) {
        habit.completionHistory.forEach((date: string) => {
          if (date >= weekStartISO) thisWeekCompleted++;
          if (date >= monthStartISO) thisMonthCompleted++;

          // Weekly Activity Data
          const dateObj = new Date(date);
          const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
          if (weeklyMap[dayName] !== undefined) {
            weeklyMap[dayName]++;
          }
        });
      }

      if (!habit.isArchived) {
        if ((habit.currentStreak || 0) > topHabit.streak) {
          topHabit = { name: habit.text, streak: habit.currentStreak || 0 };
        }
      }

      if (habit.category) {
        categoryMap[habit.category] = (categoryMap[habit.category] || 0) + (habit.completionHistory?.length || 0);
      }
    });

    const activeHabits = habitsData.filter((h) => !h.isArchived);
    const averageCompletionRate =
      activeHabits.length > 0
        ? Math.round((activeHabits.filter((h) => h.done).length / activeHabits.length) * 100)
        : 0;

    const categoryStats = Object.entries(categoryMap).map(([name, count]) => ({
      name,
      value: count, // Recharts uses 'value'
    }));

    // Sort days correctly
    const daysOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyActivity = daysOrder.map(day => ({
      name: day,
      completions: weeklyMap[day]
    }));

    setStats({
      totalCompleted,
      averageCompletionRate,
      bestStreak,
      topHabit,
      thisWeekCompleted,
      thisMonthCompleted,
      categoryStats: categoryStats.sort((a, b) => b.value - a.value),
      weeklyActivity
    });
  };

  if (!isHydrated || !user) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="space-y-8 animate-fade-in pb-12 w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-700/50">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Analytics</h1>
          <p className="text-slate-400 text-lg">Track your progress and insights</p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Completed"
          value={stats.totalCompleted}
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          label="This Week"
          value={stats.thisWeekCompleted}
          icon={CalendarDays}
          variant="primary"
        />
        <StatCard
          label="This Month"
          value={stats.thisMonthCompleted}
          icon={BarChart3}
          variant="info"
        />
        <StatCard
          label="Best Streak"
          value={stats.bestStreak}
          icon={Flame}
          variant="warning"
        />
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Weekly Activity Bar Chart */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
              <BarChart3 size={20} />
            </span>
            <h3 className="text-xl font-bold text-white">Weekly Activity</h3>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: '#334155', opacity: 0.2 }}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Bar
                  dataKey="completions"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
              <PieChartIcon size={20} />
            </span>
            <h3 className="text-xl font-bold text-white">Habits by Category</h3>
          </div>

          <div className="h-[300px] w-full flex items-center justify-center">
            {stats.categoryStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.categoryStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600 }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-500">
                <PieChartIcon size={48} className="mx-auto mb-2 opacity-50" />
                <p>No category data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Insights & Top Habits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Completion Rate */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl flex flex-col justify-center items-center text-center">
          <div className="relative w-40 h-40 mb-6 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="80" cy="80" r="70" stroke="#1e293b" strokeWidth="12" fill="none" />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="#10b981"
                strokeWidth="12"
                fill="none"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * stats.averageCompletionRate) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{stats.averageCompletionRate}%</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Completion Rate</h3>
          <p className="text-slate-400 text-sm">active habits average</p>
        </div>

        {/* Top Habit */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 shadow-xl text-white flex flex-col justify-between overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-200">
              <Trophy size={18} />
              <span className="font-bold uppercase tracking-wider text-xs">Top Performer</span>
            </div>
            <h3 className="text-2xl font-black mb-1">{stats.topHabit.name || 'N/A'}</h3>
            <p className="text-indigo-200 text-sm">Most consistent habit</p>
          </div>

          <div className="mt-8">
            <div className="text-sm font-medium opacity-80 mb-1">Current Streak</div>
            <div className="text-5xl font-black flex items-center gap-2">
              {stats.topHabit.streak} <span className="text-2xl opacity-60">days</span>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-amber-400">💡</span> Insights
          </h3>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="mt-1 p-1.5 rounded-full bg-emerald-500/20 text-emerald-400">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  You've completed <strong className="text-white">{stats.totalCompleted} habits</strong> in total. That's huge!
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="mt-1 p-1.5 rounded-full bg-blue-500/20 text-blue-400">
                <CalendarDays size={16} />
              </div>
              <div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your daily average is <strong className="text-white">{Math.round(stats.thisWeekCompleted / 7) || 0} habits</strong> this week.
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="mt-1 p-1.5 rounded-full bg-rose-500/20 text-rose-400">
                <Flame size={16} />
              </div>
              <div>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {stats.averageCompletionRate >= 80 ? 'You are absolutely crushing it! Keep this momentum.' : 'Consistency is key. Try to improve your daily streak!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
