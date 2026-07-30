import React, { useState } from 'react';
import { Share2, ExternalLink } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const SocialIntelTool: React.FC = () => {
  const [term, setTerm] = useState('');
  const { addSearchRecord } = useSearchHistoryStore();
  const { logActivity } = useActivityLogStore();

  const socialPlatforms = [
    { name: 'LinkedIn', getUrl: (t: string) => `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(t)}` },
    { name: 'GitHub', getUrl: (t: string) => `https://github.com/search?q=${encodeURIComponent(t)}` },
    { name: 'X (Twitter)', getUrl: (t: string) => `https://x.com/search?q=${encodeURIComponent(t)}` },
    { name: 'YouTube', getUrl: (t: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(t)}` },
    { name: 'Facebook', getUrl: (t: string) => `https://www.facebook.com/public/${encodeURIComponent(t)}` },
    { name: 'Instagram', getUrl: (t: string) => `https://www.instagram.com/explore/tags/${encodeURIComponent(t.replace(/\s+/g, ''))}` },
  ];

  const handleSearch = (getUrl: (t: string) => string, platformName: string) => {
    if (!term.trim()) return;
    const targetUrl = getUrl(term.trim());
    window.open(targetUrl, '_blank', 'noopener,noreferrer');

    addSearchRecord({
      query: `${platformName}: ${term.trim()}`,
      module: 'Social Intelligence',
      type: 'General',
      status: 'Completed',
      searchUrl: targetUrl,
    });

    logActivity('Social Intelligence', `Opened ${platformName} search for: ${term.trim()}`, 'Search');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Social Media OSINT Hub</h3>
            <p className="text-xs text-slate-400">
              Query official search interfaces for major social networks safely.
            </p>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Enter search term, target brand, or username..."
            className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {socialPlatforms.map((p) => (
            <button
              key={p.name}
              onClick={() => handleSearch(p.getUrl, p.name)}
              disabled={!term.trim()}
              className="p-3 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-800 text-left transition-all disabled:opacity-50 flex items-center justify-between group"
            >
              <span className="text-xs font-bold font-mono text-slate-200 group-hover:text-white">
                {p.name}
              </span>
              <ExternalLink className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};
