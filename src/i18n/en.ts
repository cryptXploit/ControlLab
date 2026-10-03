export const en = {
  'nav.home': 'Home',
  'nav.labs': 'Labs',
  'nav.projects': 'My Labs',
  'nav.settings': 'Settings',
  'home.greeting.morning': 'Good morning, Engineer.',
  'home.greeting.afternoon': 'Good afternoon, Engineer.',
  'home.greeting.evening': 'Good evening, Engineer.',
  'home.subtitle': 'Welcome back to ControlLab.',
  'home.quickLabs': 'Quick Labs',
  'home.practice': 'Practice & Challenges',
  'home.recent': 'Recent Experiments',
  'home.noRecent': 'No recent experiments.',
  'settings.title': 'Settings',
  'settings.subtitle': 'Manage your preferences, offline data, and lab infrastructure.',
  'settings.language': 'Language / ভাষা',
  'settings.language.en': 'English',
  'settings.language.bn': 'বাংলা (Bengali)'
} as const;

export type TranslationKey = keyof typeof en;
