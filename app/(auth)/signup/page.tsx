'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCurrentUser } from '@/lib/auth';
import { useToast } from '@/app/components/shared/Toast';
import ToastContainer from '@/app/components/shared/Toast';
import { signupUser } from '@/app/actions/userActions';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get('plan') || 'free';
  const { toasts, showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!name || !email || !password || !confirmPassword) {
        showToast({ message: 'Please fill in all fields', type: 'error' });
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        showToast({ message: 'Passwords do not match', type: 'error' });
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        showToast({ message: 'Password must be at least 6 characters', type: 'error' });
        setIsLoading(false);
        return;
      }

      if (!agreeToTerms) {
        showToast({ message: 'Please agree to the terms and conditions', type: 'error' });
        setIsLoading(false);
        return;
      }

      // Call server action to create user
      const result = await signupUser({ email, password, name });

      if (!result.success || !result.data) {
        showToast({ message: result.error || 'Signup failed', type: 'error' });
        setIsLoading(false);
        return;
      }

      const user = result.data;

      // Store user session in localStorage
      setCurrentUser(user);

      showToast({ message: `Welcome, ${user.name}!`, type: 'success' });

      setTimeout(() => {
        router.push(selectedPlan === 'free' ? '/dashboard' : `/upgrade?plan=${selectedPlan}`);
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer toasts={toasts} />
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
        </div>

        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl relative z-10">

          {/* Form Section */}
          <div className="p-10 md:p-14 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="text-3xl font-black text-white mb-2">Create Your Account</h1>
              <p className="text-slate-400">Join Zenith Habitz and start building better habits</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-bold text-slate-300">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <label htmlFor="confirm-password" className="text-sm font-bold text-slate-300">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all outline-none"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-start gap-3 py-2">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  disabled={isLoading}
                  className="mt-1 w-4 h-4 rounded border-slate-700 bg-slate-900/50 text-violet-500 focus:ring-violet-500"
                />
                <label htmlFor="terms" className="text-sm text-slate-400 leading-tight">
                  I agree to the{' '}
                  <Link href="/terms" className="text-violet-400 hover:text-white transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-violet-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all hover:shadow-lg hover:shadow-violet-500/25 active:scale-95 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-8 text-center space-y-2 text-sm">
              <p className="text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-violet-400 font-bold hover:text-violet-300 transition-colors">
                  Sign in
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
          <div className="hidden md:flex bg-gradient-to-bl from-violet-900 to-indigo-900 p-12 text-center text-white flex-col justify-center items-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
            <div className="relative z-10 glass-panel p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 max-w-xs -rotate-2">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold mb-2">Level Up Your Life</h2>
              <p className="text-indigo-100/80">Start your journey with {selectedPlan.toUpperCase()} plan</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function SignupPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignupContent />
      </Suspense>
    </div>
  );
}
