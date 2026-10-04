import { Capacitor } from '@capacitor/core';
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';
import { AdPolicy } from './AdPolicy';

export const TEST_AD_UNITS = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
};

// State
let isInitialized = false;
let isBannerVisible = false;

export const AdService = {
  async initialize(): Promise<void> {
    if (!Capacitor.isNativePlatform()) {
      return; // Fallback gracefully on Web
    }
    
    if (isInitialized) return;
    
    try {
      await AdMob.initialize({
        testingDevices: ['YOUR_TEST_DEVICE_ID'], // Highly recommended to use test devices
        initializeForTesting: true, // Forces test ads and bypasses restrictions during dev
      });
      isInitialized = true;
    } catch (e) {
      console.warn('[AdService] Failed to initialize AdMob', e);
    }
  },

  async showBanner(): Promise<void> {
    if (!isInitialized) await this.initialize();
    if (!AdPolicy.shouldShowBanner()) return;
    if (isBannerVisible) return;

    try {
      await AdMob.showBanner({
        adId: TEST_AD_UNITS.BANNER,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.BOTTOM_CENTER,
        margin: 60, // Floats just above the h-14 (56px) BottomNav
        isTesting: true,
      });
      isBannerVisible = true;
    } catch (e) {
      console.warn('[AdService] Failed to show banner', e);
    }
  },

  async hideBanner(): Promise<void> {
    if (!isInitialized || !isBannerVisible) return;
    try {
      await AdMob.hideBanner();
      isBannerVisible = false;
    } catch (e) {
      console.warn('[AdService] Failed to hide banner', e);
    }
  },

  async showInterstitial(context?: string): Promise<void> {
    if (!isInitialized) await this.initialize();
    if (!AdPolicy.canShowInterstitial()) return;

    try {
      // Pre-load
      await AdMob.prepareInterstitial({
        adId: TEST_AD_UNITS.INTERSTITIAL,
        isTesting: true,
      });

      // Show
      await AdMob.showInterstitial();
      AdPolicy.recordInterstitialShown();
      
    } catch (e) {
      console.warn(`[AdService] Failed to show interstitial [Context: ${context}]`, e);
    }
  }
};
