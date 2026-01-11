'use client';

import { useState } from 'react';
import { X, Calendar, Edit3, Flame, List, CheckCircle2, Save } from 'lucide-react';

interface Habit {
  id: string;
  text: string;
  icon: string;
  category: string;
  done: boolean;
  currentStreak: number;
  completionHistory: string[];
  notes: string;
  daysOfWeek?: string[];
  frequency?: string;
}

interface HabitDetailsModalProps {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (habitId: string, updates: Partial<Habit>) => void;
  onToggleArchive?: (habitId: string) => void;
}

export default function HabitDetailsModal({
  habit,
  isOpen,
  onClose,
  onUpdate,
}: HabitDetailsModalProps) {
  const [notes, setNotes] = useState(habit?.notes || '');
  const [isNotesModified, setIsNotesModified] = useState(false);

  // Update notes state when habit changes
  if (habit && habit.notes !== notes && !isNotesModified) {
    setNotes(habit.notes);
  }

  if (!isOpen || !habit) return null;

  const historyLength = habit.completionHistory?.length || 0;

  // Calculate completion rate (approximate based on last 30 days)
  const calculateCompletionRate = () => {
    if (!habit.completionHistory || habit.completionHistory.length === 0) return 0;

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // Count completions in last 30 days
    const completions = habit.completionHistory.filter(dateStr => {
      const date = new Date(dateStr);
      return date >= thirtyDaysAgo && date <= today;
    });

    return Math.round((completions.length / 30) * 100);
  };

  const completionRate = calculateCompletionRate();

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setIsNotesModified(true);
  };

  const handleSaveNotes = () => {
    if (onUpdate) {
      onUpdate(habit.id, { notes });
      setIsNotesModified(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-b border-white/5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-4xl shadow-xl">
                {habit.icon}
              </div>
              <div>
                <h2 className="text-2xl font-black text-white mb-1">{habit.text}</h2>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {habit.category}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                    {habit.frequency || 'Daily'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-white/5">
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 text-center">
            <div className="text-3xl font-black text-white mb-1 flex items-center justify-center gap-1">
              <Flame size={24} className="text-orange-500" fill="currentColor" />
              {habit.currentStreak}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase">Current Streak</div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 text-center">
            <div className="text-3xl font-black text-white mb-1">
              {historyLength}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase">Total Completed</div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 text-center">
            <div className="text-3xl font-black text-white mb-1">
              {completionRate}%
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase">30-Day Rate</div>
          </div>
          <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50 text-center">
            <div className="text-3xl font-black text-white mb-1 flex items-center justify-center">
              {habit.done ? <CheckCircle2 size={24} className="text-emerald-500" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-600" />}
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase">Status Today</div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Notes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Edit3 size={16} /> Notes & Reflections
              </label>
              {isNotesModified && (
                <button
                  onClick={handleSaveNotes}
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Save size={14} /> Save Changes
                </button>
              )}
            </div>
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add your thoughts, strategies, or reasons for this habit..."
              className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-slate-300 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all resize-none"
            />
          </div>

          {/* Activity Log (Mock/Simple for now) */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <List size={16} /> Recent Activity
            </label>
            <div className="bg-slate-800/30 rounded-2xl p-2 border border-slate-700/50 max-h-48 overflow-y-auto custom-scrollbar">
              {historyLength > 0 ? (
                habit.completionHistory?.slice().sort((a, b) => new Date(b).getTime() - new Date(a).getTime()).slice(0, 10).map((dateStr, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 hover:bg-slate-700/30 rounded-xl transition-colors">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 size={16} />
                    </div>
                    <span className="text-slate-300 font-medium">
                      Completed on {new Date(dateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  No activity recorded yet. Start today!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-900 border-t border-white/5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
