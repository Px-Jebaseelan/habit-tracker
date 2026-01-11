// Pricing Plans
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Perfect for getting started',
    features: [
      'Up to 5 habits',
      'Basic tracking',
      'Dark/Light theme',
      'Mobile responsive',
      'Community support',
    ],
    limitations: ['No analytics', 'No habit categories', 'No export data'],
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    period: 'month',
    description: 'For serious habit builders',
    features: [
      'Unlimited habits',
      'Advanced analytics',
      'Habit categories',
      'Priority support',
      'Export your data',
      'Custom reminders',
      'Habit templates',
    ],
    limitations: ['Team features', 'API access'],
  },
  premium: {
    name: 'Premium',
    price: 19.99,
    period: 'month',
    description: 'Complete habit mastery',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Advanced analytics',
      'API access',
      'Custom integrations',
      'Priority 24/7 support',
      'Annual reports',
      'Coaching community',
    ],
    limitations: [],
  },
};

// Feature Limits
export const FEATURE_LIMITS = {
  free: {
    maxHabits: 5,
    canExportData: false,
    hasAnalytics: false,
    hasCategories: false,
    hasReminders: false,
    hasTemplates: false,
    hasTeamCollab: false,
  },
  pro: {
    maxHabits: 100,
    canExportData: true,
    hasAnalytics: true,
    hasCategories: true,
    hasReminders: true,
    hasTemplates: true,
    hasTeamCollab: false,
  },
  premium: {
    maxHabits: Infinity,
    canExportData: true,
    hasAnalytics: true,
    hasCategories: true,
    hasReminders: true,
    hasTemplates: true,
    hasTeamCollab: true,
  },
};

// Points System
export const POINTS_SYSTEM = {
  COMPLETION: 10,
  STREAK_3: 5,
  STREAK_7: 15,
  STREAK_30: 50,
  STREAK_100: 150,
};

// Level Thresholds
export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 2000, 3500, 5000, 7500, 10000, 15000, 20000,
];

// Habit Categories
export const HABIT_CATEGORIES = [
  { name: 'Health', icon: '💚', color: '#20B2AA' },
  { name: 'Fitness', icon: '🏋️', color: '#FF6B6B' },
  { name: 'Learning', icon: '📖', color: '#4169E1' },
  { name: 'Mindfulness', icon: '🧘', color: '#FFD700' },
  { name: 'Productivity', icon: '📝', color: '#9370DB' },
  { name: 'Social', icon: '👥', color: '#FF69B4' },
  { name: 'Sleep', icon: '😴', color: '#6A0DAD' },
  { name: 'Nutrition', icon: '🥗', color: '#32CD32' },
  { name: 'Reading', icon: '📚', color: '#FF8C00' },
  { name: 'Creativity', icon: '🎨', color: '#1E90FF' },
];

// Suggested Habits
export const SUGGESTED_HABITS = [
  { text: 'Drink 8 glasses of water', category: 'Health', icon: '💧' },
  { text: 'Go for a 20-minute walk', category: 'Fitness', icon: '🚶' },
  { text: 'Read 10 pages of a book', category: 'Learning', icon: '📖' },
  { text: 'Meditate for 5 minutes', category: 'Mindfulness', icon: '🧘' },
  { text: 'Get 15 mins morning sunlight', category: 'Health', icon: '☀️' },
  { text: 'No screens 1hr before bed', category: 'Sleep', icon: '📵' },
  { text: 'List 1 thing grateful for', category: 'Mindfulness', icon: '😊' },
  { text: 'Tidy up one space for 10 mins', category: 'Productivity', icon: '🧹' },
  { text: 'Learn a new word/concept', category: 'Learning', icon: '🌱' },
  { text: "Plan tomorrow's top 3 tasks", category: 'Productivity', icon: '📝' },
  { text: 'Stretching for 10 minutes', category: 'Fitness', icon: '🤸' },
  { text: 'Call a friend or family member', category: 'Social', icon: '📞' },
];

// Motivational Quotes
export const MOTIVATIONAL_QUOTES = [
  { text: 'The discipline of writing something down is the first step toward making it happen.', author: 'Lee Iacocca' },
  { text: 'Excellence is not an act, but a habit.', author: 'Aristotle' },
  { text: 'Motivation gets you going, but discipline keeps you growing.', author: 'John C. Maxwell' },
  { text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Will Durant' },
  { text: 'The chains of habit are too light to be felt until they are too heavy to be broken.', author: 'Warren Buffett' },
  { text: 'Success is the product of daily habits—not once-in-a-lifetime transformations.', author: 'James Clear' },
  { text: 'You will never change your life until you change something you do daily.', author: 'John C. Maxwell' },
  { text: 'A man who conquers himself is greater than one who conquers a thousand men in battle.', author: 'Buddha' },
];
