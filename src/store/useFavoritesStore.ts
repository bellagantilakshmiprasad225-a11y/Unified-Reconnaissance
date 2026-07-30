import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FavoriteItem } from '../types';
import { INITIAL_FAVORITES } from '../lib/initialDemoData';

interface FavoritesState {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'createdAt'>) => void;
  removeFavorite: (id: string) => void;
  removeByTargetId: (targetId: string) => void;
  isFavorite: (targetId: string) => boolean;
  clearFavorites: () => void;
  restoreFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: INITIAL_FAVORITES,
      addFavorite: (data) => {
        if (get().isFavorite(data.targetId)) return;
        const newItem: FavoriteItem = {
          ...data,
          id: `FAV-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ favorites: [newItem, ...state.favorites] }));
      },
      removeFavorite: (id) => {
        set((state) => ({ favorites: state.favorites.filter((f) => f.id !== id) }));
      },
      removeByTargetId: (targetId) => {
        set((state) => ({ favorites: state.favorites.filter((f) => f.targetId !== targetId) }));
      },
      isFavorite: (targetId) => {
        return get().favorites.some((f) => f.targetId === targetId);
      },
      clearFavorites: () => set({ favorites: [] }),
      restoreFavorites: () => set({ favorites: INITIAL_FAVORITES }),
    }),
    {
      name: 'osint_favorites_store',
    }
  )
);
