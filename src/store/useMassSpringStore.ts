import { create } from 'zustand';

interface MassSpringState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useMassSpringStore = create<MassSpringState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
