import React, { useState } from 'react';
import { ExternalLink, Copy, Check, ShieldCheck } from 'lucide-react';
import type { OSINTSearchLink } from '../../lib/searchLinkGenerator';
import { GlassCard } from './GlassCard';

interface SearchLinkCardProps {
  link: OSINTSearchLink;
  onOpen?: () => void;
}

export const SearchLinkCard: React.FC<SearchLinkCardProps> = ({ link, onOpen }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(link.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
    if (onOpen) onOpen();
  };

  return (
    <GlassCard hoverEffect className="flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
            {link.platform}
          </span>
          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" /> Public OSINT
          </span>
        </div>
        <p className="text-xs text-slate-300 mb-3">{link.description}</p>
        <p className="text-[11px] text-slate-500 font-mono truncate mb-4 bg-slate-900/80 p-1.5 rounded border border-slate-800">
          {link.url}
        </p>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" /> Copy URL
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleOpen}
          className="flex-1 py-1.5 px-3 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-glow-cyan"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open Search
        </button>
      </div>
    </GlassCard>
  );
};
