import React, { useState } from 'react';
import { UserCheck, Search, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { generatePeopleLinks } from '../../lib/searchLinkGenerator';
import { SearchLinkCard } from '../common/SearchLinkCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const PeopleIntelTool: React.FC = () => {
  const [personName, setPersonName] = useState('');
  const [links, setLinks] = useState<ReturnType<typeof generatePeopleLinks>>([]);
  const [error, setError] = useState('');
  const { addSearchRecord } = useSearchHistoryStore();
  const { logActivity } = useActivityLogStore();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = personName.trim();
    if (!clean) {
      setError('Please enter a person name.');
      return;
    }

    const generated = generatePeopleLinks(clean);
    setLinks(generated);

    addSearchRecord({
      query: clean,
      module: 'People Intelligence',
      type: 'Person',
      status: 'Completed',
      resultCount: generated.length,
      searchUrl: generated[0]?.url,
    });

    logActivity('People Intelligence', `Public name search links generated for: ${clean}`, 'Search');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-teal-950 text-teal-400 border border-teal-800">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Public People & Academic Citations</h3>
            <p className="text-xs text-slate-400">
              Query Google Scholar publications, professional LinkedIn records, and exact web match dorks.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="Enter full name (e.g. John Smith)..."
              className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" /> Run People Search
          </button>
        </form>
      </GlassCard>

      {links.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Public Search Destinations ({links.length})
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> No Private PII Access
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
