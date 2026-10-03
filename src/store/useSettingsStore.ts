import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isPro: boolean;
  notificationsEnabled: boolean;
  togglePro: () => void;
  toggleNotifications: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isPro: false,
      notificationsEnabled: true,
      togglePro: () => set((state) => ({ isPro: !state.isPro })),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
    }),
    {
      name: 'settings-storage',
    }
  )
);
