'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { setCurrentUser, getCurrentUser } from '@/lib/auth';
import { useToast } from '@/app/components/shared/Toast';
import ToastContainer from '@/app/components/shared/Toast';
import { loginUser } from '@/app/actions/userActions';

export default function LoginPage() {
  const router = useRouter();
  const { toasts, showToast } = useToast();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      router.push('/dashboard');
    }
  }, [router]);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        showToast({ message: 'Please fill in all fields', type: 'error' });
        setIsLoading(false);
        return;
      }

      // Call server action to login
      const result = await loginUser({ email, password });

      if (!result.success || !result.data) {
        showToast({ message: result.error || 'Login failed', type: 'error' });
        setIsLoading(false);
        return;
      }

      const user = result.data;

      // Store user session in localStorage
      setCurrentUser(user);

      showToast({ message: `Welcome back, ${user.name}!`, type: 'success' });
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <ToastContainer toasts={toasts} />

      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative z-10">

        {/* Form Section */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400">Sign in to your Zenith Habitz account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-bold text-slate-300">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-bold text-slate-300">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all hover:shadow-lg hover:shadow-violet-500/25 active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 text-center space-y-2 text-sm">
            <p className="text-slate-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
                Sign up for free
              </Link>
            </p>
            <p>
              <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors">
                Back to home
              </Link>
            </p>
          </div>
        </div>

        {/* Visual Section */}
        <div className="hidden md:flex bg-gradient-to-br from-violet-600 to-indigo-900 p-12 text-center text-white flex-col justify-center items-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
          <div className="relative z-10 glass-panel p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 max-w-xs rotate-3">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold mb-2">Build Better Habits</h2>
            <p className="text-indigo-100/80">Join thousands tracking their daily progress with Zenith Habitz</p>
          </div>
        </div>
      </div>
    </div>
  );
}
