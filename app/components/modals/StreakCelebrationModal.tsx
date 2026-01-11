'use client';

import { useEffect, useState } from 'react';
import { Share2, X, PartyPopper, Flame } from 'lucide-react';
import ShareAchievementModal from './ShareAchievementModal';

interface StreakCelebrationModalProps {
  streak: number;
  habitName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface Milestone {
  emoji: string;
  title: string;
  message: string;
}

const STREAK_MILESTONES: Record<number, Milestone> = {
  1: { emoji: '🌱', title: 'First Step Taken!', message: 'A journey of 1000 miles begins with a single step.' },
  3: { emoji: '🔥', title: 'Heating Up!', message: 'You\'re on a roll! 3 days in a row.' },
  7: { emoji: '⚡', title: 'Unstoppable Week!', message: 'One full week of consistency. You are amazing!' },
  14: { emoji: '🚀', title: 'Two Weeks Strong!', message: 'Your habit is starting to stick. Keep pushing!' },
  21: { emoji: '🧠', title: 'Habit Forming!', message: 'Scientists say it takes 21 days to form a habit. You did it!' },
  30: { emoji: '⭐', title: 'Monthly Master!', message: 'One month down. This is the new you.' },
  50: { emoji: '💎', title: 'Half Century!', message: '50 days of pure dedication. Incredible.' },
  100: { emoji: '👑', title: 'Century Champion!', message: 'Welcome to the elite 100-day club.' },
  365: { emoji: '🏆', title: 'Year of Greatness!', message: '365 days. You have mastered this habit.' },
};

export default function StreakCelebrationModal({
  streak,
  habitName,
  isOpen,
  onClose,
}: StreakCelebrationModalProps) {
  const [celebration, setCelebration] = useState<Milestone | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Find the best fitting milestone
      const milestones = Object.keys(STREAK_MILESTONES)
        .map(Number)
        .sort((a, b) => b - a);

      let found = null;
      for (const milestone of milestones) {
        if (streak >= milestone) {
          found = STREAK_MILESTONES[milestone];
          break;
        }
      }
      // If no specific milestone (shouldn't happen if triggered correctly), fallback
      setCelebration(found || { emoji: '🎉', title: 'Streak Extended!', message: `You hit a ${streak}-day streak! Keep it up!` });
    }
  }, [isOpen, streak]);

  if (!isOpen || !celebration) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
        <div
          className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 to-slate-800 border-2 border-amber-500/50 rounded-[2.5rem] p-8 text-center shadow-[0_0_50px_rgba(245,158,11,0.2)] animate-in zoom-in-75 duration-300 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Confetti Background Effect (CSS only for simplicity) */}
          <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent animate-pulse" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
          >
            <X size={24} />
          </button>

          <div className="relative z-10 flex flex-col items-center">

            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-6xl shadow-xl shadow-amber-500/30 mb-6 animate-bounce">
              {celebration.emoji}
            </div>

            <h2 className="text-3xl font-black text-white mb-2 leading-tight">
              {celebration.title}
            </h2>

            <p className="text-slate-400 mb-8 font-medium">
              {celebration.message}
            </p>

            <div className="bg-slate-800/60 rounded-2xl p-4 w-full mb-8 border border-white/5">
              <div className="text-xs font-bold text-slate-500 uppercase mb-1">Current Streak</div>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500 flex items-center justify-center gap-2">
                <Flame size={32} className="text-amber-500" fill="currentColor" />
                {streak} Days
              </div>
              <div className="text-sm font-bold text-slate-400 mt-2 truncate">
                {habitName}
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowShareModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold bg-slate-700 hover:bg-slate-600 text-white transition-all active:scale-95"
              >
                <Share2 size={18} />
                Share
              </button>
              <button
                onClick={onClose}
                className="flex-[2] flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-lg shadow-amber-500/25 transition-all active:scale-95"
              >
                <PartyPopper size={18} />
                Awesome!
              </button>
            </div>

          </div>
        </div>
      </div>

      <ShareAchievementModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        achievement={`${streak} Day Streak`}
        description={`I just reached a ${streak}-day streak on my "${habitName}" habit!`}
        icon={celebration.emoji}
      />
    </>
  );
}
