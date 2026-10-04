import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { useSettingsStore } from '@/store/useSettingsStore';

export const HapticService = {
  triggerSelection: async () => {
    if (!useSettingsStore.getState().hapticsEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (e) {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(10);
      }
    }
  },
  triggerSuccess: async () => {
    if (!useSettingsStore.getState().hapticsEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
      setTimeout(async () => {
        await Haptics.impact({ style: ImpactStyle.Light });
      }, 100);
    } catch (e) {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([50, 50, 50]);
      }
    }
  },
  triggerWarning: async () => {
    if (!useSettingsStore.getState().hapticsEnabled) return;
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (e) {
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 100]);
      }
    }
  },
  
  initGlobalHaptics: () => {
    if (typeof window === 'undefined') return;
    
    if ((window as any).__hapticsInitialized) return;
    (window as any).__hapticsInitialized = true;

    window.addEventListener('click', (e) => {
      if (!useSettingsStore.getState().hapticsEnabled) return;
      
      const target = e.target as HTMLElement;
      
      // Do not fire on input/slider dragging, let SliderField handle its own boundary haptics
      if (target.tagName === 'INPUT') return;
      
      const clickable = target.closest('button, a, [role="button"]');
      if (!clickable) return;
      
      // If the element has a specific no-haptic override
      if (clickable.hasAttribute('data-no-haptic')) return;

      const text = clickable.textContent?.toLowerCase() || '';
      const classes = clickable.className || '';
      
      const isDestructive = classes.includes('bg-status-error') || text.includes('delete') || text.includes('remove');
      const isSuccess = classes.includes('bg-status-success') || text.includes('save') || text.includes('confirm');
      const isMajor = classes.includes('bg-accent-primary') && (text.includes('start') || text.includes('pro'));
      
      if (isDestructive) {
         HapticService.triggerWarning();
      } else if (isSuccess) {
         HapticService.triggerSuccess();
      } else if (isMajor) {
         HapticService.triggerSuccess(); // Use medium for major actions
      } else {
         HapticService.triggerSelection();
      }
    }, { capture: true }); // Capture phase ensures we catch it before React stops propagation
  }
};
