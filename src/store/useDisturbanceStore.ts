import { create } from 'zustand';

interface DisturbanceState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useDisturbanceStore = create<DisturbanceState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
