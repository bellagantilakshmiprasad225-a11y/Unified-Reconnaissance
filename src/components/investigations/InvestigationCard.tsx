import React from 'react';
import { Calendar, User, Copy, Trash2, Edit3 } from 'lucide-react';
import type { Investigation } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { PriorityBadge } from '../common/PriorityBadge';
import { StatusBadge } from '../common/StatusBadge';
import { formatDate } from '../../lib/utils';

interface InvestigationCardProps {
  investigation: Investigation;
  onSelect: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const InvestigationCard: React.FC<InvestigationCardProps> = ({
  investigation,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  return (
    <GlassCard hoverEffect onClick={onSelect} className="cursor-pointer flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
              {investigation.id}
            </span>
            <PriorityBadge priority={investigation.priority} />
          </div>
          <StatusBadge status={investigation.status} />
        </div>

        <h3 className="text-sm font-bold text-white font-mono group-hover:text-cyan-300 transition-colors mb-2 line-clamp-1">
          {investigation.name}
        </h3>

        <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {investigation.description}
        </p>

        {investigation.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-4">
            {investigation.tags.map((t) => (
              <span key={t} className="text-[10px] font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-500" /> {investigation.analystName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" /> {formatDate(investigation.date)}
          </span>
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onEdit}
            title="Edit Investigation"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDuplicate}
            title="Duplicate Investigation"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Delete Investigation"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
