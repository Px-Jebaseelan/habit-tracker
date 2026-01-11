'use client';

import { useState } from 'react';

const FAQ_ITEMS = [
  {
    question: 'What is Zenith Habitz?',
    answer: 'Zenith Habitz is a powerful habit tracking app designed to help you build positive habits and reach your goals. With features like streaks, analytics, and community support, you can stay motivated and accountable.',
  },
  {
    question: 'How do I start tracking a habit?',
    answer: 'Simply go to the Habits page and click "Add Habit". Give it a name, choose a category, select an emoji, and set how often you want to do it. Then mark it complete each day!',
  },
  {
    question: 'What does a streak mean?',
    answer: 'A streak is the number of consecutive days you\'ve completed a habit. The longer your streak, the more motivated you become! Try not to miss a day.',
  },
  {
    question: 'What are achievement badges?',
    answer: 'Badges are rewards you unlock by reaching milestones. Unlock them by maintaining streaks, completing habits across categories, and reaching higher levels.',
  },
  {
    question: 'How do points and levels work?',
    answer: 'You earn points for each habit completed. Every 10 points gets you 1 level. Higher levels unlock more features and badges. Current max level is 10.',
  },
  {
    question: 'Can I export my data?',
    answer: 'Yes! Go to Settings and click "Export Data". Your habits and progress will be downloaded as a JSON file that you can backup or analyze.',
  },
  {
    question: 'What\'s the difference between plans?',
    answer: 'Free: 5 habits, basic tracking. Pro: 100 habits, advanced analytics. Premium: Unlimited habits, priority support, team collaboration.',
  },
  {
    question: 'Is my data private?',
    answer: 'Absolutely! Your data is encrypted and stored securely. We never share your information. You can delete all data anytime from Settings.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'Go to Settings → Billing and click "Manage Subscription". You can cancel anytime. Your data remains accessible on the Free plan.',
  },
  {
    question: 'Why didn\'t my habit save?',
    answer: 'Make sure you\'re connected to the internet and that you\'re logged in. If issues persist, try refreshing the page or clearing your browser cache.',
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>❓ Frequently Asked Questions</h1>
          <p>Get answers to common questions about Zenith Habitz</p>
        </div>
      </div>

      <div className="faq-container">
        <div className="faq-search">
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            className="faq-search-input"
          />
        </div>

        <div className="faq-list">
          {FAQ_ITEMS.map((item, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button 
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{item.question}</span>
                <span className="faq-icon">{openIndex === index ? '−' : '+'}</span>
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h2>Didn't find what you're looking for?</h2>
          <p>Still have questions? Get in touch with our support team.</p>
          <button className="btn-primary">Contact Support</button>
        </div>
      </div>
    </div>
  );
}
