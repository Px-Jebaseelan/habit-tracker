'use client';

import { useState } from 'react';

interface ShareAchievementModalProps {
  achievement: string;
  description: string;
  icon: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShareAchievementModal({
  achievement,
  description,
  icon,
  isOpen,
  onClose,
}: ShareAchievementModalProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just unlocked "${achievement}" on Zenith Habitz! 🎉 ${description} Join me in building better habits! 💪`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🎉 Share Your Achievement</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="achievement-preview">
            <div className="achievement-icon">{icon}</div>
            <h3>{achievement}</h3>
            <p>{description}</p>
          </div>

          <div className="share-text-box">
            <p className="share-label">Share this:</p>
            <div className="share-text">{shareText}</div>
          </div>

          <div className="share-options">
            <button className="btn-social-share" onClick={handleShareX}>
              <span>𝕏</span> Share on X
            </button>
            <button 
              className={`btn-social-share ${copied ? 'copied' : ''}`}
              onClick={handleCopyLink}
            >
              <span>{copied ? '✓' : '📋'}</span> {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
