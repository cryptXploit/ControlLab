import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Challenge } from '@/core/challenges/content';

interface ChallengeState {
  activeChallenge: Challenge | null;
  isCompleted: boolean;
  completedIds: string[];
  setActiveChallenge: (challenge: Challenge) => void;
  clearChallenge: () => void;
  evaluateChallenge: (currentMetrics: Record<string, number>) => boolean;
}

export const useChallengeStore = create<ChallengeState>()(
  persist(
    (set, get) => ({
      activeChallenge: null,
      isCompleted: false,
      completedIds: [],
      
      setActiveChallenge: (challenge) => {
        set({ activeChallenge: challenge, isCompleted: false });
      },
      
      clearChallenge: () => {
        set({ activeChallenge: null, isCompleted: false });
      },
      
      evaluateChallenge: (currentMetrics) => {
        const { activeChallenge, completedIds } = get();
        if (!activeChallenge) return false;

        let success = true;

        for (const [metricKey, target] of Object.entries(activeChallenge.targetMetrics)) {
          const val = currentMetrics[metricKey];
          if (val === undefined) {
            success = false;
            break;
          }
          if (target.max !== undefined && val > target.max) {
            success = false;
          }
          if (target.min !== undefined && val < target.min) {
            success = false;
          }
        }

        if (success) {
          const newCompleted = completedIds.includes(activeChallenge.id) 
            ? completedIds 
            : [...completedIds, activeChallenge.id];
            
          set({ isCompleted: true, completedIds: newCompleted });
          if (typeof window !== 'undefined' && window.navigator.vibrate) {
            window.navigator.vibrate([50, 50, 50]); // premium success haptic
          }
        } else {
          set({ isCompleted: false });
          if (typeof window !== 'undefined' && window.navigator.vibrate) {
            window.navigator.vibrate(20); // soft error haptic
          }
        }

        return success;
      }
    }),
    {
      name: 'controllab-challenges',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ completedIds: state.completedIds }) // Only persist completedIds
    }
  )
);
