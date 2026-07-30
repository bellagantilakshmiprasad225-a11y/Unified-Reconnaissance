import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Investigation, Finding } from '../types';
import { INITIAL_INVESTIGATIONS, INITIAL_FINDINGS } from '../lib/initialDemoData';

interface InvestigationState {
  investigations: Investigation[];
  findings: Finding[];
  activeInvestigationId: string | null;
  setActiveInvestigation: (id: string | null) => void;
  addInvestigation: (inv: Omit<Investigation, 'id' | 'createdAt' | 'updatedAt'>) => Investigation;
  updateInvestigation: (id: string, partial: Partial<Investigation>) => void;
  deleteInvestigation: (id: string) => void;
  duplicateInvestigation: (id: string) => void;
  addFinding: (finding: Omit<Finding, 'id' | 'createdAt'>) => Finding;
  deleteFinding: (id: string) => void;
  clearDemoInvestigations: () => void;
  restoreDemoInvestigations: () => void;
}

export const useInvestigationStore = create<InvestigationState>()(
  persist(
    (set, get) => ({
      investigations: INITIAL_INVESTIGATIONS,
      findings: INITIAL_FINDINGS,
      activeInvestigationId: null,
      setActiveInvestigation: (id) => set({ activeInvestigationId: id }),
      addInvestigation: (data) => {
        const now = new Date().toISOString();
        const newInv: Investigation = {
          ...data,
          id: `INV-${new Date().getFullYear()}-${String(get().investigations.length + 1).padStart(3, '0')}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          investigations: [newInv, ...state.investigations],
        }));
        return newInv;
      },
      updateInvestigation: (id, partial) => {
        set((state) => ({
          investigations: state.investigations.map((inv) =>
            inv.id === id
              ? { ...inv, ...partial, updatedAt: new Date().toISOString() }
              : inv
          ),
        }));
      },
      deleteInvestigation: (id) => {
        set((state) => ({
          investigations: state.investigations.filter((inv) => inv.id !== id),
          findings: state.findings.filter((f) => f.investigationId !== id),
          activeInvestigationId: state.activeInvestigationId === id ? null : state.activeInvestigationId,
        }));
      },
      duplicateInvestigation: (id) => {
        const target = get().investigations.find((inv) => inv.id === id);
        if (!target) return;
        const now = new Date().toISOString();
        const dup: Investigation = {
          ...target,
          id: `INV-${new Date().getFullYear()}-${String(get().investigations.length + 1).padStart(3, '0')}`,
          name: `${target.name} (Copy)`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          investigations: [dup, ...state.investigations],
        }));
      },
      addFinding: (data) => {
        const newFinding: Finding = {
          ...data,
          id: `FND-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          findings: [newFinding, ...state.findings],
        }));
        return newFinding;
      },
      deleteFinding: (id) => {
        set((state) => ({
          findings: state.findings.filter((f) => f.id !== id),
        }));
      },
      clearDemoInvestigations: () => {
        set({
          investigations: [],
          findings: [],
          activeInvestigationId: null,
        });
      },
      restoreDemoInvestigations: () => {
        set({
          investigations: INITIAL_INVESTIGATIONS,
          findings: INITIAL_FINDINGS,
        });
      },
    }),
    {
      name: 'osint_investigations_store',
    }
  )
);
