import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: string;
  icon: LucideIcon;
  iconColor?: string;
  glow?: 'cyan' | 'blue' | 'none';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor = 'text-cyan-400',
  glow = 'none',
  onClick,
}) => {
  return (
    <GlassCard
      glow={glow}
      hoverEffect={!!onClick}
      onClick={onClick}
      className={cn('cursor-pointer relative overflow-hidden group', !onClick && 'cursor-default')}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <p className="text-2xl font-bold mt-2 text-white font-mono">{value}</p>
          {change && (
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1 font-mono">
              <span>↑</span> {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            'p-3 rounded-lg bg-slate-800/60 border border-slate-700/50 group-hover:scale-110 transition-transform duration-200',
            iconColor
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
    </GlassCard>
  );
};
