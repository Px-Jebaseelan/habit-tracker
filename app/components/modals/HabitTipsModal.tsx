'use client';

import { Lightbulb, X, CheckCircle2 } from 'lucide-react';

interface HabitTipsModalProps {
  category: string;
  habitText: string;
  isOpen: boolean;
  onClose: () => void;
}

const HABIT_TIPS: { [key: string]: string[] } = {
  fitness: [
    'Start with 10 minutes a day and gradually increase',
    'Schedule your workout for the same time each day',
    'Find a workout buddy for accountability',
    'Track your progress with photos or metrics',
    'Mix cardio with strength training',
  ],
  health: [
    'Drink water before every meal',
    'Take vitamins at the same time daily',
    'Get at least 7-9 hours of sleep',
    'Eat colorful fruits and vegetables',
    'Reduce sugar and processed foods',
  ],
  learning: [
    'Study in 25-minute focused sessions',
    'Use spaced repetition for retention',
    'Teach what you learned to someone else',
    'Take notes while learning',
    'Practice active recall daily',
  ],
  mindfulness: [
    'Start with just 5 minutes a day',
    'Try guided meditation apps',
    'Practice deep breathing exercises',
    'Journal your thoughts and feelings',
    'Meditate at the same time each day',
  ],
  productivity: [
    'Use the Pomodoro technique (25 min blocks)',
    'Eliminate distractions before starting',
    'Break tasks into smaller chunks',
    'Track time spent on each task',
    'Review and adjust your system weekly',
  ],
  general: [
    'Be consistent over being perfect',
    'Celebrate small wins',
    'Track your progress visually',
    'Don\'t miss twice in a row',
    'Connect your habit to a larger goal',
  ],
};

export default function HabitTipsModal({
  category,
  habitText,
  isOpen,
  onClose,
}: HabitTipsModalProps) {
  const tips = HABIT_TIPS[category.toLowerCase()] || HABIT_TIPS.general;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-0 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
              <Lightbulb size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Pro Tips</h2>
              <p className="text-slate-400 text-sm truncate max-w-[200px]">{habitText}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="space-y-4">
            {tips.map((tip, idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {tip}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/20 text-center">
            <p className="text-indigo-200 text-sm font-medium">
              💪 Remember: Small consistent actions lead to big changes!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/5"
          >
            Got it, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
