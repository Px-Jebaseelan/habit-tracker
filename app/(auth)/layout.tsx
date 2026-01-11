import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - Habit Tracker',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
