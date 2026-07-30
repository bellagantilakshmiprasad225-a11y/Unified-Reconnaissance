import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Evidence } from '../types';
import { INITIAL_EVIDENCE } from '../lib/initialDemoData';
import { saveEvidenceFile, deleteEvidenceFile } from '../lib/indexedDB';

interface EvidenceState {
  evidenceList: Evidence[];
  addEvidence: (
    metadata: Omit<Evidence, 'id' | 'uploadDate'>,
    fileBlob?: File | Blob
  ) => Promise<Evidence>;
  updateEvidence: (id: string, partial: Partial<Evidence>) => void;
  deleteEvidence: (id: string) => Promise<void>;
  clearDemoEvidence: () => void;
  restoreDemoEvidence: () => void;
}

export const useEvidenceStore = create<EvidenceState>()(
  persist(
    (set) => ({
      evidenceList: INITIAL_EVIDENCE,
      addEvidence: async (data, fileBlob) => {
        const id = `EVD-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
        const uploadDate = new Date().toISOString();
        const newEvidence: Evidence = {
          ...data,
          id,
          uploadDate,
          blobKey: id,
        };

        if (fileBlob) {
          await saveEvidenceFile(id, fileBlob, data.fileName, data.fileType);
        }

        set((state) => ({
          evidenceList: [newEvidence, ...state.evidenceList],
        }));

        return newEvidence;
      },
      updateEvidence: (id, partial) => {
        set((state) => ({
          evidenceList: state.evidenceList.map((item) =>
            item.id === id ? { ...item, ...partial } : item
          ),
        }));
      },
      deleteEvidence: async (id) => {
        await deleteEvidenceFile(id);
        set((state) => ({
          evidenceList: state.evidenceList.filter((item) => item.id !== id),
        }));
      },
      clearDemoEvidence: () => set({ evidenceList: [] }),
      restoreDemoEvidence: () => set({ evidenceList: INITIAL_EVIDENCE }),
    }),
    {
      name: 'osint_evidence_store',
    }
  )
);
