import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, RefreshCw, Trash2, Check } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useInvestigationStore } from '../store/useInvestigationStore';
import { useTargetStore } from '../store/useTargetStore';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { useSearchHistoryStore } from '../store/useSearchHistoryStore';
import { useNotesStore } from '../store/useNotesStore';
import { clearAllIndexedDB } from '../lib/indexedDB';
import { GlassCard } from '../components/common/GlassCard';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useNotificationStore } from '../store/useNotificationStore';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useSettingsStore();
  const { clearDemoInvestigations, restoreDemoInvestigations } = useInvestigationStore();
  const { clearDemoTargets, restoreDemoTargets } = useTargetStore();
  const { clearDemoEvidence, restoreDemoEvidence } = useEvidenceStore();
  const { clearHistory, restoreDemoHistory } = useSearchHistoryStore();
  const { clearNotes, restoreNotes } = useNotesStore();

  const { addNotification } = useNotificationStore();

  const [analystName, setAnalystName] = useState(settings.analystName);
  const [analystRole, setAnalystRole] = useState(settings.analystRole);
  const [analystOrg, setAnalystOrg] = useState(settings.analystOrg);
  const [theme, setTheme] = useState(settings.theme);
  const [dateFormat, setDateFormat] = useState(settings.dateFormat);
  const [autoSave, setAutoSave] = useState(settings.autoSave);
  const [notifications, setNotificationsToggle] = useState(settings.notifications);

  const [saved, setSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      analystName,
      analystRole,
      analystOrg,
      theme,
      dateFormat,
      autoSave,
      notifications,
    });

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    setSaved(true);
    addNotification('Settings Saved', 'Analyst profile and system preferences updated.', 'success');
    setTimeout(() => setSaved(false), 2000);
  };

  const handleClearDemoData = async () => {
    clearDemoInvestigations();
    clearDemoTargets();
    clearDemoEvidence();
    clearHistory();
    clearNotes();
    await clearAllIndexedDB();

    addNotification('Demo Data Cleared', 'All demo records have been cleared from memory.', 'warning');
    setShowClearConfirm(false);
  };

  const handleRestoreDemoData = () => {
    restoreDemoInvestigations();
    restoreDemoTargets();
    restoreDemoEvidence();
    restoreDemoHistory();
    restoreNotes();

    addNotification('Demo Data Restored', 'Initial OSINT demo dataset restored.', 'success');
    setShowRestoreConfirm(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-cyan-400" /> Platform & Analyst Settings
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Configure analyst identity, theme preferences, report defaults, and demo data lifecycle.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Analyst Profile */}
        <GlassCard>
          <h3 className="text-sm font-bold text-white font-mono mb-4 uppercase tracking-wider text-cyan-400">
            Analyst Profile & Organization
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Analyst Full Name</label>
              <input
                type="text"
                value={analystName}
                onChange={(e) => setAnalystName(e.target.value)}
                className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Role / Designation</label>
              <input
                type="text"
                value={analystRole}
                onChange={(e) => setAnalystRole(e.target.value)}
                className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Organization / Lab</label>
              <input
                type="text"
                value={analystOrg}
                onChange={(e) => setAnalystOrg(e.target.value)}
                className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        </GlassCard>

        {/* Appearance & Preferences */}
        <GlassCard>
          <h3 className="text-sm font-bold text-white font-mono mb-4 uppercase tracking-wider text-cyan-400">
            Appearance & System Preferences
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Theme Mode</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="dark">Dark Mode (SOC Default)</option>
                <option value="light">Light Mode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Date Display Format</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value as any)}
                className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4 pt-3 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span className="text-xs font-mono text-slate-300">Enable Local Autosave</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotificationsToggle(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-cyan-500"
              />
              <span className="text-xs font-mono text-slate-300">Enable Toast Notifications</span>
            </label>
          </div>
        </GlassCard>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-glow-cyan transition-colors"
          >
            {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            {saved ? 'Preferences Saved' : 'Save Preferences'}
          </button>
        </div>
      </form>

      {/* Demo Data Management */}
      <GlassCard className="border-rose-900/50">
        <h3 className="text-sm font-bold text-white font-mono mb-2 uppercase tracking-wider text-rose-400">
          Demo Data & Reset Controls
        </h3>
        <p className="text-xs text-slate-400 font-mono mb-4">
          Manage sample initial dataset (Clear demo items or restore default realistic demo records).
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-mono font-semibold flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" /> Clear Demo Data
          </button>

          <button
            type="button"
            onClick={() => setShowRestoreConfirm(true)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono font-semibold flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" /> Restore Demo Data
          </button>
        </div>
      </GlassCard>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        title="Clear All Demo Data"
        message="Are you sure you want to clear all sample investigations, targets, evidence, and search logs?"
        confirmLabel="Clear Demo Data"
        isDestructive
        onConfirm={handleClearDemoData}
        onClose={() => setShowClearConfirm(false)}
      />

      <ConfirmDialog
        isOpen={showRestoreConfirm}
        title="Restore Default Demo Data"
        message="This will overwrite current stored demo records with the default realistic OSINT dataset."
        confirmLabel="Restore Data"
        onConfirm={handleRestoreDemoData}
        onClose={() => setShowRestoreConfirm(false)}
      />
    </div>
  );
};
