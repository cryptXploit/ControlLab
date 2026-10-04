import { create } from 'zustand';

interface TransferFunctionState {
  isDirty: boolean;
  markDirty: () => void;
  markClean: () => void;
}

export const useTransferFunctionStore = create<TransferFunctionState>((set) => ({
  isDirty: false,
  markDirty: () => set({ isDirty: true }),
  markClean: () => set({ isDirty: false }),
}));
