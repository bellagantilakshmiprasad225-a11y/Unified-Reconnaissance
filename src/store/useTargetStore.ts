import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TargetProfile } from '../types';
import { INITIAL_TARGETS } from '../lib/initialDemoData';

interface TargetState {
  targets: TargetProfile[];
  activeTargetId: string | null;
  setActiveTarget: (id: string | null) => void;
  addTarget: (target: Omit<TargetProfile, 'id' | 'createdAt' | 'updatedAt'>) => TargetProfile;
  updateTarget: (id: string, partial: Partial<TargetProfile>) => void;
  deleteTarget: (id: string) => void;
  toggleFavoriteTarget: (id: string) => void;
  clearDemoTargets: () => void;
  restoreDemoTargets: () => void;
}

export const useTargetStore = create<TargetState>()(
  persist(
    (set, get) => ({
      targets: INITIAL_TARGETS,
      activeTargetId: null,
      setActiveTarget: (id) => set({ activeTargetId: id }),
      addTarget: (data) => {
        const now = new Date().toISOString();
        const newTarget: TargetProfile = {
          ...data,
          id: `TRG-${new Date().getFullYear()}-${String(get().targets.length + 1).padStart(3, '0')}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          targets: [newTarget, ...state.targets],
        }));
        return newTarget;
      },
      updateTarget: (id, partial) => {
        set((state) => ({
          targets: state.targets.map((trg) =>
            trg.id === id
              ? { ...trg, ...partial, updatedAt: new Date().toISOString() }
              : trg
          ),
        }));
      },
      deleteTarget: (id) => {
        set((state) => ({
          targets: state.targets.filter((trg) => trg.id !== id),
          activeTargetId: state.activeTargetId === id ? null : state.activeTargetId,
        }));
      },
      toggleFavoriteTarget: (id) => {
        set((state) => ({
          targets: state.targets.map((trg) =>
            trg.id === id ? { ...trg, isFavorite: !trg.isFavorite } : trg
          ),
        }));
      },
      clearDemoTargets: () => set({ targets: [], activeTargetId: null }),
      restoreDemoTargets: () => set({ targets: INITIAL_TARGETS }),
    }),
    {
      name: 'osint_targets_store',
    }
  )
);
