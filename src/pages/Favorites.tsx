import React, { useState } from 'react';
import { Bookmark, Trash2 } from 'lucide-react';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { GlassCard } from '../components/common/GlassCard';
import { EmptyState } from '../components/common/EmptyState';
import type { FavoriteCategory } from '../types';

export const Favorites: React.FC = () => {
  const { favorites, removeFavorite } = useFavoritesStore();
  const [activeTab, setActiveTab] = useState<FavoriteCategory | 'ALL'>('ALL');

  const filteredFavorites = favorites.filter(
    (f) => activeTab === 'ALL' || f.category === activeTab
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Bookmark className="w-5 h-5 text-amber-400" /> Favorite Investigations & Tools
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Quick bookmark access to primary investigation cases, tools, and targets.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        {(['ALL', 'investigation', 'tool', 'target', 'search'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-glow-cyan'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab}s
          </button>
        ))}
      </div>

      {/* Favorites List */}
      {filteredFavorites.length === 0 ? (
        <EmptyState
          title="No favorites saved"
          description="Bookmark your most used tools, targets, and investigation cases for instant access."
          icon={Bookmark}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFavorites.map((fav) => (
            <GlassCard key={fav.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                    {fav.category}
                  </span>
                  <button
                    onClick={() => removeFavorite(fav.id)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400"
                    title="Remove Favorite"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-white font-mono mt-1">{fav.title}</h4>
                {fav.subtitle && <p className="text-xs text-slate-400 mt-1 font-mono">{fav.subtitle}</p>}
              </div>

              <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
                <span>ID: {fav.targetId}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};
