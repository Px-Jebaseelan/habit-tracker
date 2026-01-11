'use client';

import { useState } from 'react';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>💡 Tips for "{habitText}"</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="tips-container">
            {tips.map((tip, idx) => (
              <div key={idx} className="tip-item">
                <div className="tip-number">{idx + 1}</div>
                <p>{tip}</p>
              </div>
            ))}
          </div>

          <div className="tips-footer">
            <p className="tips-motivation">
              💪 Remember: Small consistent actions lead to big changes!
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Got it, Thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
