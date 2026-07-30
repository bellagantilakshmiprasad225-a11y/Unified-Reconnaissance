import React from 'react';
import { Star, Globe, Search, Shield, Terminal, ArrowRight } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

interface FavoriteToolsWidgetProps {
  onSelectTool: (toolId: string) => void;
}

export const FavoriteToolsWidget: React.FC<FavoriteToolsWidgetProps> = ({ onSelectTool }) => {
  const favoriteTools = [
    { id: 'whois', name: 'WHOIS Lookup', category: 'Domain', icon: Globe },
    { id: 'dorks', name: 'Advanced Query Builder', category: 'Dorks', icon: Search },
    { id: 'dns', name: 'DNS Lookup', category: 'DNS', icon: Terminal },
    { id: 'ipinfo', name: 'IP Information', category: 'Network', icon: Shield },
  ];

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" /> Favorite Tools
        </h3>
        <button
          onClick={() => onSelectTool('tools')}
          className="text-[10px] text-cyan-400 hover:underline font-mono flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {favoriteTools.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTool(t.id)}
              className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {t.category}
                </span>
              </div>
              <p className="text-xs font-bold font-mono text-slate-200 group-hover:text-white truncate">
                {t.name}
              </p>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
};
