import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SearchRecord } from '../types';
import { INITIAL_SEARCH_HISTORY } from '../lib/initialDemoData';

interface SearchHistoryState {
  history: SearchRecord[];
  addSearchRecord: (record: Omit<SearchRecord, 'id' | 'timestamp'>) => SearchRecord;
  deleteSearchRecord: (id: string) => void;
  clearHistory: () => void;
  restoreDemoHistory: () => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: INITIAL_SEARCH_HISTORY,
      addSearchRecord: (data) => {
        const newRecord: SearchRecord = {
          ...data,
          id: `SRC-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          history: [newRecord, ...state.history],
        }));
        return newRecord;
      },
      deleteSearchRecord: (id) => {
        set((state) => ({
          history: state.history.filter((rec) => rec.id !== id),
        }));
      },
      clearHistory: () => set({ history: [] }),
      restoreDemoHistory: () => set({ history: INITIAL_SEARCH_HISTORY }),
    }),
    {
      name: 'osint_search_history_store',
    }
  )
);
