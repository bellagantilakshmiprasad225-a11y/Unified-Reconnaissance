import React, { useState } from 'react';
import { Cpu, Search, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { validateDomain } from '../../lib/utils';
import { SearchLinkCard } from '../common/SearchLinkCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const TechDetectionTool: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [error, setError] = useState('');
  const [hasRun, setHasRun] = useState(false);
  const { addSearchRecord } = useSearchHistoryStore();
  const { logActivity } = useActivityLogStore();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = domain.trim().toLowerCase();
    if (!clean) {
      setError('Please enter a target domain.');
      return;
    }
    if (!validateDomain(clean)) {
      setError('Invalid domain format.');
      return;
    }

    setHasRun(true);

    addSearchRecord({
      query: clean,
      module: 'Technology Detection',
      type: 'Domain',
      status: 'Completed',
      searchUrl: `https://builtwith.com/${clean}`,
    });

    logActivity('Technology Detection', `Technology stack query initialized for: ${clean}`, 'Search');
  };

  const techLookupLinks = domain.trim()
    ? [
        {
          platform: 'BuiltWith',
          category: 'Tech Stack Lookup',
          url: `https://builtwith.com/${encodeURIComponent(domain.trim())}`,
          description: 'Web server, CMS, JavaScript libraries, and analytics detection',
        },
        {
          platform: 'Wappalyzer Public',
          category: 'Technology Lookup',
          url: `https://www.wappalyzer.com/lookup/${encodeURIComponent(domain.trim())}`,
          description: 'Framework, CDN, and hosting provider detection',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Web Technology Stack Detection</h3>
            <p className="text-xs text-slate-400">
              Query public technology lookup services (CMS, web server, CDN, JS frameworks, analytics) safely.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Enter domain (e.g. apextech.example.com)..."
              className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-cyan"
          >
            <Search className="w-4 h-4" /> Run Tech Detection
          </button>
        </form>
      </GlassCard>

      {hasRun && techLookupLinks.length > 0 && (
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 text-xs font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Direct active scanning disabled. Use official public technology lookup integrations below:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {techLookupLinks.map((link, i) => (
              <SearchLinkCard key={i} link={link} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
