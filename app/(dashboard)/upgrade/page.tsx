'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser, setCurrentUser, type User } from '@/lib/auth';
import { updateUserSubscription, getUser } from '@/app/actions/userActions';
import { PRICING_PLANS } from '@/lib/constants';
import { useToast } from '@/app/components/shared/Toast';
import ToastContainer from '@/app/components/shared/Toast';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';

function UpgradeContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toasts, showToast } = useToast();

    const [user, setUser] = useState<User | null>(null);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    useEffect(() => {
        const init = async () => {
            const currentUser = getCurrentUser();
            if (!currentUser) {
                router.push('/login');
                return;
            }

            // Fetch fresh user data
            try {
                const result = await getUser(currentUser.id);
                if (result.success && result.data) {
                    const freshUser = result.data as unknown as User;
                    setUser(freshUser);
                    setCurrentUser(freshUser);
                } else {
                    setUser(currentUser);
                }
            } catch (e) {
                setUser(currentUser);
            }
        };
        init();
    }, [router]);

    const handleUpgrade = async (planKey: string) => {
        if (!user) return;
        setLoadingPlan(planKey);

        try {
            // simulate network delay for effect
            await new Promise(resolve => setTimeout(resolve, 800));

            const result = await updateUserSubscription(user.id, planKey as 'free' | 'pro' | 'premium');

            if (result.success && result.data) {
                const updatedUser = result.data as unknown as User;
                setUser(updatedUser);
                setCurrentUser(updatedUser);

                showToast({
                    message: `Successfully upgraded to ${PRICING_PLANS[planKey as keyof typeof PRICING_PLANS].name}!`,
                    type: 'success'
                });

                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                showToast({ message: 'Upgrade failed. Please try again.', type: 'error' });
            }
        } catch (error) {
            showToast({ message: 'An unexpected error occurred.', type: 'error' });
        } finally {
            setLoadingPlan(null);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto">
            <ToastContainer toasts={toasts} />

            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                    Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Full Potential</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                    Choose the plan that fits your ambition. Upgrade anytime to access exclusive features and unlimited habits.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                {Object.entries(PRICING_PLANS).map(([key, plan]: [string, any]) => {
                    const isCurrent = user.subscription === key;
                    const isPremium = key === 'premium';
                    const isPro = key === 'pro';

                    return (
                        <div
                            key={key}
                            className={`relative rounded-3xl p-8 backdrop-blur-xl border transition-all duration-300 hover:-translate-y-2
                ${isPremium
                                    ? 'bg-gradient-to-b from-indigo-900/80 to-slate-900/90 border-indigo-500/50 shadow-2xl shadow-indigo-500/20'
                                    : isCurrent
                                        ? 'bg-slate-800/80 border-slate-600 shadow-xl'
                                        : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/60'
                                }
              `}
                        >
                            {isPremium && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`p-3 rounded-xl ${isPremium ? 'bg-indigo-500/20 text-indigo-400' :
                                            isPro ? 'bg-violet-500/20 text-violet-400' :
                                                'bg-slate-500/20 text-slate-400'
                                        }`}>
                                        {isPremium ? <Crown size={24} /> : isPro ? <Zap size={24} /> : <Shield size={24} />}
                                    </span>
                                    {isCurrent && (
                                        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center gap-1">
                                            <Check size={12} /> Current Plan
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-white">${plan.price}</span>
                                    <span className="text-slate-400">/month</span>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                {plan.features.map((feature: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className={`mt-1 p-0.5 rounded-full ${isPremium ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                                            <Check size={12} strokeWidth={3} />
                                        </div>
                                        <span className="text-slate-300 text-sm leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleUpgrade(key)}
                                disabled={isCurrent || loadingPlan !== null}
                                className={`w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                  ${isCurrent
                                        ? 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
                                        : isPremium
                                            ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98]'
                                            : 'bg-white text-slate-900 hover:bg-slate-200 active:scale-[0.98]'
                                    }
                  ${loadingPlan !== null && loadingPlan !== key ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                            >
                                {loadingPlan === key ? (
                                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : isCurrent ? (
                                    'Active Plan'
                                ) : (
                                    key === 'free' ? 'Downgrade' : 'Upgrade Now'
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="mt-20 text-center">
                <h2 className="text-2xl font-bold text-white mb-8">Why Upgrade?</h2>
                <div className="grid md:grid-cols-3 gap-8 text-left">
                    <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                        <div className="mb-4 text-violet-400"><Star size={24} className="fill-current" /></div>
                        <h3 className="font-bold text-white mb-2">Unlimited Habits</h3>
                        <p className="text-slate-400 text-sm">Break free from limits. Create as many habits as you need to track every aspect of your life.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                        <div className="mb-4 text-cyan-400"><Star size={24} className="fill-current" /></div>
                        <h3 className="font-bold text-white mb-2">Advanced Analytics</h3>
                        <p className="text-slate-400 text-sm">Gain deep insights into your performance with detailed charts, trends, and history reports.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                        <div className="mb-4 text-emerald-400"><Star size={24} className="fill-current" /></div>
                        <h3 className="font-bold text-white mb-2">Data Export</h3>
                        <p className="text-slate-400 text-sm">Your data belongs to you. Export your entire habit history to JSON anytime for backup or analysis.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UpgradePage() {
    return (
        <div className="min-h-screen pb-20 pt-10 px-6 bg-slate-900">
            <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
                </div>
            }>
                <UpgradeContent />
            </Suspense>
        </div>
    );
}
