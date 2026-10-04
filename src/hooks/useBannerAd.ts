import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { AdService } from '@/services/ads/AdService';
import { AdPolicy } from '@/services/ads/AdPolicy';

export function useBannerAd() {
  const [location] = useLocation();

  useEffect(() => {
    // We only want banners on main discovery pages
    const isMainPage = location === '/' || 
                       location === '/labs' || 
                       location === '/projects' || 
                       location === '/practice';

    // We do NOT want banners inside actual simulators (/labs/:id)
    if (isMainPage && AdPolicy.shouldShowBanner()) {
      AdService.showBanner();
    } else {
      AdService.hideBanner();
    }

    return () => {
      // Cleanup happens naturally via hideBanner when navigating away, 
      // but we don't automatically hide on unmount because the hook 
      // is meant to run globally at the App level to monitor route changes.
    };
  }, [location]);
}
