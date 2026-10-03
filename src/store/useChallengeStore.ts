import { create } from 'zustand';
import type { Challenge } from '@/core/challenges/content';

interface ChallengeState {
  activeChallenge: Challenge | null;
  isCompleted: boolean;
  setActiveChallenge: (challenge: Challenge) => void;
  clearChallenge: () => void;
  evaluateChallenge: (currentMetrics: Record<string, number>) => boolean;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  activeChallenge: null,
  isCompleted: false,
  
  setActiveChallenge: (challenge) => {
    set({ activeChallenge: challenge, isCompleted: false });
  },
  
  clearChallenge: () => {
    set({ activeChallenge: null, isCompleted: false });
  },
  
  evaluateChallenge: (currentMetrics) => {
    const { activeChallenge } = get();
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
      set({ isCompleted: true });
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
}));
