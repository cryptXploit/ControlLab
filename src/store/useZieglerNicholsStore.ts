import { create } from 'zustand';

interface ZieglerNicholsState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useZieglerNicholsStore = create<ZieglerNicholsState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
