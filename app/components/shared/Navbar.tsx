'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Rocket, LogOut } from 'lucide-react';
import { getCurrentUser, type User } from '@/lib/auth';

import LogoutModal from '@/app/components/shared/LogoutModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check auth state
    const currentUser = getCurrentUser();
    setUser(currentUser);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const confirmLogout = () => {
    localStorage.removeItem('habit_tracker_session');
    setUser(null);
    setIsLogoutModalOpen(false);
    router.push('/');
    router.refresh();
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const guestLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ];

  const authLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Habits', href: '/habits' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'Achievements', href: '/achievements' },
    { name: 'Settings', href: '/settings' },
    { name: 'About', href: '/about' },
    { name: 'FAQ', href: '/faq' },
  ];

  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/habits') || pathname?.startsWith('/analytics') || pathname?.startsWith('/settings');

  return (
    <>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-50 border-b-2 border-white/5 transition-all duration-300 ${isScrolled || isMobileMenuOpen || isDashboard
          ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/5 py-4'
          : 'bg-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all group-hover:scale-110">
                🚀
              </div>
              <span className="text-xl font-black text-white tracking-tight group-hover:text-violet-200 transition-colors">
                Habit Tracker
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {(user ? authLinks : guestLinks).map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`text-sm font-bold transition-colors uppercase tracking-wide ${pathname === link.href
                      ? 'text-white'
                      : 'text-slate-300 hover:text-white'
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                {user ? (
                  <>
                    <div className="flex flex-col items-end leading-none">
                      <span className="text-sm font-bold text-white mb-1">{user.name}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${user.subscription === 'premium' ? 'bg-amber-500/20 text-amber-300' :
                        user.subscription === 'pro' ? 'bg-cyan-500/20 text-cyan-300' :
                          'bg-slate-700 text-slate-300'
                        }`}>
                        {user.subscription || 'FREE'}
                      </span>
                    </div>
                    <button
                      onClick={handleLogoutClick}
                      className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                      title="Log Out"
                    >
                      <LogOut size={20} />
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="text-sm font-bold text-white hover:text-violet-300 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="px-5 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-200 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                      Get Started <Rocket size={16} className="text-violet-600" />
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 p-6 space-y-4 animate-fade-in shadow-2xl">
              {(user ? authLinks : guestLinks).map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block text-lg font-bold ${pathname === link.href ? 'text-white' : 'text-slate-300 hover:text-white'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-4" />

              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
                    <div>
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-xs text-slate-400 uppercase">{user.subscription || 'Free Plan'}</div>
                    </div>
                    <button
                      onClick={() => {
                        handleLogoutClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="p-2 text-slate-400 hover:text-white"
                    >
                      <LogOut size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="block w-full py-3 rounded-xl bg-slate-800 text-center text-white font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block w-full py-3 rounded-xl bg-white text-center text-slate-900 font-bold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
