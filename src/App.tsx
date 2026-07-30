import { useState, useEffect } from 'react';
import { AppSidebar, navItems } from './components/layout/AppSidebar';
import { TopNavigation } from './components/layout/TopNavigation';

import { Dashboard } from './pages/Dashboard';
import { Investigations } from './pages/Investigations';
import { Targets } from './pages/Targets';
import { IntelligenceTools } from './pages/IntelligenceTools';
import { Evidence } from './pages/Evidence';
import { Reports } from './pages/Reports';
import { SearchHistory } from './pages/SearchHistory';
import { Favorites } from './pages/Favorites';
import { Settings } from './pages/Settings';
import { About } from './pages/About';

import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

import { InvestigationModal } from './components/investigations/InvestigationModal';
import { useInvestigationStore } from './store/useInvestigationStore';
import { useSettingsStore } from './store/useSettingsStore';
import { useNotificationStore } from './store/useNotificationStore';
import { useAuthStore } from './store/useAuthStore';
import type { SearchType } from './types';
import { Shield } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [authScreen, setAuthScreen] = useState<'login' | 'signup' | 'forgot' | 'reset'>('login');

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [isNewInvModalOpen, setIsNewInvModalOpen] = useState<boolean>(false);

  const { addInvestigation } = useInvestigationStore();
  const { settings } = useSettingsStore();
  const { addNotification } = useNotificationStore();

  const { isAuthenticated, isLoading, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [settings.theme]);

  const activeNavItem = navItems.find((item) => item.id === currentTab) || navItems[0];

  const handleGlobalSearch = (query: string, type: SearchType) => {
    addNotification('Search Initiated', `Global search executed for ${type}: "${query}"`, 'info');
    setCurrentTab('tools');
  };

  const handleCreateNewInv = (data: any) => {
    const created = addInvestigation(data);
    addNotification('Investigation Created', `Created case ${created.id}: ${created.name}`, 'success');
  };

  // Render Authentication loading splash screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-soc-darker text-slate-100 flex flex-col items-center justify-center p-4 font-mono">
        <div className="p-4 rounded-2xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 mb-4 animate-bounce">
          <Shield className="w-10 h-10" />
        </div>
        <p className="text-sm font-bold text-white tracking-widest uppercase">Initializing Security Session...</p>
        <p className="text-xs text-slate-400 mt-1">Unified Reconnaissance Dashboard</p>
      </div>
    );
  }

  // Protected Route Check: Unauthenticated users view Auth screens
  if (!isAuthenticated) {
    switch (authScreen) {
      case 'signup':
        return (
          <SignUp
            onNavigateLogin={() => setAuthScreen('login')}
            onSuccess={() => setCurrentTab('dashboard')}
          />
        );
      case 'forgot':
        return <ForgotPassword onNavigateLogin={() => setAuthScreen('login')} />;
      case 'reset':
        return <ResetPassword onNavigateLogin={() => setAuthScreen('login')} />;
      case 'login':
      default:
        return (
          <Login
            onNavigateSignUp={() => setAuthScreen('signup')}
            onNavigateForgotPassword={() => setAuthScreen('forgot')}
            onSuccess={() => setCurrentTab('dashboard')}
          />
        );
    }
  }

  // Authenticated App Workspace
  const renderPageContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewInvestigation={() => setIsNewInvModalOpen(true)}
            onGlobalSearch={handleGlobalSearch}
          />
        );
      case 'investigations':
        return <Investigations />;
      case 'targets':
        return <Targets />;
      case 'tools':
        return <IntelligenceTools />;
      case 'evidence':
        return <Evidence />;
      case 'reports':
        return <Reports />;
      case 'history':
        return <SearchHistory />;
      case 'favorites':
        return <Favorites />;
      case 'settings':
        return <Settings />;
      case 'about':
        return <About />;
      default:
        return (
          <Dashboard
            onNavigate={(tab) => setCurrentTab(tab)}
            onOpenNewInvestigation={() => setIsNewInvModalOpen(true)}
            onGlobalSearch={handleGlobalSearch}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-soc-dark text-slate-100 flex font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Sidebar Navigation */}
      <AppSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopNavigation
          pageTitle={activeNavItem.label}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
          onGlobalSearch={handleGlobalSearch}
          onNavigateTab={(tab) => setCurrentTab(tab)}
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderPageContent()}
        </main>
      </div>

      {/* Quick Create Investigation Modal */}
      <InvestigationModal
        isOpen={isNewInvModalOpen}
        onClose={() => setIsNewInvModalOpen(false)}
        onSave={handleCreateNewInv}
      />
    </div>
  );
}

export default App;
