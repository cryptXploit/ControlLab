import { create } from 'zustand';

interface LeadLagState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useLeadLagStore = create<LeadLagState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
