import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; direction: 'up' | 'down' };
  variant?: 'primary' | 'success' | 'warning' | 'info';
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  variant = 'primary',
}: StatCardProps) {
  const variants = {
    primary: 'from-violet-500/10 to-blue-500/10 border-violet-500/20 hover:border-violet-500/40',
    success: 'from-emerald-500/10 to-emerald-400/10 border-emerald-500/20 hover:border-emerald-500/40',
    warning: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/40',
    info: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20 hover:border-cyan-500/40',
  };

  const iconVariants = {
    primary: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-7 border transition-all duration-300
        bg-gradient-to-br backdrop-blur-xl hover:-translate-y-1 hover:shadow-xl
        ${variants[variant]}
      `}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${iconVariants[variant]}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trend.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend.direction === 'up' ? '↗' : '↘'} {trend.value}%
          </div>
        )}
      </div>
      <div>
        <span className="block text-4xl font-extrabold text-white mb-2 tracking-tight leading-none">{value}</span>
        <span className="block text-sm font-medium text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
}
