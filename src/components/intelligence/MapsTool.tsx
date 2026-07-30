import React, { useState } from 'react';
import { MapPin, Search, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { generateMapLinks } from '../../lib/searchLinkGenerator';
import { SearchLinkCard } from '../common/SearchLinkCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const MapsTool: React.FC = () => {
  const [query, setQuery] = useState('');
  const [links, setLinks] = useState<ReturnType<typeof generateMapLinks>>([]);
  const [error, setError] = useState('');
  const { addSearchRecord } = useSearchHistoryStore();
  const { logActivity } = useActivityLogStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = query.trim();
    if (!clean) {
      setError('Please enter an address, corporate location, or coordinates.');
      return;
    }

    const generated = generateMapLinks(clean);
    setLinks(generated);

    addSearchRecord({
      query: clean,
      module: 'Maps & Geolocation',
      type: 'General',
      status: 'Completed',
      resultCount: generated.length,
      searchUrl: generated[0]?.url,
    });

    logActivity('Maps & Geolocation', `Generated GIS map search links for: ${clean}`, 'Search');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Geographic Location OSINT</h3>
            <p className="text-xs text-slate-400">
              Query Google Maps, OpenStreetMap, and Wikimapia for corporate HQ coordinates and satellite imagery.
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter address, city, company, or lat,long (e.g. 37.7749, -122.4194)..."
              className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-cyan"
          >
            <Search className="w-4 h-4" /> Run Map OSINT
          </button>
        </form>
      </GlassCard>

      {links.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              GIS Map Services ({links.length})
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Satellite & Open GIS
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
