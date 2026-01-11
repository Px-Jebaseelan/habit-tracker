'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [habitz, setHabitz] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState({ points: 0, level: 1 });
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setMounted(true);
    loadTheme();
    loadState();
    displayDate();
  }, []);

  const loadTheme = () => {
    const savedTheme = localStorage.getItem('zenithTheme_FullV1_Final') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'dark';
    setTheme(initialTheme);
    applyTheme(initialTheme);
  };

  const applyTheme = (newTheme: 'dark' | 'light') => {
    if (typeof document !== 'undefined') {
      if (newTheme === 'light') {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }
      localStorage.setItem('zenithTheme_FullV1_Final', newTheme);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const loadState = () => {
    const storedHabitz = localStorage.getItem('zenithHabitzData_FullV1_Final');
    if (storedHabitz) {
      setHabitz(JSON.parse(storedHabitz));
    }

    const storedProfile = localStorage.getItem('zenithUserProfile_FullV1_Final');
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    }
  };

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
                placeholder="e.g., Plan tomorrow's tasks"
                className="input-field"
                aria-label="New habit text"
              />
            </div>
            <div className="w-20">
              <label htmlFor="habit-icon-input" className="input-label">
                Icon:
              </label>
              <input
                type="text"
                id="habit-icon-input"
                placeholder="💧"
                maxLength={2}
                className="input-field input-field-sm"
                aria-label="Habit icon or emoji"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="flex-1">
              <label htmlFor="habit-category-input" className="input-label">
                Category (optional):
              </label>
              <input
                type="text"
                id="habit-category-input"
                list="category-datalist"
                placeholder="e.g., Health, Work"
                className="input-field"
              />
              <datalist id="category-datalist"></datalist>
            </div>
            <div className="flex-1">
              <label htmlFor="habit-reminder-input" className="input-label">
                Reminder Time (optional):
              </label>
              <input
                type="time"
                id="habit-reminder-input"
                className="input-field"
                aria-label="Habit reminder time"
              />
            </div>
          </div>

          <label className="block text-sm font-medium text-dark-text-muted mb-2">
            Frequency:
          </label>
          <div className="input-row gap-2 mb-4">
            <label className="frequency-option">
              <input type="radio" name="frequency" value="daily" defaultChecked />
              Daily
            </label>
            <label className="frequency-option">
              <input type="radio" name="frequency" value="specific_days" />
              Specific Days
            </label>
            <label className="frequency-option">
              <input type="radio" name="frequency" value="weekly_x_times" />
              X Times a Week
            </label>
          </div>

          <div id="specific-days-config" className="input-row hidden">
            <label className="text-sm">Select Days:</label>
            <div className="flex gap-1 flex-wrap">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                <label key={day} className="checkbox-option text-xs">
                  <input type="checkbox" name="specificDay" value={idx === 6 ? '0' : `${idx + 1}`} />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div id="weekly-x-times-config" className="input-row hidden">
            <label htmlFor="times-per-week-input" className="text-sm">
              Times per week:
            </label>
            <input
              type="number"
              id="times-per-week-input"
              min="1"
              max="7"
              defaultValue="3"
              className="input-field-sm"
            />
          </div>

          <button id="add-habit-btn" className="btn-primary">
            Add Habit 🚀
          </button>
        </div>

        {/* Suggested Habits */}
        <div className="suggested-habits-section">
          <h3 className="suggested-habits-title">✨ Quick Add Suggestions ✨</h3>
          <div id="suggested-habits-grid" className="suggested-habits-grid">
            {/* Will be populated by JS */}
          </div>
        </div>

        {/* Filters */}
        <div className="filters-wrapper">
          <div>
            <label htmlFor="category-filter" className="filter-label">
              Filter by Category:
            </label>
            <select id="category-filter" className="filter-select">
              <option value="all">All Categories</option>
            </select>
          </div>
          <div className="flex gap-2.5 flex-wrap">
            <button id="focus-mode-btn" className="btn-action text-xs py-2 px-3">
              🎯 Focus Mode: OFF
            </button>
            <button id="view-archived-btn" className="btn-action text-xs py-2 px-3">
              🗄️ View Archived (0)
            </button>
            <button id="request-notification-permission-btn" className="btn-action text-xs py-2 px-3">
              🔔 Enable Reminders
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="progress-section">
          <p id="progress-text" className="progress-text" aria-live="polite">
            Daily Progress: 0%
          </p>
          <div className="progress-container">
            <div id="progress-bar" className="progress-bar"></div>
          </div>
        </div>

        {/* Habit List */}
        <div className="habit-list scrollbar-custom">
          <ul id="habit-list" className="list-none">
            {/* Will be populated by JS */}
          </ul>
        </div>

        {/* Actions */}
        <div className="actions-section">
          <button id="clear-all-btn" className="btn-action">
            Clear All Displayed
          </button>
          <button id="clear-completed-btn" className="btn-action btn-danger">
            Unmark Done (Today)
          </button>
          <button id="export-data-btn" className="btn-action btn-success">
            Export Data
          </button>
          <label htmlFor="import-data-input" id="import-data-label" className="btn-action btn-warning">
            Import Data
          </label>
          <input type="file" id="import-data-input" accept=".json" className="import-file-input" />
          <button id="share-progress-btn" className="btn-action">
            Share Today's Snapshot
          </button>
        </div>

        {/* Quote */}
        <div className="quote-section">
          <p id="quote-text" className="quote-text"></p>
          <span id="quote-author" className="quote-author"></span>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>
          Developed with{' '}
          <span className="footer-heart">❤️</span> By Jeba Seelan
        </span>
      </footer>

      {/* Modal */}
      <div id="note-modal" className="modal-backdrop">
        <div className="modal-content">
          <span id="note-modal-close-btn" className="modal-close">
            ×
          </span>
          <h3 id="note-modal-title" className="modal-title">
            Habit Note
          </h3>
          <textarea
            id="note-modal-textarea"
            placeholder="Add your reflections or details here..."
            className="modal-textarea"
          ></textarea>
          <button id="note-modal-save-btn" className="btn-primary">
            Save Note
          </button>
        </div>
      </div>

      {/* Initialize App Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Initialize app logic (JavaScript will be added here)
            // This is a placeholder for the habit tracker logic
          `,
        }}
      />
    </div>
  );
}
