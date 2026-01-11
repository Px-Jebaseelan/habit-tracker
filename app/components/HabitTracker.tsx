'use client';

import { useEffect, useRef, useState } from 'react';

const DEFAULTS = {
  HABIT: {
    icon: '',
    category: '',
    reminderTime: null,
    frequency: 'daily',
    daysOfWeek: [],
    timesPerWeekGoal: 0,
    completionsThisWeek: 0,
    weekStartDate: null,
    lastCompletedDate: null,
    currentStreak: 0,
    completionHistory: [],
    isEditing: false,
    isArchived: false,
    notes: {},
  },
  SUGGESTED_HABITS: [
    { text: 'Drink 8 glasses of water', category: 'Health', icon: '💧' },
    { text: 'Go for a 20-minute walk', category: 'Fitness', icon: '🚶' },
    { text: 'Read 10 pages of a book', category: 'Learning', icon: '📖' },
    { text: 'Meditate for 5 minutes', category: 'Mindfulness', icon: '🧘' },
    { text: 'Get 15 mins morning sunlight', category: 'Wellbeing', icon: '☀️' },
    { text: 'No screens 1hr before bed', category: 'Sleep', icon: '📵' },
    { text: 'List 1 thing grateful for', category: 'Mindfulness', icon: '😊' },
    { text: 'Tidy up one space for 10 mins', category: 'Home', icon: '🧹' },
    { text: 'Learn a new word/concept', category: 'Learning', icon: '🌱' },
    { text: "Plan tomorrow's top 3 tasks", category: 'Productivity', icon: '📝' },
    { text: 'Stretching for 10 minutes', category: 'Fitness', icon: '🤸' },
    { text: 'Call a friend or family member', category: 'Social', icon: '📞' },
  ],
  MOTIVATIONAL_QUOTES: [
    {
      text: 'The discipline of writing something down is the first step toward making it happen.',
      author: 'Lee Iacocca',
    },
    { text: 'Excellence is not an act, but a habit.', author: 'Aristotle (Will Durant)' },
    {
      text: 'Motivation gets you going, but discipline keeps you growing.',
      author: 'John C. Maxwell',
    },
    {
      text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.',
      author: 'Will Durant',
    },
    {
      text: 'The chains of habit are too light to be felt until they are too heavy to be broken.',
      author: 'Warren Buffett',
    },
  ],
  POINTS: { COMPLETION: 10, STREAK_3: 5, STREAK_7: 15, STREAK_30: 50 },
  LEVEL_THRESHOLDS: [0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000],
};

