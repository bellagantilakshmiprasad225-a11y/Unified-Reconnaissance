import { create } from 'zustand';
import type { NotificationItem } from '../types';
import { INITIAL_NOTIFICATIONS } from '../lib/initialDemoData';

interface NotificationState {
  notifications: NotificationItem[];
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  notifications: INITIAL_NOTIFICATIONS,
  addNotification: (title, message, type = 'info') => {
    const item: NotificationItem = {
      id: `NTF-${Date.now()}`,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
    };
    set((state) => ({ notifications: [item, ...state.notifications] }));
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },
  clearNotifications: () => set({ notifications: [] }),
}));
