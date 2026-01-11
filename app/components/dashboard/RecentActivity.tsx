'use client';

import { CheckCircle2, Trophy, Flame, Star, Zap } from 'lucide-react';

interface ActivityItem {
    id: string;
    type: 'completion' | 'streak' | 'level_up' | 'achievement' | 'milestone';
    title: string;
    timestamp: string;
    habitName?: string;
}

interface RecentActivityProps {
    activities: ActivityItem[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {

    const getIcon = (type: string) => {
        switch (type) {
            case 'completion': return <CheckCircle2 size={16} className="text-emerald-400" />;
            case 'streak': return <Flame size={16} className="text-orange-400" />;
            case 'level_up': return <Zap size={16} className="text-yellow-400" />;
            case 'achievement': return <Trophy size={16} className="text-violet-400" />;
            default: return <Star size={16} className="text-blue-400" />;
        }
    };

    const getBackground = (type: string) => {
        switch (type) {
            case 'completion': return 'bg-emerald-500/10';
            case 'streak': return 'bg-orange-500/10';
            case 'level_up': return 'bg-yellow-500/10';
            case 'achievement': return 'bg-violet-500/10';
            default: return 'bg-blue-500/10';
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 h-full shadow-lg flex flex-col">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 flex-shrink-0">
                <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6M6 20V10M18 20V4" /></svg>
                </span>
                Recent Activity
            </h3>

            <div className="space-y-4 overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                {activities.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <p>No recent activity yet. Start tracking!</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors group flex-shrink-0">
                            <div className={`mt-1 p-2 rounded-full ${getBackground(activity.type)} border border-white/5`}>
                                {getIcon(activity.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors truncate">
                                    {activity.title}
                                </p>
                                {activity.habitName && (
                                    <p className="text-xs text-slate-400 mt-0.5">{activity.habitName}</p>
                                )}
                            </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap">
                                {activity.timestamp}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
