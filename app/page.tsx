import Link from 'next/link';
import { PRICING_PLANS } from '@/lib/constants';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden selection:bg-violet-500/30">
      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[1.1] text-white text-center lg:text-left">
                Elevate Your Life,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                  One Habit at a Time
                </span>
              </h1>
              <p className="text-xl text-slate-400 max-w-lg leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
                Transform your life with Zenith Habitz. Track, build, and master daily habits with gamification, analytics, and community support.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/signup" className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-full shadow-lg shadow-violet-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  Start Free Trial 🚀
                </Link>
                <Link href="#pricing" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full border border-slate-700 transition-all hover:scale-105">
                  View Pricing
                </Link>
              </div>
              <div className="pt-8 flex flex-row items-center justify-center lg:justify-start gap-8 text-slate-500 border-t border-white/5 lg:border-none">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-white">10K+</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Active Users</div>
                </div>
                <div className="w-px h-10 bg-slate-800"></div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-white">500K+</div>
                  <div className="text-xs font-bold uppercase tracking-wider">Habits Tracked</div>
                </div>
                <div className="w-px h-10 bg-slate-800"></div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-black text-white">4.9★</div>
                  <div className="text-xs font-bold uppercase tracking-wider">User Rating</div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 relative h-[500px] w-full mt-12 lg:mt-0 perspective-1000 group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>

              {/* Main Glass Dashboard Mockup */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl transition-all duration-700 ease-out rotate-y-6 rotate-x-6 group-hover:rotate-0 group-hover:scale-105">
                {/* Mockup Header */}
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-rose-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
                  </div>
                  <div className="h-2 w-20 bg-white/10 rounded-full"></div>
                </div>

                {/* Mockup Content */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-2xl">🔥</div>
                    <div>
                      <div className="h-2 w-24 bg-white/20 rounded-full mb-2"></div>
                      <div className="h-2 w-16 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl">💧</div>
                    <div>
                      <div className="h-2 w-32 bg-white/20 rounded-full mb-2"></div>
                      <div className="h-2 w-12 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-32 rounded-2xl bg-white/5 border border-white/5 mt-4 overflow-hidden relative">
                    {/* Mini Chart */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-between px-4 pb-2 gap-2 opacity-50">
                      {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                        <div key={i} style={{ height: `${h}%` }} className="w-full bg-violet-500 rounded-t-sm"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Streak */}
              <div className="absolute top-20 -right-4 md:right-10 bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-xl animate-float-slow transform rotate-6 z-20">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🏆</div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Streak</p>
                    <p className="text-xl font-black text-white">12 Days</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 2: Goal */}
              <div className="absolute bottom-20 -left-4 md:left-10 bg-slate-800/90 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-xl animate-float-delayed transform -rotate-6 z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <span className="font-bold">✓</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Daily Goal</p>
                    <p className="text-sm font-bold text-white">All Clear!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-slate-900 relative">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-white mb-20">Why Choose Habit Tracker?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: '🎮', title: 'Gamification', desc: 'Earn points, unlock levels, and track streaks to stay motivated and engaged with your goals.' },
              { icon: '📊', title: 'Advanced Analytics', desc: 'Visualize your progress with detailed charts, weekly reports, and habit insights.' },
              { icon: '📱', title: 'Multi-Device Sync', desc: 'Access your habits from any device. Your data syncs instantly across all platforms.' },
              { icon: '👥', title: 'Community Support', desc: 'Join thousands of users building habits together. Share progress and get inspired.' },
              { icon: '🎯', title: 'Smart Categories', desc: 'Organize habits by health, productivity, fitness, learning, and more custom categories.' },
              { icon: '🔔', title: 'Smart Reminders', desc: 'Get timely notifications to keep you on track and build consistency.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl bg-slate-800/40 border border-slate-700/50 hover:bg-slate-800 hover:border-violet-500/30 transition-all group hover:-translate-y-1">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 relative" id="pricing">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-400">Choose the perfect plan for your goals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-start">
            {Object.entries(PRICING_PLANS).map(([key, plan]: [string, any]) => (
              <div key={key} className={`relative p-8 rounded-3xl border transition-all duration-500 ${key === 'pro' ? 'bg-slate-800/80 border-violet-500 shadow-2xl shadow-violet-500/10 scale-105 z-10' : 'bg-slate-900 border-slate-800 hover:border-slate-700'}`}>
                {key === 'pro' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-xs font-bold text-white uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-black text-white mb-2 capitalize">{plan.name}</h3>
                <p className="text-slate-400 text-sm mb-8 min-h-[40px]">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-white">${plan.price}</span>
                  <span className="text-slate-500 font-bold">/{plan.period}</span>
                </div>

                <Link
                  href={key === 'free' ? '/signup' : '/signup?plan=' + key}
                  className={`block w-full py-4 rounded-xl font-bold text-center transition-all ${key === 'pro'
                    ? 'bg-white text-slate-900 hover:bg-slate-200'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                    }`}
                >
                  Get Started
                </Link>

                <div className="mt-8 space-y-4">
                  <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Includes:</h4>
                  <ul className="space-y-3">
                    {plan.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                        <span className="text-emerald-400 font-bold">✓</span> {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.limitations.length > 0 && (
                    <>
                      <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-8">Not included:</h4>
                      <ul className="space-y-3 opacity-50">
                        {plan.limitations.map((limitation: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3 text-slate-400 text-sm">
                            <span className="text-rose-400 font-bold">✗</span> {limitation}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-4xl mx-auto rounded-[3rem] p-12 md:p-20 bg-gradient-to-br from-violet-900/50 to-indigo-900/50 border border-violet-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-violet-500/20 via-transparent to-transparent" />

          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">Ready to Transform Your Life?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">Start building better habits today. No credit card required for the free plan.</p>
            <Link href="/signup" className="inline-block px-10 py-5 rounded-2xl bg-white text-slate-900 font-black text-xl hover:scale-105 transition-transform shadow-xl shadow-white/10">
              Start Your Free Trial 🚀
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
