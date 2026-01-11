'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, type User } from '@/lib/auth';
import { getHabits, createHabit, deleteHabit, toggleHabitCompletion, archiveHabit, updateHabit } from '@/app/actions/habitActions';
import { FEATURE_LIMITS, HABIT_CATEGORIES, SUGGESTED_HABITS, MOTIVATIONAL_QUOTES } from '@/lib/constants';
import ToastContainer, { useToast } from '@/app/components/shared/Toast';
import {
  Plus,
  Trash2,
  Archive,
  ArchiveRestore,
  Check,
  Flame,
  Tag,
  Filter,
  LayoutGrid,
  List,
  Lightbulb,
} from 'lucide-react';
import HabitModal from '@/app/components/dashboard/HabitModal';
import DeleteConfirmationModal from '@/app/components/modals/DeleteConfirmationModal';
import HabitDetailsModal from '@/app/components/modals/HabitDetailsModal';
import HabitTipsModal from '@/app/components/modals/HabitTipsModal';
import StreakCelebrationModal from '@/app/components/modals/StreakCelebrationModal';

interface Habit {
  id: string;
  text: string;
  icon: string;
  category: string;
  done: boolean;
  frequency: string;
  currentStreak: number;
  completionHistory: string[];
  lastCompletedDate: string | null;
  isArchived: boolean;
  reminderTime: string | null;
  notes: string;
  daysOfWeek: string[];
}

