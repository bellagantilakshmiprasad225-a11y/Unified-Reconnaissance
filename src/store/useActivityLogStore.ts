import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActivityLog } from '../types';
import { INITIAL_ACTIVITY } from '../lib/initialDemoData';

interface ActivityLogState {
  activities: ActivityLog[];
  logActivity: (action: string, details: string, category?: ActivityLog['category']) => void;
  clearActivity: () => void;
}

export const useActivityLogStore = create<ActivityLogState>()(
  persist(
    (set) => ({
      activities: INITIAL_ACTIVITY,
      logActivity: (action, details, category = 'System') => {
        const item: ActivityLog = {
          id: `ACT-${Date.now()}`,
          action,
          details,
          timestamp: new Date().toISOString(),
          category,
        };
        set((state) => ({ activities: [item, ...state.activities] }));
      },
      clearActivity: () => set({ activities: [] }),
    }),
    {
      name: 'osint_activity_store',
    }
  )
);
