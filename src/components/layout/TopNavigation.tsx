import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Menu,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  User,
  LogOut,
  Settings as SettingsIcon,
  HelpCircle
} from 'lucide-react';
import { detectQueryType } from '../../lib/utils';
import type { SearchType } from '../../types';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';
import { UserProfileModal } from '../auth/UserProfileModal';

interface TopNavigationProps {
  pageTitle: string;
  onOpenMobileMenu: () => void;
  onGlobalSearch: (query: string, type: SearchType) => void;
  onNavigateTab?: (tab: string) => void;
}

export const TopNavigation: React.FC<TopNavigationProps> = ({
  pageTitle,
  onOpenMobileMenu,
  onGlobalSearch,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [detectedType, setDetectedType] = useState<SearchType>('General');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const { notifications, markAllAsRead, addNotification } = useNotificationStore();
  const { settings, updateSettings } = useSettingsStore();
  const { user, signOut } = useAuthStore();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (val.trim()) {
      setDetectedType(detectQueryType(val));
    } else {
      setDetectedType('General');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onGlobalSearch(searchQuery.trim(), detectedType);
  };

  const toggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: next });
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  const handleLogout = async () => {
    setShowProfileMenu(false);
    await signOut();
    addNotification('Signed Out', 'You have been signed out of the Unified Reconnaissance Dashboard.', 'info');
  };

  const displayUser = user || {
    fullName: settings.analystName || 'Lakshmiprasad',
    role: settings.analystRole || 'Cyber Security Intern',
    organization: settings.analystOrg || 'Enterprise SOC',
    profileImage: undefined,
  };

  const initials = displayUser.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'LP';

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-soc-darker/90 backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-bold text-white font-mono truncate">{pageTitle}</h2>
            <p className="text-[10px] text-slate-400 font-mono hidden sm:block">Defensive OSINT Operations Workspace</p>
          </div>
        </div>

        {/* Center: Global Auto-Detecting Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden sm:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search domain, IP (1.1.1.1), email, company, @username..."
              className="w-full h-10 pl-10 pr-24 rounded-lg bg-slate-900/90 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/50 font-mono transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />

            {searchQuery.trim() && (
              <div className="absolute right-2 top-2 flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                  {detectedType}
                </span>
                <button
                  type="submit"
                  className="px-2 py-0.5 text-[10px] font-bold rounded bg-cyan-600 hover:bg-cyan-500 text-white font-mono"
                >
                  GO
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Right: Notifications, Theme & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Icon & Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-cyan-500 text-black text-[9px] font-bold font-mono rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-4 text-slate-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" /> Notifications
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={markAllAsRead}
                      className="text-[10px] font-mono text-cyan-400 hover:underline"
                    >
                      Mark Read
                    </button>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-4 font-mono">No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg border text-xs ${
                          n.read ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-800/80 border-slate-700 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-mono font-semibold text-[11px] mb-1">
                          {n.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                          {n.type === 'warning' && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                          {n.type === 'info' && <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          <span>{n.title}</span>
                        </div>
                        <p className="text-[11px] leading-tight">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {settings.theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
          </button>

          {/* Analyst Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2.5 p-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 transition-all"
            >
              {displayUser.profileImage ? (
                <img src={displayUser.profileImage} alt="Profile" className="w-7 h-7 rounded-full object-cover border border-cyan-500/50" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300 text-xs font-bold font-mono">
                  {initials}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold font-mono text-white leading-none">{displayUser.fullName}</p>
                <p className="text-[9px] font-mono text-slate-400 mt-0.5">{displayUser.role}</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-2 text-slate-100 font-mono">
                <div className="p-2.5 border-b border-slate-800 mb-1">
                  <p className="text-xs font-bold text-white leading-tight">{displayUser.fullName}</p>
                  <p className="text-[10px] text-cyan-400">{displayUser.role}</p>
                  {displayUser.organization && (
                    <p className="text-[10px] text-slate-400 truncate">{displayUser.organization}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => { setShowProfileMenu(false); setShowProfileModal(true); }}
                    className="w-full px-3 py-2 text-xs text-left rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" /> My Profile & Security
                  </button>

                  {onNavigateTab && (
                    <>
                      <button
                        onClick={() => { setShowProfileMenu(false); onNavigateTab('settings'); }}
                        className="w-full px-3 py-2 text-xs text-left rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <SettingsIcon className="w-3.5 h-3.5 text-slate-400" /> Platform Settings
                      </button>

                      <button
                        onClick={() => { setShowProfileMenu(false); onNavigateTab('about'); }}
                        className="w-full px-3 py-2 text-xs text-left rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> About & Security
                      </button>
                    </>
                  )}

                  <div className="border-t border-slate-800 pt-1 mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full px-3 py-2 text-xs text-left rounded-lg text-rose-400 hover:bg-rose-950/60 hover:text-rose-300 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};
