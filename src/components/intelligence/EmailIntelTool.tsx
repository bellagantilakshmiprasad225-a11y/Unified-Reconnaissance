import React, { useState } from 'react';
import { Mail, Search, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { generateEmailLinks } from '../../lib/searchLinkGenerator';
import { validateEmail } from '../../lib/utils';
import { SearchLinkCard } from '../common/SearchLinkCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const EmailIntelTool: React.FC = () => {
  const [email, setEmail] = useState('');
  const [links, setLinks] = useState<ReturnType<typeof generateEmailLinks>>([]);
  const [error, setError] = useState('');
  const { addSearchRecord } = useSearchHistoryStore();
  const { logActivity } = useActivityLogStore();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = email.trim().toLowerCase();
    if (!clean) {
      setError('Please enter a target email address.');
      return;
    }
    if (!validateEmail(clean)) {
      setError('Invalid email syntax format. Example: analyst@apextech.example.com');
      return;
    }

    const generated = generateEmailLinks(clean);
    setLinks(generated);

    addSearchRecord({
      query: clean,
      module: 'Email Intelligence',
      type: 'Email',
      status: 'Completed',
      resultCount: generated.length,
      searchUrl: generated[0]?.url,
    });

    logActivity('Email Intelligence', `Generated email OSINT search links for: ${clean}`, 'Search');
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Email Public OSINT Intelligence</h3>
            <p className="text-xs text-slate-400">
              Discover public web exposure, code repository mentions, breach logs, and corporate email structures.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address (e.g. security@apextech.example.com)..."
              className="w-full h-10 px-4 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>
          <button
            type="submit"
            className="h-10 px-5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" /> Run Email Intel
          </button>
        </form>
      </GlassCard>

      {links.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Public Email Exposure Resources ({links.length})
            </h4>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> No Private Database Harvesting
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
