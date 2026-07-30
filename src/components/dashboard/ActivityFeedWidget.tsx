import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useActivityLogStore } from '../../store/useActivityLogStore';
import { formatDate } from '../../lib/utils';

export const ActivityFeedWidget: React.FC = () => {
  const { activities } = useActivityLogStore();

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" /> Live Activity Feed
        </h3>
        <span className="text-[10px] text-cyan-400 font-mono">Real-time</span>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
        {activities.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono text-center py-4">No recent activity logged</p>
        ) : (
          activities.slice(0, 5).map((act) => (
            <div
              key={act.id}
              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-2"
            >
              <div>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">
                  {act.category}
                </span>
                <p className="text-xs font-mono font-semibold text-slate-200 mt-1">{act.action}</p>
                <p className="text-[11px] text-slate-400 leading-tight">{act.details}</p>
              </div>
              <div className="text-[10px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(act.timestamp)}
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};
