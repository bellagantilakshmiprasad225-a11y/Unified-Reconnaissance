import React from 'react';
import type { InvestigationStatus } from '../../types';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: InvestigationStatus;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const styles: Record<InvestigationStatus, string> = {
    New: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    'In Progress': 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Archived: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border font-mono',
        styles[status],
        className
      )}
    >
      {status}
    </span>
  );
};
