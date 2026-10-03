import { shouldShowAd } from './AdPolicy';

export const AdService = {
  async showInterstitial(context: string): Promise<void> {
    if (!shouldShowAd(context)) {
      console.log(`[AdService] Ad blocked by policy (User is Pro) - Context: ${context}`);
      return;
    }

    console.log(`[AdService] Showing Interstitial Ad for context: ${context}`);
    
    // In a real device, we would call AdMob.showInterstitial()
    // For Web/Vite simulation, we use a simple alert
    if (typeof window !== 'undefined') {
      window.alert(`Mock Interstitial Ad [Context: ${context}]`);
    }
  }
};
