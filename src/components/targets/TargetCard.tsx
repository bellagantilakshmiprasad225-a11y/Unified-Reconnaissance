import React from 'react';
import { Star, Mail, Globe, Building2, Trash2, Edit3 } from 'lucide-react';
import type { TargetProfile } from '../../types';
import { GlassCard } from '../common/GlassCard';

interface TargetCardProps {
  target: TargetProfile;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const TargetCard: React.FC<TargetCardProps> = ({
  target,
  onSelect,
  onEdit,
  onToggleFavorite,
  onDelete,
}) => {
  return (
    <GlassCard hoverEffect onClick={onSelect} className="cursor-pointer flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            {target.avatarUrl ? (
              <img src={target.avatarUrl} alt={target.fullName} className="w-10 h-10 rounded-full object-cover border border-cyan-500/40" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-sm font-bold font-mono">
                {target.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-sm font-bold text-white font-mono group-hover:text-cyan-300 transition-colors line-clamp-1">
                {target.fullName}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono truncate">{target.jobTitle || target.company || 'Target Entity'}</p>
            </div>
          </div>

          <button
            onClick={onToggleFavorite}
            className={`p-1.5 rounded-lg border transition-colors ${
              target.isFavorite
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            <Star className="w-4 h-4 fill-current" />
          </button>
        </div>

        <div className="space-y-1.5 text-xs font-mono text-slate-300 mb-4">
          {target.domain && (
            <div className="flex items-center gap-2 text-slate-300">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">{target.domain}</span>
            </div>
          )}
          {target.email && (
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{target.email}</span>
            </div>
          )}
          {target.company && (
            <div className="flex items-center gap-2 text-slate-400">
              <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{target.company}</span>
            </div>
          )}
        </div>

        {target.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-3">
            {target.tags.map((t) => (
              <span key={t} className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs font-mono" onClick={(e) => e.stopPropagation()}>
        <span className="text-[10px] text-slate-500">{target.id}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            title="Edit Target"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Delete Target"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
