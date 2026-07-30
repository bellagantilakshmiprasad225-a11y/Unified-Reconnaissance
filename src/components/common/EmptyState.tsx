import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { FolderSearch } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = FolderSearch,
  actionLabel,
  onAction,
}) => {
  return (
    <GlassCard className="flex flex-col items-center justify-center text-center py-12 px-6 border-dashed border-slate-700/60">
      <div className="p-4 rounded-full bg-slate-800/80 border border-slate-700/60 text-cyan-400 mb-4">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1 font-mono">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold tracking-wide transition-colors shadow-glow-cyan"
        >
          {actionLabel}
        </button>
      )}
    </GlassCard>
  );
};
