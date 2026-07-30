import React from 'react';
import { Download, Trash2, Calendar, FileText, Image as ImageIcon, Eye } from 'lucide-react';
import type { Evidence } from '../../types';
import { GlassCard } from '../common/GlassCard';
import { formatBytes, formatDate } from '../../lib/utils';

interface EvidenceCardProps {
  evidence: Evidence;
  onPreview: () => void;
  onDownload: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  evidence,
  onPreview,
  onDownload,
  onDelete,
}) => {
  const isImage = evidence.fileType.startsWith('image/');

  return (
    <GlassCard hoverEffect onClick={onPreview} className="cursor-pointer flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
              {isImage ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div className="truncate">
              <h4 className="text-xs font-bold text-white font-mono truncate group-hover:text-cyan-300 transition-colors">
                {evidence.fileName}
              </h4>
              <p className="text-[10px] text-slate-400 font-mono">{formatBytes(evidence.fileSize)}</p>
            </div>
          </div>

          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
            {evidence.fileType.split('/')[1]?.toUpperCase() || 'FILE'}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">
          {evidence.description || 'No description provided'}
        </p>

        {evidence.tags && evidence.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 mb-3">
            {evidence.tags.map((t) => (
              <span key={t} className="text-[9px] font-mono text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs font-mono" onClick={(e) => e.stopPropagation()}>
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {formatDate(evidence.uploadDate)}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={onPreview}
            title="Preview Evidence"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDownload}
            title="Download Evidence"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Delete Evidence"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
