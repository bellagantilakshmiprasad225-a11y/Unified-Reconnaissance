import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings } from '../types';
import { INITIAL_SETTINGS } from '../lib/initialDemoData';

interface SettingsState {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: INITIAL_SETTINGS,
      updateSettings: (partial) =>
        set((state) => ({
          settings: { ...state.settings, ...partial },
        })),
      resetSettings: () => set({ settings: INITIAL_SETTINGS }),
    }),
    {
      name: 'osint_settings_store',
    }
  )
);
