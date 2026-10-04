import { create } from 'zustand';

interface AntiWindupState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useAntiWindupStore = create<AntiWindupState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
