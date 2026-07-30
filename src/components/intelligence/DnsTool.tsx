import React, { useState } from 'react';
import { Terminal, Search, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { generateDnsLinks } from '../../lib/searchLinkGenerator';
import { validateDomain } from '../../lib/utils';
import { SearchLinkCard } from '../common/SearchLinkCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const DnsTool: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [links, setLinks] = useState<ReturnType<typeof generateDnsLinks>>([]);
  const [error, setError] = useState('');
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
      setError('Invalid domain format. Example: targetdomain.com');
      return;
    }

    const generated = generateDnsLinks(clean);
    setLinks(generated);

    addSearchRecord({
      query: clean,
      module: 'DNS Lookup',
      type: 'Domain',
      status: 'Completed',
      resultCount: generated.length,
      searchUrl: generated[0]?.url,
    });

    logActivity('DNS Lookup', `Generated DNS propagation links for: ${clean}`, 'Search');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">DNS Record Propagation</h3>
            <p className="text-xs text-slate-400">
              Check public A, AAAA, MX, TXT, NS, and CNAME records via global DNS resolvers.
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
              className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-blue"
          >
            <Search className="w-4 h-4" /> Run DNS Check
          </button>
        </form>
      </GlassCard>

      {links.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Public DNS Propagation Tools ({links.length})
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Official Resolvers
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
