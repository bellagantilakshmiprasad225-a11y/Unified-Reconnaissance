import React, { useState } from 'react';
import { Network, Search, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { generateIpLinks } from '../../lib/searchLinkGenerator';
import { validateIp } from '../../lib/utils';
import { SearchLinkCard } from '../common/SearchLinkCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const ReverseDnsTool: React.FC = () => {
  const [ip, setIp] = useState('');
  const [links, setLinks] = useState<ReturnType<typeof generateIpLinks>>([]);
  const [error, setError] = useState('');
  const { addSearchRecord } = useSearchHistoryStore();
  const { logActivity } = useActivityLogStore();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = ip.trim();
    if (!clean) {
      setError('Please enter a target IP address.');
      return;
    }
    if (!validateIp(clean)) {
      setError('Invalid IPv4 address format. Example: 104.21.55.12');
      return;
    }

    const generated = generateIpLinks(clean);
    setLinks(generated);

    addSearchRecord({
      query: clean,
      module: 'Reverse DNS',
      type: 'IP',
      status: 'Completed',
      resultCount: generated.length,
      searchUrl: generated[0]?.url,
    });

    logActivity('Reverse DNS', `Reverse DNS PTR lookup generated for: ${clean}`, 'Search');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Reverse DNS (PTR) Lookup</h3>
            <p className="text-xs text-slate-400">
              Map IPv4 address back to hostname and ISP PTR record via public registries.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IPv4 address (e.g. 104.21.55.12)..."
              className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-cyan"
          >
            <Search className="w-4 h-4" /> Run Reverse DNS
          </button>
        </form>
      </GlassCard>

      {links.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Public PTR & Host Resolvers ({links.length})
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Regional Registries
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
