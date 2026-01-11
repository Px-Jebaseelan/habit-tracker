import type { Metadata } from 'next';
import Navbar from '@/app/components/shared/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Habit Tracker',
  description:
    'Transform your life with Habit Tracker. Track, build, and master daily habits with gamification, analytics, and community support.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
