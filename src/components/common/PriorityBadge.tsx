import React from 'react';
import type { PriorityLevel } from '../../types';
import { cn } from '../../lib/utils';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className }) => {
  const styles: Record<PriorityLevel, string> = {
    Low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    High: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    Critical: 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border font-mono',
        styles[priority],
        className
      )}
    >
      ● {priority}
    </span>
  );
};
