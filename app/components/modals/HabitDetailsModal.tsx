'use client';

import { useState } from 'react';

interface Habit {
  id: string;
  text: string;
  icon: string;
  category: string;
  done: boolean;
  streak: number;
  history: Date[];
  notes: string;
}

interface HabitDetailsModalProps {
  habit: Habit;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (habit: Habit) => void;
}

export default function HabitDetailsModal({
  habit,
  isOpen,
  onClose,
  onUpdate,
}: HabitDetailsModalProps) {
  const [notes, setNotes] = useState(habit.notes);

  if (!isOpen) return null;

  const completionRate = habit.history.length > 0 
    ? Math.round((habit.history.filter((d: any) => {
        const date = new Date(d);
        const today = new Date();
        return date.toDateString() === today.toDateString();
      }).length / Math.max(1, habit.history.length)) * 100)
    : 0;

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ ...habit, notes });
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <span className="modal-icon">{habit.icon}</span>
            <h2>{habit.text}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="habit-stats-grid">
            <div className="stat-item">
              <span className="stat-label">Current Streak</span>
              <span className="stat-value">{habit.streak} days 🔥</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Category</span>
              <span className="stat-value">{habit.category}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Days</span>
              <span className="stat-value">{habit.history.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Completion</span>
              <span className="stat-value">{completionRate}%</span>
            </div>
          </div>

          <div className="habit-section">
            <label>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this habit..."
              className="habit-textarea"
            />
          </div>

          <div className="habit-section">
            <label>Recent Activity</label>
            <div className="activity-list">
              {habit.history.slice(-5).reverse().map((date: any, idx: number) => (
                <div key={idx} className="activity-item">
                  <span>✅</span>
                  <span>{new Date(date).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
