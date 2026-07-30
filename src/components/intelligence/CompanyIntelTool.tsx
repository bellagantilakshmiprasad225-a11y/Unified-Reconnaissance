import React, { useState } from 'react';
import { Building2, Search, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { generateCompanyLinks } from '../../lib/searchLinkGenerator';
import { SearchLinkCard } from '../common/SearchLinkCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const CompanyIntelTool: React.FC = () => {
  const [company, setCompany] = useState('');
  const [links, setLinks] = useState<ReturnType<typeof generateCompanyLinks>>([]);
  const [error, setError] = useState('');
  const { addSearchRecord } = useSearchHistoryStore();
  const { logActivity } = useActivityLogStore();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = company.trim();
    if (!clean) {
      setError('Please enter a corporate entity name.');
      return;
    }

    const generated = generateCompanyLinks(clean);
    setLinks(generated);

    addSearchRecord({
      query: clean,
      module: 'Company Intelligence',
      type: 'Company',
      status: 'Completed',
      resultCount: generated.length,
      searchUrl: generated[0]?.url,
    });

    logActivity('Company Intelligence', `Corporate lookup generated for: ${clean}`, 'Search');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-blue-950 text-blue-400 border border-blue-800">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Corporate Entity & Registry OSINT</h3>
            <p className="text-xs text-slate-400">
              Access LinkedIn corporate profiles, Crunchbase funding, OpenCorporates registries, and public search.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Enter company name (e.g. Apex Technologies Group)..."
              className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-blue"
          >
            <Search className="w-4 h-4" /> Run Company Search
          </button>
        </form>
      </GlassCard>

      {links.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Corporate Intelligence Registries ({links.length})
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Public Legal Registries
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
