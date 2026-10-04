import { create } from 'zustand';

interface RouthState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useRouthStore = create<RouthState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