export default function HabitTracker() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [habitz, setHabitz] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState({ points: 0, level: 1 });
  const [currentDate, setCurrentDate] = useState('');
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  const [isViewingArchived, setIsViewingArchived] = useState(false);
  const [suggestedHabits, setSuggestedHabits] = useState<any[]>([]);
  const [toasts, setToasts] = useState<any[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [currentEditingNoteHabitId, setCurrentEditingNoteHabitId] = useState<string | null>(null);
  
  // Form refs
  const habitInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const LOCAL_STORAGE_KEYS = {
    HABITS: 'zenithHabitzData_FullV1_Final',
    PROFILE: 'zenithUserProfile_FullV1_Final',
    THEME: 'zenithTheme_FullV1_Final',
  };

  // Utility functions
  const generateId = () => '_' + Math.random().toString(36).substr(2, 9);
  
  const getCurrentDateISO = () => new Date().toLocaleDateString('sv-SE');
  
  const getStartOfWeek = (date = new Date()) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff)).toLocaleDateString('sv-SE');
  };

  // Initialize
  useEffect(() => {
    setMounted(true);
    loadTheme();
    loadState();
    displayDate();
    displayRandomQuote();
    populateSuggestedHabits();
  }, []);

  // Theme Management
  const loadTheme = () => {
    const savedTheme = (localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  };

  const applyTheme = (newTheme: 'dark' | 'light') => {
    if (typeof document !== 'undefined') {
      if (newTheme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
      localStorage.setItem(LOCAL_STORAGE_KEYS.THEME, newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  // State Management
  const loadState = () => {
    const storedHabitz = localStorage.getItem(LOCAL_STORAGE_KEYS.HABITS);
    if (storedHabitz) {
      setHabitz(JSON.parse(storedHabitz).map((h: any) => ({ ...DEFAULTS.HABIT, ...h })));
    }

    const storedProfile = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILE);
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      setUserProfile({ points: 0, level: 1 });
    }
  };

  const saveState = () => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.HABITS, JSON.stringify(habitz));
    localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  };

  // UI Updates
  const displayDate = () => {
    const now = new Date();
    const formatted = now.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(formatted);
  };

  const displayRandomQuote = () => {
    const randomQuote =
      DEFAULTS.MOTIVATIONAL_QUOTES[Math.floor(Math.random() * DEFAULTS.MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);
  };

  const showToast = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const populateSuggestedHabits = () => {
    const shuffled = [...DEFAULTS.SUGGESTED_HABITS].sort(() => 0.5 - Math.random());
    setSuggestedHabits(shuffled.slice(0, 4));
  };

  // Habit Operations
  const addHabit = (text: string, icon: string, category: string, reminderTime: string | null, frequency: string) => {
    if (!text.trim()) {
      showToast('Habit cannot be empty!', 'error');
      return;
    }

    const newHabit = {
      id: generateId(),
      text,
      ...DEFAULTS.HABIT,
      icon,
      category,
      reminderTime,
      frequency,
      weekStartDate: getStartOfWeek(),
    };

    const updatedHabitz = [newHabit, ...habitz];
    setHabitz(updatedHabitz);
    localStorage.setItem(LOCAL_STORAGE_KEYS.HABITS, JSON.stringify(updatedHabitz));
    showToast('Habit added! ✨', 'success');
    
    // Clear form
    if (habitInputRef.current) habitInputRef.current.value = '';
    if (iconInputRef.current) iconInputRef.current.value = '';
  };

  const handleAddHabitSubmit = () => {
    const text = habitInputRef.current?.value || '';
    const icon = iconInputRef.current?.value || '📌';
    addHabit(text, icon, '', null, 'daily');
  };

  const handleAddSuggestedHabit = (suggested: any) => {
    addHabit(suggested.text, suggested.icon, suggested.category, null, 'daily');
  };

  // Calculate daily progress
  const calculateDailyProgress = () => {
    if (habitz.length === 0) return 0;
    const completed = habitz.filter((h) => h.done && !h.isArchived).length;
    return Math.round((completed / habitz.filter((h) => !h.isArchived).length) * 100);
  };

  // Filter habits for display
  const getFilteredHabits = () => {
    let filtered = habitz;
    
    if (!isViewingArchived) {
      filtered = filtered.filter((h) => !h.isArchived);
    } else {
      filtered = filtered.filter((h) => h.isArchived);
    }

    if (activeCategoryFilter !== 'all' && activeCategoryFilter) {
      filtered = filtered.filter((h) => h.category === activeCategoryFilter);
    }

    return filtered;
  };

  const toggleHabitDone = (habitId: string) => {
    const updated = habitz.map((h) => {
      if (h.id !== habitId) return h;

      const todayISO = getCurrentDateISO();
      const toggledToDone = !(h.done && (h.frequency !== 'weekly_x_times' || h.lastCompletedDate === todayISO));

      if (toggledToDone) {
        h.lastCompletedDate = todayISO;
        if (!h.completionHistory.includes(todayISO)) h.completionHistory.push(todayISO);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayISO = yesterday.toLocaleDateString('sv-SE');
        if (h.completionHistory.includes(yesterdayISO)) {
          h.currentStreak = (h.currentStreak || 0) + 1;
        } else {
          h.currentStreak = 1;
        }

        awardPoints(h, true);
        showToast(`"${h.text.substring(0, 20)}..." marked done!`, 'info');
      } else {
        h.completionHistory = h.completionHistory.filter((d: string) => d !== todayISO);
        h.done = false;
      }

      h.done = toggledToDone;
      return h;
    });

    setHabitz(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.HABITS, JSON.stringify(updated));
  };

  const deleteHabit = (habitId: string) => {
    const updated = habitz.filter((h) => h.id !== habitId);
    setHabitz(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.HABITS, JSON.stringify(updated));
    showToast('Habit deleted.', 'info');
  };

  const toggleArchiveHabit = (habitId: string) => {
    const updated = habitz.map((h) => {
      if (h.id === habitId) {
        h.isArchived = !h.isArchived;
        showToast(h.isArchived ? `"${h.text}" archived.` : `"${h.text}" restored.`, 'info');
      }
      return h;
    });
    setHabitz(updated);
    localStorage.setItem(LOCAL_STORAGE_KEYS.HABITS, JSON.stringify(updated));
  };

  const awardPoints = (habit: any, wasCompletion: boolean) => {
    if (wasCompletion) {
      let points = DEFAULTS.POINTS.COMPLETION;
      if (habit.currentStreak === 3) points += DEFAULTS.POINTS.STREAK_3;
      if (habit.currentStreak === 7) points += DEFAULTS.POINTS.STREAK_7;
      if (habit.currentStreak === 30) points += DEFAULTS.POINTS.STREAK_30;

      const newProfile = {
        ...userProfile,
        points: userProfile.points + points,
      };

      const nextLevelThreshold = DEFAULTS.LEVEL_THRESHOLDS[newProfile.level];
      if (nextLevelThreshold !== undefined && newProfile.points >= nextLevelThreshold) {
        newProfile.level++;
        showToast(`🎉 Level Up! You reached Level ${newProfile.level}! 🎉`, 'success');
      }

      setUserProfile(newProfile);
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    }
  };

  // Render
  if (!mounted) {
    return null;
  }

  return (
    <div className="container-zenith">
      <div className="celebration-container" id="celebration-container"></div>

      {/* Header */}
      <header className="header-wrapper">
        <div className="header-main">
          <h1 className="header-title">Zenith Habitz</h1>
          <p className="header-subtitle">Elevate your day, one micro-step at a time.</p>
          <p className="header-date">{currentDate}</p>
        </div>
        <div className="header-controls">
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <div className="user-stats">
            <span className="user-points">Points: {userProfile.points} ✨</span>
            <span className="user-level">Level: {userProfile.level} 🚀</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full">
        {/* Input Section */}
        <div className="input-section">
          <div className="input-row">
            <div className="flex-1">
              <label htmlFor="habit-input" className="input-label">
                New Habit:
              </label>
              <input
                type="text"
                id="habit-input"
                ref={habitInputRef}
                placeholder="e.g., Plan tomorrow's tasks"
                className="input-field"
                onKeyDown={(e) => e.key === 'Enter' && handleAddHabitSubmit()}
              />
            </div>
            <div className="w-20">
              <label htmlFor="habit-icon-input" className="input-label">
                Icon:
              </label>
              <input
                type="text"
                id="habit-icon-input"
                ref={iconInputRef}
                placeholder="💧"
                maxLength={2}
                defaultValue="📌"
                className="input-field input-field-sm"
              />
            </div>
          </div>

          <button onClick={handleAddHabitSubmit} className="btn-primary">Add Habit 🚀</button>
        </div>

        {/* Suggested Habits */}
        <div className="suggested-habits-section">
          <h3 className="suggested-habits-title">✨ Quick Add Suggestions ✨</h3>
          <div className="suggested-habits-grid">
            {suggestedHabits.map((habit) => (
              <button key={habit.text} onClick={() => handleAddSuggestedHabit(habit)} className="btn-suggested">
                {habit.icon} {habit.text}
              </button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="progress-section">
          <p className="progress-text">Daily Progress: {calculateDailyProgress()}%</p>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${calculateDailyProgress()}%` }}></div>
          </div>
        </div>

        {/* Habit List */}
        <div className="habit-list scrollbar-custom">
          <ul id="habit-list" className="list-none">
            {getFilteredHabits().length === 0 && (
              <div className="empty-state">
                <span className="empty-state-emoji">🌟</span>
                <p>No habitz to show. {isViewingArchived ? 'Archive some habits!' : 'Add some to begin!'}</p>
              </div>
            )}
            {getFilteredHabits().map((habit) => (
              <li
                key={habit.id}
                className={`habit-item ${habit.done ? 'done' : ''} ${habit.isArchived ? 'is-archived' : ''}`}
              >
                <div className="habit-main-content">
                  <label className="habit-checkbox-container">
                    <input
                      type="checkbox"
                      checked={habit.done || false}
                      onChange={() => toggleHabitDone(habit.id)}
                      disabled={habit.isArchived}
                      className="habit-checkbox-input"
                    />
                    <span className="habit-checkmark"></span>
                  </label>
                  <span className="habit-icon">{habit.icon}</span>
                  <div className="habit-details">
                    <span className="habit-text">{habit.text}</span>
                    <div className="habit-meta">
                      {habit.category && <span className="habit-category">{habit.category}</span>}
                      {habit.currentStreak > 0 && <span className="habit-category">🔥 {habit.currentStreak}</span>}
                    </div>
                  </div>
                  <div className="habit-actions">
                    <button
                      onClick={() => toggleArchiveHabit(habit.id)}
                      className="habit-action-btn archive-btn"
                      title={habit.isArchived ? 'Restore' : 'Archive'}
                    >
                      {habit.isArchived ? '✅' : '📥'}
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="habit-action-btn delete-btn"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Quote */}
        <div className="quote-section">
          <p className="quote-text">"{quote.text}"</p>
          <span className="quote-author">- {quote.author}</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>
          Developed with <span className="footer-heart">❤️</span> By Jeba Seelan
        </span>
      </footer>

      {/* Toasts */}
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type} show`}>
          {toast.message}
        </div>
      ))}
    </div>
  );
}
