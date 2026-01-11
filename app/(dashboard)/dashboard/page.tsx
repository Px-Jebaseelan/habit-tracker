'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, type User } from '@/lib/auth';
import StatCard from '@/app/components/shared/StatCard';
import { LEVEL_THRESHOLDS } from '@/lib/constants';
import {
  ClipboardList,
  CheckCircle2,
  Flame,
  Trophy,
  TrendingUp,
  BarChart3,
  Settings,
  Crown,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import ActivityChart from '@/app/components/dashboard/ActivityChart';
import RecentActivity from '@/app/components/dashboard/RecentActivity';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [habits, setHabits] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    pointsThisWeek: 0,
  });

  useEffect(() => {
    setIsHydrated(true);
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      router.push('/login');
      return;
    }

    // Load habits from localStorage
    const stored = localStorage.getItem('zenithHabitzData_FullV1_Final');
    const habitsData = stored ? JSON.parse(stored) : [];
    setHabits(habitsData);

    // Calculate statistics
    const today = new Date().toLocaleDateString('sv-SE');
    const completed = habitsData.filter(
      (h: any) => h.completionHistory?.includes(today) && !h.isArchived
    );
    const maxStreak = Math.max(
      0,
      ...habitsData.map((h: any) => h.currentStreak || 0)
    );

    setStats({
      totalHabits: habitsData.filter((h: any) => !h.isArchived).length,
      completedToday: completed.length,
      currentStreak: maxStreak,
      pointsThisWeek: completed.length * 10,
    });
  }, [router]);

  if (!isHydrated || !user) return null;

  const progressPercent = stats.totalHabits > 0 ? (stats.completedToday / stats.totalHabits) * 100 : 0;
  const userLevel = user.level || 1;
  const nextLevelPoints = LEVEL_THRESHOLDS[userLevel] || 0;
  const currentPoints = user.points || 0;
  const pointsProgress = nextLevelPoints > 0 ? (currentPoints / nextLevelPoints) * 100 : 0;

  // SVG Calculation for Circle Progress
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pointsProgress / 100) * circumference;

  // Mock Data Generators (In a real app, this would come from the backend)
  const generateChartData = () => {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      const data = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        data.push({
          date: days[d.getDay()],
          completed: Math.floor(Math.random() * 5) + (i === 0 ? stats.completedToday : 2), // Mock data mixed with real
          total: 8
        });
      }
      return data;
    };

  const mockActivities = [
      { id: '1', type: 'completion' as const, title: 'Completed Morning Meditation', habitName: 'Mindfulness', timestamp: '2h ago' },
      { id: '2', type: 'streak' as const, title: 'Reached 7 Day Streak!', habitName: 'Running', timestamp: '5h ago' },
      { id: '3', type: 'completion' as const, title: 'Completed Drink Water', habitName: 'Health', timestamp: '6h ago' },
      { id: '4', type: 'level_up' as const, title: 'Leveled Up to Level 2!', timestamp: '1d ago' },
      { id: '5', type: 'achievement' as const, title: 'Earned "Early Bird" Badge', timestamp: '2d ago' },
    ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-600 to-indigo-600 p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Welcome back, {user.name}! 👋</h1>
            <p className="text-indigo-100 text-lg font-medium max-w-xl">Ready to make this day count? You're on a roll with your habits!</p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div className="text-right">
              <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Current Level</div>
              <div className="text-2xl font-black">{userLevel}</div>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <div className="text-xs font-bold text-indigo-200 uppercase tracking-wider">XP Progress</div>
              <div className="text-lg font-bold">{currentPoints} / {nextLevelPoints}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Habits"
          value={stats.totalHabits}
          icon={ClipboardList}
          variant="primary"
        />
        <StatCard
          label="Completed Today"
          value={stats.completedToday}
          icon={CheckCircle2}
          variant="success"
          trend={{ value: Math.round(progressPercent), direction: stats.completedToday > 0 ? 'up' : 'down' }}
        />
        <StatCard
          label="Current Streak"
          value={stats.currentStreak}
          icon={Flame}
          variant="warning"
        />
        <StatCard
          label="This Week"
          value={stats.pointsThisWeek}
          icon={Trophy}
          variant="info"
        />
      </div>

      {/* Charts & Activity Grid (New Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[400px]">
          <ActivityChart data={generateChartData()} />
        </div>
        <div className="h-[400px]">
          <RecentActivity activities={mockActivities} />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress & Quick Actions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <span className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <TrendingUp size={20} />
                </span>
                Daily Progress
              </h3>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full text-sm">
                {Math.round(progressPercent)}% Complete
              </span>
            </div>

            <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-center text-slate-400 text-sm mt-3">
              You've completed <strong>{stats.completedToday}</strong> out of <strong>{stats.totalHabits}</strong> habits today.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white mb-6 px-2">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a href="/habits" className="group p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl hover:bg-slate-750 hover:border-violet-500/50 transition-all flex flex-col items-center justify-center gap-3 hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-violet-500/20 text-violet-400 group-hover:scale-110 transition-transform">
                  <ClipboardList size={22} />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">Manage Habits</span>
              </a>
              <a href="/analytics" className="group p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl hover:bg-slate-750 hover:border-cyan-500/50 transition-all flex flex-col items-center justify-center gap-3 hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 group-hover:scale-110 transition-transform">
                  <BarChart3 size={22} />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">View Analytics</span>
              </a>
              <a href="/settings" className="group p-4 bg-slate-800/80 border border-slate-700/50 rounded-2xl hover:bg-slate-750 hover:border-slate-500/50 transition-all flex flex-col items-center justify-center gap-3 hover:-translate-y-1">
                <div className="p-3 rounded-xl bg-slate-500/20 text-slate-400 group-hover:scale-110 transition-transform">
                  <Settings size={22} />
                </div>
                <span className="text-sm font-medium text-slate-300 group-hover:text-white">Settings</span>
              </a>
              {user.subscription === 'free' && (
                <a href="/upgrade" className="group p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl hover:from-amber-500/20 hover:to-orange-500/20 transition-all flex flex-col items-center justify-center gap-3 hover:-translate-y-1 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform animate-pulse">
                    <Crown size={22} />
                  </div>
                  <span className="text-sm font-bold text-amber-100/90 group-hover:text-amber-100">Upgrade Plan</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Level Progress Column */}
        <div className="lg:col-span-1 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-lg flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-violet-500/5 to-transparent pointer-events-none" />

          <h3 className="text-xl font-bold text-white mb-8 z-10">Level Progress</h3>

          <div className="relative mb-6 group cursor-pointer">
            <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl group-hover:bg-violet-500/30 transition-all duration-500" />
            <svg width="160" height="160" viewBox="0 0 120 120" className="relative z-10 transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-20">
              <span className="text-4xl font-black text-white">{userLevel}</span>
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Level</span>
            </div>
          </div>

          <p className="text-lg font-bold text-white mb-2">Keep going!</p>
          <p className="text-slate-400 text-sm mb-8">{nextLevelPoints - currentPoints} XP to reach level {userLevel + 1}</p>

          <a href="/achievements" className="w-full py-3 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-white font-bold transition-all flex items-center justify-center gap-2 group">
            View Achievements
            <ArrowUpRight size={18} className="text-slate-400 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}

