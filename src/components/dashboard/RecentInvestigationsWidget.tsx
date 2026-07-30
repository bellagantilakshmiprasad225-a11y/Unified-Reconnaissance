import React from 'react';
import { FolderLock, ArrowRight } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';

interface RecentInvestigationsWidgetProps {
  onSelect: () => void;
}

export const RecentInvestigationsWidget: React.FC<RecentInvestigationsWidgetProps> = ({ onSelect }) => {
  const { investigations } = useInvestigationStore();

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <FolderLock className="w-4 h-4 text-cyan-400" /> Recent Investigations
        </h3>
        <button
          onClick={onSelect}
          className="text-[10px] text-cyan-400 hover:underline font-mono flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
        {investigations.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono text-center py-4">No active investigations</p>
        ) : (
          investigations.slice(0, 4).map((inv) => (
            <div
              key={inv.id}
              onClick={onSelect}
              className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{inv.id}</span>
                <div className="flex items-center gap-1">
                  <PriorityBadge priority={inv.priority} />
                  <StatusBadge status={inv.status} />
                </div>
              </div>
              <p className="text-xs font-bold font-mono text-white truncate">{inv.name}</p>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};
