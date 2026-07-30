import React from 'react';
import {
  FolderLock,
  Search,
  UserCheck,
  Bookmark,
  Plus
} from 'lucide-react';
import { StatCard } from '../components/common/StatCard';
import { DashboardCharts } from '../components/dashboard/DashboardCharts';
import { RecentInvestigationsWidget } from '../components/dashboard/RecentInvestigationsWidget';
import { RecentSearchesWidget } from '../components/dashboard/RecentSearchesWidget';
import { FavoriteToolsWidget } from '../components/dashboard/FavoriteToolsWidget';
import { ActivityFeedWidget } from '../components/dashboard/ActivityFeedWidget';
import { QuickNotesWidget } from '../components/dashboard/QuickNotesWidget';
import { SystemStatusWidget } from '../components/dashboard/SystemStatusWidget';

import { useInvestigationStore } from '../store/useInvestigationStore';
import { useTargetStore } from '../store/useTargetStore';
import { useSearchHistoryStore } from '../store/useSearchHistoryStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import type { SearchType } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onOpenNewInvestigation: () => void;
  onGlobalSearch: (query: string, type: SearchType) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenNewInvestigation,
}) => {
  const { investigations } = useInvestigationStore();
  const { targets } = useTargetStore();
  const { history } = useSearchHistoryStore();
  const { favorites } = useFavoritesStore();

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-soc-darker via-soc-card to-slate-900 border border-slate-800 shadow-soc">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white font-mono tracking-tight flex items-center gap-3">
            Unified Reconnaissance Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Enterprise OSINT & Investigation Workspace — Authorized Defensive Security Platform
          </p>
        </div>

        <button
          onClick={onOpenNewInvestigation}
          className="h-10 px-5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-cyan shrink-0"
        >
          <Plus className="w-4 h-4" /> New Investigation
        </button>
      </div>

      {/* Top 4 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Investigations"
          value={investigations.length}
          change="+2 this week"
          icon={FolderLock}
          iconColor="text-cyan-400"
          glow="cyan"
          onClick={() => onNavigate('investigations')}
        />
        <StatCard
          title="Total Searches Logged"
          value={history.length}
          change="+14 today"
          icon={Search}
          iconColor="text-blue-400"
          onClick={() => onNavigate('history')}
        />
        <StatCard
          title="Saved Targets"
          value={targets.length}
          change="Target catalog"
          icon={UserCheck}
          iconColor="text-emerald-400"
          onClick={() => onNavigate('targets')}
        />
        <StatCard
          title="Favorite Tools & Items"
          value={favorites.length}
          change="Quick access"
          icon={Bookmark}
          iconColor="text-amber-400"
          onClick={() => onNavigate('favorites')}
        />
      </div>

      {/* Analytics Charts */}
      <DashboardCharts />

      {/* Widget Hub: 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RecentInvestigationsWidget onSelect={() => onNavigate('investigations')} />
        <RecentSearchesWidget onSelect={() => onNavigate('history')} />
        <FavoriteToolsWidget onSelectTool={(t) => onNavigate(t === 'tools' ? 'tools' : 'tools')} />
        <ActivityFeedWidget />
        <QuickNotesWidget />
        <SystemStatusWidget />
      </div>
    </div>
  );
};
