import React, { useState } from 'react';
import { Shield, Search, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { generateIpLinks } from '../../lib/searchLinkGenerator';
import { validateIp } from '../../lib/utils';
import { SearchLinkCard } from '../common/SearchLinkCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const IpInfoTool: React.FC = () => {
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
      setError('Invalid IPv4 address format. Example: 185.199.108.153');
      return;
    }

    const generated = generateIpLinks(clean);
    setLinks(generated);

    addSearchRecord({
      query: clean,
      module: 'IP Information',
      type: 'IP',
      status: 'Completed',
      resultCount: generated.length,
      searchUrl: generated[0]?.url,
    });

    logActivity('IP Information', `IP geolocation & ASN links generated for: ${clean}`, 'Search');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">IP Geolocation & ASN Intelligence</h3>
            <p className="text-xs text-slate-400">
              Query ISP, Autonomous System Number (ASN), public threat scores, and approximate country location.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="Enter IP (e.g. 185.199.108.153)..."
              className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-cyan"
          >
            <Search className="w-4 h-4" /> Run IP Info
          </button>
        </form>
      </GlassCard>

      {links.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Public IP & Threat Registries ({links.length})
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Geolocation is Approximate
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
