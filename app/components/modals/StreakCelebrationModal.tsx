'use client';

import { useEffect, useState } from 'react';

interface StreakCelebrationModalProps {
  streak: number;
  habitName: string;
  isOpen: boolean;
  onClose: () => void;
}

const STREAK_MILESTONES = {
  1: { emoji: '🌱', title: 'Getting Started', message: 'Great! You\'ve completed 1 day!' },
  7: { emoji: '🔥', title: 'One Week Warrior', message: 'Amazing! 7 days straight!' },
  30: { emoji: '⭐', title: 'Monthly Master', message: 'Incredible! 30 days of consistency!' },
  100: { emoji: '👑', title: 'Century Champion', message: 'Legendary! 100 days achieved!' },
  365: { emoji: '🏆', title: 'Year in the Making', message: 'You\'ve completed a full year!' },
};

export default function StreakCelebrationModal({
  streak,
  habitName,
  isOpen,
  onClose,
}: StreakCelebrationModalProps) {
  const [celebration, setCelebration] = useState<any>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimate(true);
      // Find the highest milestone reached
      const milestones = Object.keys(STREAK_MILESTONES)
        .map(Number)
        .sort((a, b) => b - a);
      
      for (const milestone of milestones) {
        if (streak >= milestone) {
          setCelebration((STREAK_MILESTONES as any)[milestone]);
          break;
        }
      }
    }
  }, [isOpen, streak]);

  if (!isOpen || !celebration) return null;

  return (
    <div className="modal-overlay celebration-overlay" onClick={onClose}>
      <div 
        className={`modal-content celebration-modal ${animate ? 'animate-pop' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="celebration-content">
          <div className="celebration-emoji">{celebration.emoji}</div>
          <h2 className="celebration-title">{celebration.title}</h2>
          <p className="celebration-message">{celebration.message}</p>
          
          <div className="streak-display">
            <div className="streak-circle">
              <span className="streak-number">{streak}</span>
              <span className="streak-label">Day Streak</span>
            </div>
          </div>

          <p className="habit-name-celebration">
            "{habitName}" 🎯
          </p>

          <div className="confetti">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="confetti-piece" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
              } as React.CSSProperties} />
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary btn-lg" onClick={onClose}>
            Keep Going! 💪
          </button>
        </div>
      </div>
    </div>
  );
}
