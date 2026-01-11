# Habit Tracker 🚀

A modern, full-featured habit tracking application built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **MongoDB**. This application offers a premium, glassmorphic user interface and a robust backend for tracking habits, visualizing analytics, and managing user progress.

![Dashboard Preview](public/dashboard-preview.png)
*(Note: Replace with actual screenshot)*

## ✨ Features

- **🛡️ Authentication**: Secure Email/Password login and signup via Server Actions.
- **📊 Real-time Dashboard**: Interactive dashboard with daily progress, streaks, and quick stats.
- **✅ Habit Management**: Create, track, archive, and delete habits with optimistic UI updates.
- **📈 Advanced Analytics**: Visual charts (Weekly Activity, Completion Rates) powered by Recharts.
- **📅 Interactive Calendar**: GitHub-style consistency calendar to visualize your habit history.
- **🏆 Gamification**: Earn XP, level up, and unlock achievements (badges) for consistency.
- **💎 Premium Design**: Fully responsive, dark-mode first UI with glassmorphism effects and smooth animations.
- **⚙️ Settings & Data**: Manage profile, subscription plans, and export your entire data history.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Animations
- **Database**: MongoDB (via Mongoose)
- **Icons**: Lucide React
- **Charts**: Recharts
- **State Management**: React Hooks + Server Actions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Database (Local or Atlas)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/habit-tracker.git
    cd habit-tracker
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root directory:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit `http://localhost:3000` in your browser.

## 📂 Project Structure

```
├── app/
│   ├── actions/       # Server Actions for DB mutations
│   ├── (auth)/        # Login/Signup routes
│   ├── (dashboard)/   # Protected dashboard routes (Habits, Analytics, etc.)
│   ├── components/    # Reusable UI components
│   └── api/           # API routes (if any legacy)
├── lib/
│   ├── models/        # Mongoose data models
│   ├── db.ts          # Database connection logic
│   └── auth.ts        # Session utilities
└── public/            # Static assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
