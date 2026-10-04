import { create } from 'zustand';

interface SignalState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useSignalStore = create<SignalState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
