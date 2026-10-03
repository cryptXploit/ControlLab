import { useSettingsStore } from '@/store/useSettingsStore';

export function shouldShowAd(context: string): boolean {
  console.log(`[AdPolicy] Evaluating for context: ${context}`);
  const { isPro } = useSettingsStore.getState();
  return !isPro;
}
