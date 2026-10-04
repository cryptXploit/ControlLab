import { create } from 'zustand';

interface NyquistState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useNyquistStore = create<NyquistState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
