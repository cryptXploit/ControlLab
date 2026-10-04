import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  isPro: boolean;
  notificationsEnabled: boolean;
  hapticsEnabled: boolean;
  togglePro: () => void;
  toggleNotifications: () => void;
  toggleHaptics: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isPro: false,
      notificationsEnabled: true,
      hapticsEnabled: true,
      togglePro: () => set((state) => ({ isPro: !state.isPro })),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
    }),
    {
      name: 'settings-storage',
    }
  )
);
