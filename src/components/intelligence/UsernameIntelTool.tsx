import React, { useState } from 'react';
import { AtSign, Search, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { generateUsernameLinks } from '../../lib/searchLinkGenerator';
import { SearchLinkCard } from '../common/SearchLinkCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const UsernameIntelTool: React.FC = () => {
  const [username, setUsername] = useState('');
  const [links, setLinks] = useState<ReturnType<typeof generateUsernameLinks>>([]);
  const [error, setError] = useState('');
  const { addSearchRecord } = useSearchHistoryStore();
  const { logActivity } = useActivityLogStore();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = username.trim();
    if (!clean) {
      setError('Please enter a target username.');
      return;
    }

    const generated = generateUsernameLinks(clean);
    setLinks(generated);

    addSearchRecord({
      query: clean,
      module: 'Username Intelligence',
      type: 'Username',
      status: 'Completed',
      resultCount: generated.length,
      searchUrl: generated[0]?.url,
    });

    logActivity('Username Intelligence', `Generated public platform links for username: ${clean}`, 'Search');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-purple-950 text-purple-400 border border-purple-800">
            <AtSign className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Username Platform Footprint</h3>
            <p className="text-xs text-slate-400">
              Check public profiles across GitHub, X, Reddit, Keybase, and search engines.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username (e.g. apex_sec_ops or @john_doe)..."
              className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" /> Run Username Search
          </button>
        </form>
      </GlassCard>

      {links.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Public Platform Profile Queries ({links.length})
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> No Account Takeover / Testing
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {links.map((link, i) => (
              <SearchLinkCard key={i} link={link} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
