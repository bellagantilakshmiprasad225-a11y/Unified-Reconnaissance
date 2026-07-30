import React, { useState } from 'react';
import { History, Search, ExternalLink, Trash2, Download } from 'lucide-react';
import { useSearchHistoryStore } from '../store/useSearchHistoryStore';
import { GlassCard } from '../components/common/GlassCard';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatDate } from '../lib/utils';
import { useNotificationStore } from '../store/useNotificationStore';
import { useActivityLogStore } from '../store/useActivityLogStore';

export const SearchHistory: React.FC = () => {
  const { history, deleteSearchRecord, clearHistory } = useSearchHistoryStore();
  const { addNotification } = useNotificationStore();
  const { logActivity } = useActivityLogStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = history.filter((rec) => {
    const matchesQuery =
      rec.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.module.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesModule = moduleFilter === 'ALL' || rec.module === moduleFilter;
    return matchesQuery && matchesModule;
  });

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ['ID', 'Query', 'Module', 'Type', 'Timestamp', 'Status', 'SearchURL'];
    const rows = history.map((r) => [
      r.id,
      `"${r.query.replace(/"/g, '""')}"`,
      r.module,
      r.type,
      r.timestamp,
      r.status,
      r.searchUrl || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `OSINT_Search_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addNotification('CSV Exported', 'Search history exported to CSV file.', 'info');
    logActivity('Search Exported', 'Exported search history to CSV', 'Search');
  };

  const handleClearHistory = () => {
    clearHistory();
    addNotification('History Cleared', 'Search history log cleared.', 'warning');
    logActivity('History Cleared', 'Cleared search history log', 'Search');
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" /> OSINT Search History Log
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Locally stored log of external query lookups, modules, and search URL links.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            disabled={history.length === 0}
            className="h-9 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-mono font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button
            onClick={() => setShowClearConfirm(true)}
            disabled={history.length === 0}
            className="h-9 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900 disabled:opacity-50 text-rose-300 text-xs font-mono font-semibold flex items-center gap-1.5 border border-rose-800/60 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Log
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by query or tool module..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={moduleFilter}
          onChange={(e) => setModuleFilter(e.target.value)}
          className="h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
        >
          <option value="ALL">All Modules</option>
          <option value="WHOIS Lookup">WHOIS Lookup</option>
          <option value="DNS Lookup">DNS Lookup</option>
          <option value="IP Information">IP Information</option>
          <option value="Email Intelligence">Email Intelligence</option>
          <option value="Advanced Query Builder">Advanced Query Builder</option>
        </select>
      </div>

      {/* History Table */}
      {filteredHistory.length === 0 ? (
        <EmptyState
          title="No search history recorded"
          description="Executed intelligence tool queries will appear here automatically."
          icon={History}
        />
      ) : (
        <GlassCard className="overflow-x-auto p-0 border-slate-800">
          <table className="w-full text-left font-mono text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Query</th>
                <th className="p-3">Module</th>
                <th className="p-3">Type</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredHistory.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-900/60 transition-colors">
                  <td className="p-3 font-bold text-white max-w-xs truncate">{rec.query}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800/60 text-[10px]">
                      {rec.module}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{rec.type}</td>
                  <td className="p-3 text-slate-400">{formatDate(rec.timestamp)}</td>
                  <td className="p-3">
                    <span className="text-emerald-400 text-[10px]">● {rec.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {rec.searchUrl && (
                        <a
                          href={rec.searchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded hover:bg-slate-800 text-cyan-400"
                          title="Open Search URL"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => deleteSearchRecord(rec.id)}
                        className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-rose-400"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}

      {/* Confirm Clear */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear Search History"
        message="Are you sure you want to clear all recorded search history entries?"
        confirmLabel="Clear Log"
        isDestructive
        onConfirm={handleClearHistory}
        onClose={() => setShowClearConfirm(false)}
      />
    </div>
  );
};
