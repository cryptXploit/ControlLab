import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { en, type TranslationKey } from '@/i18n/en';
import { bn } from '@/i18n/bn';

type Locale = 'en' | 'bn';

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set) => ({
      locale: 'en',
      setLocale: (locale) => set({ locale }),
    }),
    {
      name: 'controllab-locale-storage',
    }
  )
);

export function useTranslation() {
  const { locale } = useLocaleStore();

  const t = (key: TranslationKey): string => {
    if (locale === 'bn') {
      return bn[key] || en[key];
    }
    return en[key];
  };

  return { t, locale };
}
