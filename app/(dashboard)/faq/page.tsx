'use client';

import { useState } from 'react';
import { Search, Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = FAQ_ITEMS.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      <div className="container mx-auto px-6 pt-32">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-600/20 text-violet-400 mb-6 ring-1 ring-violet-500/50 shadow-lg shadow-violet-500/20">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Questions</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about Zenith Habitz. Can't find the answer you're looking for? Reach out to our support team.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-16 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
            <Search size={24} />
          </div>
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white pl-14 pr-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all text-lg placeholder:text-slate-500 shadow-xl"
          />
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No matches found for "{searchQuery}"</p>
            </div>
          ) : (
            filteredFAQs.map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                  ? 'bg-slate-800/80 border-violet-500/50 shadow-lg shadow-violet-500/10'
                  : 'bg-slate-800/30 border-white/5 hover:border-white/10 hover:bg-slate-800/50'
                  }`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className={`text-lg font-bold pr-8 transition-colors ${openIndex === index ? 'text-white' : 'text-slate-200'}`}>
                    {item.question}
                  </span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === index ? 'bg-violet-500 text-white rotate-180' : 'bg-slate-700 text-slate-400'}`}>
                    {openIndex === index ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>
                <div
                  className={`px-6 text-slate-400 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="pt-2 border-t border-white/5">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact CTA */}
        <div className="max-w-3xl mx-auto mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-violet-900/50 to-indigo-900/50 border border-violet-500/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-white mb-6 backdrop-blur-sm">
              <MessageCircle size={24} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <button className="px-8 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg">
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
