import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard - Zenith Habitz',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
      <main className="container mx-auto px-6 pt-32 pb-12">
        {children}
      </main>
    </div>
  );
}