export default function HabitsPage() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'archived'>('active');
  const [sortBy, setSortBy] = useState<'streak' | 'name' | 'category'>('streak');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // New Modals State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const [tipsModalOpen, setTipsModalOpen] = useState(false);
  const [celebrationData, setCelebrationData] = useState<{ isOpen: boolean; streak: number; habitName: string }>({
    isOpen: false, streak: 0, habitName: ''
  });

  const [quoteIndex, setQuoteIndex] = useState(0);

  const { toasts, showToast } = useToast();

  useEffect(() => {
    const init = async () => {
      const currentUser = getCurrentUser();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);
      setQuoteIndex(Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));

      try {
        const result = await getHabits(currentUser.id);
        if (result.success && result.data) {
          setHabits(result.data as any[]);
        } else {
          showToast({ message: 'Failed to load habits', type: 'error' });
        }
      } catch (error) {
        console.error('Failed to fetch habits', error);
        showToast({ message: 'Error loading habits', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [router]);

  const handleCreateHabit = async (data: any) => {
    if (!user) return;

    // Check limits
    const userLimits = FEATURE_LIMITS[user.subscription as keyof typeof FEATURE_LIMITS];
    if (habits.filter(h => !h.isArchived).length >= userLimits.maxHabits) {
      showToast({ message: `Upgrade to Pro to add more habits!`, type: 'error' });
      return;
    }

    setIsSaving(true);
    try {
      const result = await createHabit({
        userId: user.id,
        ...data
      });

      if (result.success && result.data) {
        setHabits(prev => [result.data as any, ...prev]);
        showToast({ message: 'Habit created successfully!', type: 'success' });
        setIsModalOpen(false);
      } else {
        showToast({ message: 'Failed to create habit', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error creating habit', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateHabit = async (data: any) => {
    if (!editingHabit) return;
    setIsSaving(true);
    try {
      const result = await updateHabit(editingHabit.id, data);

      if (result.success && result.data) {
        setHabits(prev => prev.map(h => h.id === editingHabit.id ? (result.data as any) : h));
        showToast({ message: 'Habit updated successfully!', type: 'success' });
        setIsModalOpen(false);
        setEditingHabit(null);
      } else {
        showToast({ message: 'Failed to update habit', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error updating habit', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const openCreateModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  const toggleHabitDone = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const newDoneState = !habit.done;

    // Optimistic update
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        return {
          ...h,
          done: newDoneState,
          currentStreak: newDoneState ? (h.currentStreak || 0) + 1 : Math.max(0, (h.currentStreak || 0) - 1)
        };
      }
      return h;
    }));

    if (newDoneState) {
      const element = document.getElementById(`habit-card-${habitId}`);
      if (element) {
        element.classList.add('scale-[1.02]', 'ring-2', 'ring-emerald-500');
        setTimeout(() => {
          element.classList.remove('scale-[1.02]', 'ring-2', 'ring-emerald-500');
        }, 300);
      }
    }

    try {
      const result = await toggleHabitCompletion(habitId, newDoneState);
      if (result.success && result.data) {
        const updatedHabit = result.data as Habit;
        setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h));

        if (newDoneState) {
          showToast({ message: 'Habit completed! Great job! 🔥', type: 'success' });

          // Check for milestones to trigger celebration
          const streak = updatedHabit.currentStreak;
          if (streak > 0 && (streak === 1 || streak === 3 || streak === 7 || streak % 30 === 0 || streak === 100)) {
            setCelebrationData({
              isOpen: true,
              streak,
              habitName: updatedHabit.text
            });
          }
        }
      } else {
        // Revert
        setHabits(prev => prev.map(h => h.id === habitId ? habit : h));
        showToast({ message: 'Failed to update habit', type: 'error' });
      }
    } catch (error) {
      setHabits(prev => prev.map(h => h.id === habitId ? habit : h));
      showToast({ message: 'Error updating habit', type: 'error' });
    }
  };

  const openDeleteModal = (habitId: string) => {
    setHabitToDelete(habitId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteHabit = async () => {
    if (!habitToDelete) return;
    setIsSaving(true);
    const previousHabits = [...habits];
    setHabits(prev => prev.filter(h => h.id !== habitToDelete));

    try {
      const result = await deleteHabit(habitToDelete);
      if (result.success) {
        showToast({ message: 'Habit deleted', type: 'success' });
      } else {
        setHabits(previousHabits);
        showToast({ message: 'Failed to delete habit', type: 'error' });
      }
    } catch (error) {
      setHabits(previousHabits);
      showToast({ message: 'Error deleting habit', type: 'error' });
    } finally {
      setIsSaving(false);
      setDeleteModalOpen(false);
      setHabitToDelete(null);
    }
  };

  const toggleArchiveHabitById = async (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const previousHabits = [...habits];
    const newArchivedState = !habit.isArchived;

    setHabits(prev => prev.map(h => h.id === habitId ? { ...h, isArchived: newArchivedState } : h));

    try {
      let result;
      if (newArchivedState) {
        result = await archiveHabit(habitId);
      } else {
        result = await updateHabit(habitId, { isArchived: false });
      }

      if (result.success) {
        showToast({ message: newArchivedState ? 'Habit archived' : 'Habit restored', type: 'success' });
      } else {
        setHabits(previousHabits);
        showToast({ message: 'Failed to update habit', type: 'error' });
      }

    } catch (error) {
      setHabits(previousHabits);
      showToast({ message: 'Error updating habit', type: 'error' });
    }
  };

  const getFilteredAndSortedHabits = () => {
    let result = habits;

    // Filter
    switch (filter) {
      case 'active':
        result = result.filter((h) => !h.isArchived);
        break;
      case 'archived':
        result = result.filter((h) => h.isArchived);
        break;
    }

    // Sort
    return result.sort((a, b) => {
      if (sortBy === 'streak') return b.currentStreak - a.currentStreak;
      if (sortBy === 'name') return a.text.localeCompare(b.text);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });
  };

  const calculateDailyProgress = () => {
    const activeHabits = habits.filter((h) => !h.isArchived);
    if (activeHabits.length === 0) return 0;
    const completed = activeHabits.filter((h) => h.done).length;
    return Math.round((completed / activeHabits.length) * 100);
  };

  const filteredHabits = getFilteredAndSortedHabits();
  const progress = calculateDailyProgress();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <ToastContainer toasts={toasts} />

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
        initialData={editingHabit}
        mode={editingHabit ? 'edit' : 'create'}
        isLoading={isSaving}
      />

      <div className="container mx-auto px-6 pt-32">
        {/* Header & Progress */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="w-full md:w-auto">
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center gap-3">
              Your Habits <span className="text-sm bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-slate-700">{filteredHabits.length}</span>
            </h1>
            <p className="text-slate-400">
              "{MOTIVATIONAL_QUOTES[quoteIndex].text}" — <span className="text-slate-500 font-medium">{MOTIVATIONAL_QUOTES[quoteIndex].author}</span>
            </p>
          </div>

          <div className="w-full md:w-96 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 transition-transform group-hover:scale-110" />
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-2">
                <span className="text-slate-400 font-bold text-sm uppercase tracking-wider">Daily Progress</span>
                <span className="text-3xl font-black text-white">{progress}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-1000 ease-out relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls & Filters */}
        <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0">
            {/* Filter */}
            <div className="flex items-center bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50">
              {['active', 'all', 'archived'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${filter === f
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700/50">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider px-3"><Filter size={14} className="inline mr-1" /> Sort</span>
              {['streak', 'name', 'category'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s as any)}
                  className={`px-3 py-2 rounded-xl text-sm font-bold capitalize transition-all whitespace-nowrap ${sortBy === s
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto">
            <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <List size={18} />
              </button>
            </div>

            <button
              onClick={openCreateModal}
              className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 shadow-xl shadow-white/5"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">New Habit</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Habits Grid/List */}
        {filteredHabits.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Archive size={32} className="text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No habits found</h3>
            <p className="text-slate-400">
              {filter === 'active' ? "You don't have any active habits. Time to start something new!" : "No habits match this filter."}
            </p>
            {filter === 'active' && (
              <button onClick={openCreateModal} className="mt-6 text-violet-400 font-bold hover:text-violet-300 transition-colors">
                + Create your first habit
              </button>
            )}
          </div>
        ) : (
          <div className={`
                ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}
            `}>
            {filteredHabits.map((habit) => (
              <div
                key={habit.id}
                id={`habit-card-${habit.id}`}
                className={`
                            group relative bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800/60
                            ${habit.done ? 'bg-emerald-900/10 border-emerald-500/20' : ''}
                        `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => {
                    if (!isModalOpen) {
                      setSelectedHabit(habit);
                      setDetailsModalOpen(true);
                    }
                  }}>
                    <div className={`
                                    w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110
                                    ${habit.done ? 'bg-emerald-500/20 shadow-emerald-500/10' : 'bg-slate-700/50 shadow-black/20'}
                                `}>
                      {habit.icon}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg transition-colors ${habit.done ? 'text-emerald-400 line-through decoration-emerald-500/50' : 'text-white'}`}>
                        {habit.text}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                        <span className="px-2 py-0.5 rounded bg-slate-700/50 border border-slate-600/50">{habit.category}</span>
                        <span className="flex items-center gap-1 text-orange-400">
                          <Flame size={12} fill="currentColor" /> {habit.currentStreak}
                        </span>
                        {habit.frequency === 'weekly' && (
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/20">
                            {habit.daysOfWeek.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleHabitDone(habit.id)}
                    className={`
                                    w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2
                                    ${habit.done
                        ? 'bg-emerald-500 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30'
                        : 'bg-transparent border-slate-600 text-slate-600 hover:border-violet-500 hover:text-violet-500'
                      }
                                `}
                  >
                    <Check size={20} strokeWidth={3} />
                  </button>
                </div>

                {/* Additional Info / Footer */}
                {viewMode === 'list' && (
                  <div className="mt-2 pt-2 border-t border-slate-700/30 flex justify-between items-center text-sm text-slate-400">
                    <span>Completed {habit.completionHistory?.length || 0} times</span>
                  </div>
                )}

                {/* Hover Actions */}
                <div className="absolute top-4 right-16 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/80 backdrop-blur rounded-xl p-1 border border-slate-700/50">
                  <button
                    onClick={() => {
                      setSelectedHabit(habit);
                      setTipsModalOpen(true);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                    title="Tips"
                  >
                    <Lightbulb size={16} />
                  </button>
                  <button
                    onClick={() => openEditModal(habit)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title="Edit"
                  >
                    <Tag size={16} />
                  </button>
                  <button
                    onClick={() => toggleArchiveHabitById(habit.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    title={habit.isArchived ? "Restore" : "Archive"}
                  >
                    {habit.isArchived ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                  </button>
                  <button
                    onClick={() => openDeleteModal(habit.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={confirmDeleteHabit}
          title="Delete Habit?"
          message="Are you sure you want to delete this habit? All your progress and streak history for this habit will be permanently lost."
          itemName={habits.find(h => h.id === habitToDelete)?.text}
          isLoading={isSaving}
        />

        <HabitDetailsModal
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          habit={selectedHabit}
          onUpdate={(habitId, data) => {
            // Optimistic update local
            setHabits(prev => prev.map(h => h.id === habitId ? { ...h, ...data } : h));
            // Trigger server update
            setEditingHabit(habits.find(h => h.id === habitId) || null);
            handleUpdateHabit(data);
          }}
        />

        {selectedHabit && (
          <HabitTipsModal
            isOpen={tipsModalOpen}
            onClose={() => setTipsModalOpen(false)}
            category={selectedHabit.category}
            habitText={selectedHabit.text}
          />
        )}

        <StreakCelebrationModal
          isOpen={celebrationData.isOpen}
          onClose={() => setCelebrationData(prev => ({ ...prev, isOpen: false }))}
          streak={celebrationData.streak}
          habitName={celebrationData.habitName}
        />
      </div>

    </div >

  );
}
