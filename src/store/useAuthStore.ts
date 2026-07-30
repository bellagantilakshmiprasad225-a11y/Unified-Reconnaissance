import { create } from 'zustand';
import type { AuthUser, LoginData, SignUpData, ProfileUpdateData } from '../services/auth/authTypes';
import { authService } from '../services/auth/authService';

interface AuthStoreState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkSession: () => Promise<void>;
  signIn: (data: LoginData) => Promise<AuthUser>;
  signUp: (data: SignUpData) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  updateProfile: (data: ProfileUpdateData) => Promise<AuthUser>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStoreState>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  checkSession: async () => {
    set({ isLoading: true, error: null });
    try {
      const activeUser = await authService.getCurrentSession();
      if (activeUser) {
        set({ user: activeUser, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  signIn: async (data: LoginData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signIn(data);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Unable to sign in. Please try again.' });
      throw err;
    }
  },

  signUp: async (data: SignUpData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.signUp(data);
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || 'Registration failed.' });
      throw err;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await authService.signOut();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    }
  },

  updateProfile: async (data: ProfileUpdateData) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error('No authenticated user.');

    set({ isLoading: true, error: null });
    try {
      const updated = await authService.updateProfile(currentUser.id, data);
      set({ user: updated, isLoading: false });
      return updated;
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  changePassword: async (oldPassword: string, newPassword: string) => {
    const currentUser = get().user;
    if (!currentUser) throw new Error('No authenticated user.');

    set({ isLoading: true, error: null });
    try {
      await authService.changePassword(currentUser.id, oldPassword, newPassword);
      set({ isLoading: false });
    } catch (err: any) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));
