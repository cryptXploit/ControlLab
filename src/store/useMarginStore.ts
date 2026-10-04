import { create } from 'zustand';

interface MarginState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useMarginStore = create<MarginState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
