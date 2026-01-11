'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, setCurrentUser, logoutUser, type User } from '@/lib/auth';
import { updateUserSubscription, updateUserProfile, getUser } from '@/app/actions/userActions';
import { getHabits } from '@/app/actions/habitActions';
import { PRICING_PLANS, FEATURE_LIMITS } from '@/lib/constants';
import ToastContainer, { useToast } from '@/app/components/shared/Toast';
import {
  User as UserIcon,
  Mail,
  Moon,
  Sun,
  Crown,
  Download,
  Trash2,
  LogOut,
  CreditCard,
  ShieldAlert,
  Save,
  Check
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const { toasts, showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    theme: 'dark' as 'dark' | 'light',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      setIsHydrated(true);
      const sessionUser = getCurrentUser();

      if (!sessionUser) {
        router.push('/login');
        return;
      }

      // Fetch latest user data from server
      try {
        const result = await getUser(sessionUser.id);
        if (result.success && result.data) {
          const freshUser = result.data as unknown as User; // safe cast
          setUser(freshUser);
          // Update session
          setCurrentUser(freshUser);

          setFormData({
            name: freshUser.name || '',
            email: freshUser.email || '',
            theme: (localStorage.getItem('habit_tracker_theme') || 'dark') as 'dark' | 'light',
          });
        } else {
          // Fallback to session
          setUser(sessionUser);
          setFormData({
            name: sessionUser.name || '',
            email: sessionUser.email || '',
            theme: (localStorage.getItem('habit_tracker_theme') || 'dark') as 'dark' | 'light',
          });
        }
      } catch (error) {
        console.error(error);
        setUser(sessionUser);
      }
    };
    init();
  }, [router]);

  const handleThemeChange = (newTheme: 'dark' | 'light') => {
    setFormData({ ...formData, theme: newTheme });
    localStorage.setItem('habit_tracker_theme', newTheme);

    if (newTheme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }

    showToast({ message: 'Theme updated!', type: 'success' });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);

    try {
      const result = await updateUserProfile(user.id, {
        name: formData.name,
        email: formData.email
      });

      if (result.success && result.data) {
        const updatedUser = result.data as unknown as User;
        setUser(updatedUser);
        setCurrentUser(updatedUser);
        showToast({ message: 'Profile updated successfully!', type: 'success' });
      } else {
        showToast({ message: result.error || 'Failed to update profile', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'An error occurred', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgradePlan = async (planName: string) => {
    if (!user) return;

    try {
      const result = await updateUserSubscription(user.id, planName as 'free' | 'pro' | 'premium');
      if (result.success && result.data) {
        const updatedUser = result.data as unknown as User;
        setUser(updatedUser);
        setCurrentUser(updatedUser);
        showToast({ message: `Upgraded to ${planName.toUpperCase()}!`, type: 'success' });
      } else {
        showToast({ message: 'Failed to upgrade plan', type: 'error' });
      }
    } catch (error) {
      showToast({ message: 'Error upgrading plan', type: 'error' });
    }
  };

  const handleExportData = async () => {
    if (!user) return;
    try {
      const habitsResult = await getHabits(user.id);

      const data = {
        user: user,
        habits: habitsResult.success ? habitsResult.data : [],
        exportDate: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      showToast({ message: 'Data exported successfully!', type: 'success' });
    } catch (error) {
      showToast({ message: 'Failed to export data', type: 'error' });
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.push('/');
  }

  if (!isHydrated || !user) return null;

  const limits = FEATURE_LIMITS[user.subscription];
  const currentPlan = PRICING_PLANS[user.subscription as keyof typeof PRICING_PLANS];

  return (
    <div className="space-y-8 animate-fade-in pb-12 w-full max-w-5xl mx-auto">
      <ToastContainer toasts={toasts} />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-700/50">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">Settings</h1>
          <p className="text-slate-400 text-lg">Manage your account and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Profile & Preferences */}
        <div className="lg:col-span-2 space-y-8">

          {/* Profile Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                <UserIcon size={20} />
              </span>
              <h3 className="text-xl font-bold text-white">Profile Information</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>Saving...</>
                  ) : (
                    <><Save size={18} /> Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preferences Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <span className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400">
                <Sun size={20} />
              </span>
              <h3 className="text-xl font-bold text-white">Appearance</h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <div>
                <h4 className="font-bold text-white mb-1">Interface Theme</h4>
                <p className="text-sm text-slate-400">Select your preferred color scheme</p>
              </div>
              <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${formData.theme === 'light'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Sun size={16} /> Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${formData.theme === 'dark'
                    ? 'bg-slate-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                    }`}
                >
                  <Moon size={16} /> Dark
                </button>
              </div>
            </div>
          </div>

          {/* Subscription Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="flex items-center gap-3 mb-8 relative z-10">
              <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                <Crown size={20} />
              </span>
              <h3 className="text-xl font-bold text-white">Subscription Plan</h3>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Current Plan</div>
                  <h4 className="text-2xl font-black text-white">{currentPlan.name}</h4>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">${currentPlan.price}<span className="text-sm text-slate-400 font-normal">/mo</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Max Habits</div>
                  <div className="font-bold text-white">{limits.maxHabits === Infinity ? 'Unlimited' : limits.maxHabits}</div>
                </div>
                <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/30">
                  <div className="text-xs text-slate-400 mb-1">Analytics</div>
                  <div className="font-bold text-white">{limits.hasAnalytics ? 'Full Access' : 'Basic'}</div>
                </div>
              </div>

              {user.subscription !== 'premium' && (
                <div className="border-t border-slate-700/50 pt-6">
                  <h5 className="font-bold text-white mb-4">Upgrade for more power</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.entries(PRICING_PLANS).map(([key, plan]: [string, any]) => {
                      if (key === user.subscription || (user.subscription === 'pro' && key === 'free')) return null;
                      return (
                        <button
                          key={key}
                          onClick={() => handleUpgradePlan(key)}
                          className={`px-4 py-3 rounded-xl font-bold text-sm border transition-all ${key === 'premium'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white border-transparent'
                            : 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                            }`}
                        >
                          Upgrade to {plan.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column: Data & Danger Zone */}
        <div className="space-y-8">

          {/* Data Management */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Save size={20} />
              </span>
              <h3 className="text-xl font-bold text-white">Data Control</h3>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleExportData}
                disabled={!limits.canExportData}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all group ${limits.canExportData
                  ? 'bg-slate-900/50 border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5'
                  : 'bg-slate-900/30 border-slate-800 opacity-50 cursor-not-allowed'
                  }`}
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <Download size={20} />
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-bold text-white">Export Data</h4>
                  <p className="text-xs text-slate-400">{limits.canExportData ? 'Download your JSON backup' : 'Upgrade to export data'}</p>
                </div>
              </button>

              <button
                onClick={() => showToast({ message: 'Disabled in this version', type: 'info' })}
                disabled={true}
                className="w-full p-4 rounded-xl border border-slate-700 bg-slate-900/50 opacity-50 cursor-not-allowed flex items-center gap-4"
              >
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <Trash2 size={20} />
                </div>
                <div className="text-left flex-1">
                  <h4 className="font-bold text-white">Clear Habits</h4>
                  <p className="text-xs text-slate-400">Use delete in Habits page instead</p>
                </div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-950/20 backdrop-blur-xl border border-rose-900/50 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400">
                <ShieldAlert size={20} />
              </span>
              <h3 className="text-xl font-bold text-rose-200">Danger Zone</h3>
            </div>

            <p className="text-sm text-rose-200/60 mb-6 leading-relaxed">
              Log out to clear your current session.
            </p>

            <button
              onClick={handleLogout}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
