import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note } from '../types';
import { INITIAL_NOTES } from '../lib/initialDemoData';

interface NotesState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, partial: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  clearNotes: () => void;
  restoreNotes: () => void;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      notes: INITIAL_NOTES,
      addNote: (data) => {
        const now = new Date().toISOString();
        const newNote: Note = {
          ...data,
          id: `NTE-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
        return newNote;
      },
      updateNote: (id, partial) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...partial, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },
      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
      },
      clearNotes: () => set({ notes: [] }),
      restoreNotes: () => set({ notes: INITIAL_NOTES }),
    }),
    {
      name: 'osint_notes_store',
    }
  )
);
