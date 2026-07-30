import React from 'react';
import { Search, ArrowRight, ExternalLink } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { formatDate } from '../../lib/utils';

interface RecentSearchesWidgetProps {
  onSelect: () => void;
}

export const RecentSearchesWidget: React.FC<RecentSearchesWidgetProps> = ({ onSelect }) => {
  const { history } = useSearchHistoryStore();

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" /> Recent Search Log
        </h3>
        <button
          onClick={onSelect}
          className="text-[10px] text-cyan-400 hover:underline font-mono flex items-center gap-1"
        >
          History <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
        {history.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono text-center py-4">No search history recorded</p>
        ) : (
          history.slice(0, 4).map((rec) => (
            <div
              key={rec.id}
              className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between gap-2"
            >
              <div className="truncate">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  {rec.module}
                </span>
                <p className="text-xs font-bold font-mono text-white mt-1 truncate">{rec.query}</p>
                <p className="text-[10px] font-mono text-slate-400">{formatDate(rec.timestamp)}</p>
              </div>

              {rec.searchUrl && (
                <a
                  href={rec.searchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded bg-slate-800 text-cyan-400 hover:bg-slate-700 shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};
