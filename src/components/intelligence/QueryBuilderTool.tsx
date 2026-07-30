import React, { useState } from 'react';
import { Search, Copy, ExternalLink, Check } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useSearchHistoryStore } from '../../store/useSearchHistoryStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const QueryBuilderTool: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('');
  const [filetype, setFiletype] = useState('');
  const [phrase, setPhrase] = useState('');
  const [inTitle, setInTitle] = useState('');
  const [inUrl, setInUrl] = useState('');

  const [copied, setCopied] = useState(false);
  const { addSearchRecord } = useSearchHistoryStore();
  const { logActivity } = useActivityLogStore();

  const buildQuery = () => {
    const parts: string[] = [];
    if (domain.trim()) parts.push(`site:${domain.trim()}`);
    if (filetype.trim()) parts.push(`filetype:${filetype.trim()}`);
    if (inTitle.trim()) parts.push(`intitle:${inTitle.trim()}`);
    if (inUrl.trim()) parts.push(`inurl:${inUrl.trim()}`);
    if (phrase.trim()) parts.push(`"${phrase.trim()}"`);
    if (keyword.trim()) parts.push(keyword.trim());
    return parts.join(' ');
  };

  const currentQuery = buildQuery();

  const handleCopy = () => {
    if (!currentQuery) return;
    navigator.clipboard.writeText(currentQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenSearch = () => {
    if (!currentQuery) return;
    const url = `https://www.google.com/search?q=${encodeURIComponent(currentQuery)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    addSearchRecord({
      query: currentQuery,
      module: 'Advanced Query Builder',
      type: 'General',
      status: 'Completed',
      searchUrl: url,
    });

    logActivity('Advanced Query Builder', `Executed Google Dork query: ${currentQuery}`, 'Search');
  };

  const presetDorks = [
    { label: 'Public PDF Documents', fn: () => { setDomain('example.com'); setFiletype('pdf'); setKeyword(''); setPhrase(''); setInTitle(''); setInUrl(''); } },
    { label: 'Exposed Config Files', fn: () => { setDomain('example.com'); setFiletype('env'); setKeyword(''); setPhrase(''); setInTitle(''); setInUrl(''); } },
    { label: 'Directory Indexing', fn: () => { setDomain('example.com'); setInTitle('Index of'); setFiletype(''); setKeyword(''); setPhrase(''); setInUrl(''); } },
    { label: 'Public Login Pages', fn: () => { setDomain('example.com'); setInUrl('login'); setKeyword(''); setPhrase(''); setInTitle(''); setFiletype(''); } },
  ];

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Advanced OSINT Search Query Builder</h3>
            <p className="text-xs text-slate-400">
              Construct precise search engine operators (Google Dorks) for defensive public exposure audits.
            </p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-[10px] font-mono text-slate-400 uppercase">Quick Presets:</span>
          {presetDorks.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={p.fn}
              className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-[11px] font-mono text-cyan-300 transition-colors"
            >
              + {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Target Domain (site:)</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="example.com"
              className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">File Extension (filetype:)</label>
            <input
              type="text"
              value={filetype}
              onChange={(e) => setFiletype(e.target.value)}
              placeholder="pdf, docx, txt, env, log"
              className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Exact Phrase ("quote")</label>
            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="confidential policy"
              className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Page Title (intitle:)</label>
            <input
              type="text"
              value={inTitle}
              onChange={(e) => setInTitle(e.target.value)}
              placeholder="Index of /"
              className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">URL Path (inurl:)</label>
            <input
              type="text"
              value={inUrl}
              onChange={(e) => setInUrl(e.target.value)}
              placeholder="admin, login, api"
              className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">General Keyword</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="security audit"
              className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Output Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
            Generated OSINT Search Query:
          </span>
          <div className="p-3 rounded bg-slate-900 border border-slate-800 font-mono text-sm text-cyan-300 break-all mb-4">
            {currentQuery || <span className="text-slate-600 font-normal italic">Fill input fields above to construct search query...</span>}
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={handleCopy}
              disabled={!currentQuery}
              className="py-2 px-4 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied' : 'Copy Query'}
            </button>

            <button
              onClick={handleOpenSearch}
              disabled={!currentQuery}
              className="py-2 px-4 rounded bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors shadow-glow-cyan"
            >
              <ExternalLink className="w-4 h-4" /> Open Search Engine
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
