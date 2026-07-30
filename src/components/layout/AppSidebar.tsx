import React from 'react';
import {
  LayoutDashboard,
  FolderLock,
  UserCheck,
  Wrench,
  FileCheck,
  FileSpreadsheet,
  History,
  Bookmark,
  Settings,
  Info,
  ChevronLeft,
  ChevronRight,
  Shield,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { useEvidenceStore } from '../../store/useEvidenceStore';
import { useTargetStore } from '../../store/useTargetStore';

interface AppSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'investigations', label: 'Investigation Workspace', icon: FolderLock, badgeKey: 'investigations' },
  { id: 'targets', label: 'Target Profiles', icon: UserCheck, badgeKey: 'targets' },
  { id: 'tools', label: 'Intelligence Tools', icon: Wrench },
  { id: 'evidence', label: 'Evidence Manager', icon: FileCheck, badgeKey: 'evidence' },
  { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
  { id: 'history', label: 'Search History', icon: History },
  { id: 'favorites', label: 'Favorites', icon: Bookmark },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({
  currentTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { investigations } = useInvestigationStore();
  const { targets } = useTargetStore();
  const { evidenceList } = useEvidenceStore();

  const getBadge = (key?: string) => {
    if (key === 'investigations') return investigations.length;
    if (key === 'targets') return targets.length;
    if (key === 'evidence') return evidenceList.length;
    return null;
  };

  const content = (
    <div className="flex flex-col h-full bg-soc-darker border-r border-slate-800 text-slate-300">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="p-2 rounded-lg bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 shrink-0">
            <Shield className="w-6 h-6 animate-pulse" />
          </div>
          {!isCollapsed && (
            <div className="truncate">
              <h1 className="text-sm font-bold tracking-tight text-white font-mono leading-none">UNIFIED RECON</h1>
              <p className="text-[10px] text-cyan-400 font-mono mt-1 uppercase">Enterprise OSINT</p>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseMobile}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const badge = getBadge(item.badgeKey);

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                onCloseMobile();
              }}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-mono font-medium transition-all group relative',
                isActive
                  ? 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-400')} />
              {!isCollapsed && <span className="truncate">{item.label}</span>}

              {badge !== null && badge > 0 && (
                <span
                  className={cn(
                    'ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full font-mono',
                    isActive ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  )}
                >
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-center">
          <div className="text-[11px] font-mono text-slate-400">Analyst: Lakshmiprasad</div>
          <div className="text-[9px] font-mono text-cyan-400/80 mt-0.5">Defensive OSINT v1.0</div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:block h-screen sticky top-0 transition-all duration-300 z-30',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onCloseMobile} />
          <div className="relative w-64 max-w-xs h-full bg-soc-darker shadow-2xl z-50">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
