'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, type User } from '@/lib/auth';
import { getHabits } from '@/app/actions/habitActions';
import { Trophy, Medal, Star, Calendar, Share2, Flame, Lock, CheckCircle2 } from 'lucide-react';

interface Habit {
  id: string;
  text: string;
  completionHistory: string[];
  currentStreak: number;
  category: string;
}

export default function AchievementsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Calculate Achievements
  const bestStreak = habits.length > 0 ? Math.max(...habits.map(h => h.currentStreak || 0)) : 0;
  const totalCompletions = habits.reduce((acc, h) => acc + (h.completionHistory?.length || 0), 0);
  const categories = new Set(habits.map(h => h.category));

  const ACHIEVEMENTS = [
    {
      id: 1,
      title: 'Getting Started',
      icon: <Medal className="w-8 h-8 text-emerald-400" />,
      description: 'Complete your first habit to start your journey.',
      locked: totalCompletions === 0,
      progress: totalCompletions > 0 ? 100 : 0
    },
    {
      id: 2,
      title: 'One Week Warrior',
      icon: <Flame className="w-8 h-8 text-orange-500" />,
      description: 'Maintain a 7-day streak.',
      locked: bestStreak < 7,
      progress: Math.min(100, Math.round((bestStreak / 7) * 100))
    },
    {
      id: 3,
      title: 'Monthly Master',
      icon: <Star className="w-8 h-8 text-amber-400" />,
      description: 'Maintain a 30-day streak.',
      locked: bestStreak < 30,
      progress: Math.min(100, Math.round((bestStreak / 30) * 100))
    },
    {
      id: 4,
      title: 'DIVERSE INTERESTS', // Renamed from Category Champion for generic fit
      icon: <Trophy className="w-8 h-8 text-violet-400" />,
      description: 'Create habits in at least 3 categories.',
      locked: categories.size < 3,
      progress: Math.min(100, Math.round((categories.size / 3) * 100))
    },
    {
      id: 5,
      title: 'Century Champion',
      icon: <Trophy className="w-8 h-8 text-yellow-400" />,
      description: 'Reach a 100-day streak.',
      locked: bestStreak < 100,
      progress: Math.min(100, Math.round((bestStreak / 100) * 100))
    },
    {
      id: 6,
      title: 'Consistency King', // Renamed
      icon: <Calendar className="w-8 h-8 text-blue-400" />,
      description: 'Complete 100 total habits.',
      locked: totalCompletions < 100,
      progress: Math.min(100, Math.round((totalCompletions / 100) * 100))
    },
    {
      id: 7,
      title: 'Habit Hoarder',
      icon: <Share2 className="w-8 h-8 text-pink-400" />,
      description: 'Have 5 or more active habits.',
      locked: habits.length < 5,
      progress: Math.min(100, Math.round((habits.length / 5) * 100))
    },
    {
      id: 8,
      title: 'Perfectionist',
      icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
      description: 'Complete all habits today.',
      locked: habits.length === 0 || habits.some(h => !h.completionHistory.includes(new Date().toISOString().split('T')[0])),
      progress: habits.length > 0 ? Math.round((habits.filter(h => h.completionHistory.includes(new Date().toISOString().split('T')[0])).length / habits.length) * 100) : 0
    },
  ];

  const unlockedCount = ACHIEVEMENTS.filter(a => !a.locked).length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercentage = Math.round((unlockedCount / totalCount) * 100);

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
              <Trophy className="text-yellow-500" size={36} />
              Achievements
            </h1>
            <p className="text-slate-400 text-lg">
              Unlock badges and milestones as you progress on your journey
            </p>
          </div>

          {/* Progress Card */}
          <div className="w-full md:w-auto bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl flex items-center gap-6">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="4"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeDasharray={`${progressPercentage}, 100`}
                  className="animate-[spin_1s_ease-out_reverse]"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-white text-sm">
                {progressPercentage}%
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-white">{unlockedCount} <span className="text-slate-500 text-base font-medium">/ {totalCount}</span></div>
              <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">Unlocked</div>
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACHIEVEMENTS.map((achievement) => (
            <div
              key={achievement.id}
              className={`relative group overflow-hidden rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${achievement.locked
                ? 'bg-slate-800/20 border-slate-800 grayscale opacity-80 hover:opacity-100 hover:border-slate-700'
                : 'bg-slate-800/60 backdrop-blur-xl border-slate-700/50 hover:border-violet-500/50 hover:shadow-2xl hover:shadow-violet-500/10'
                }`}
            >
              {/* Background Gradient for unlocked */}
              {!achievement.locked && (
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}

              <div className="p-8 flex flex-col items-center text-center h-full relative z-10">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 text-4xl shadow-lg transition-transform group-hover:scale-110 ${achievement.locked
                  ? 'bg-slate-800'
                  : 'bg-slate-900 border border-slate-700 shadow-violet-500/20'
                  }`}>
                  {achievement.locked ? <Lock className="w-8 h-8 text-slate-600" /> : achievement.icon}
                </div>

                <h3 className={`text-lg font-bold mb-3 ${achievement.locked ? 'text-slate-500' : 'text-white'}`}>
                  {achievement.title}
                </h3>

                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  {achievement.description}
                </p>

                <div className="mt-auto w-full">
                  {!achievement.locked ? (
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 size={12} />
                      Unlocked
                    </div>
                  ) : (
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-slate-600 h-full rounded-full"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">How to Level Up 🚀</h2>
            <ul className="space-y-4">
              {[
                'Maintain daily streaks to unlock milestone badges',
                'Track habits across different categories like Health and Productivity',
                'Share your progress with the community to earn social badges',
                'Complete daily challenges to speed up your progress'
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                  </div>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
