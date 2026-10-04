import { useSettingsStore } from '@/store/useSettingsStore';

// State for enforcing Ad Policies
let lastInterstitialTime = 0;
let transitionCount = 0;
const INTERSTITIAL_COOLDOWN_MS = 180 * 1000; // 180 seconds
const TRANSITIONS_REQUIRED = 3;

export const AdPolicy = {
  shouldShowBanner: (): boolean => {
    const { isPro } = useSettingsStore.getState();
    return !isPro;
  },

  registerTransition: () => {
    transitionCount++;
  },

  canShowInterstitial: (): boolean => {
    const { isPro } = useSettingsStore.getState();
    if (isPro) return false;

    const now = Date.now();
    const timeSinceLast = now - lastInterstitialTime;

    if (timeSinceLast < INTERSTITIAL_COOLDOWN_MS) return false;
    if (transitionCount < TRANSITIONS_REQUIRED) return false;

    return true;
  },

  recordInterstitialShown: () => {
    lastInterstitialTime = Date.now();
    transitionCount = 0;
  }
};
