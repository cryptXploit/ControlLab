import DataManagement from '@/features/settings/DataManagement';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTranslation, useLocaleStore } from '@/store/useLocaleStore';
import { HapticService } from '@/services/haptics/HapticService';
import { Sparkles, CheckCircle2, Globe, Bell, Monitor, Sun, Moon } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';
import { NotificationService } from '@/services/notifications/NotificationService';
import { useThemeStore } from '@/store/useThemeStore';
import { useToastStore } from '@/store/useToastStore';

export default function SettingsScreen() {
  const { isPro, togglePro, notificationsEnabled, toggleNotifications } = useSettingsStore();
  const { t } = useTranslation();
  const { locale, setLocale } = useLocaleStore();

  const handleUpgrade = () => {
    togglePro();
    HapticService.triggerSuccess();
  };

  const handleLanguageChange = (newLocale: 'en' | 'bn') => {
    setLocale(newLocale);
    HapticService.triggerSelection();
  };

  const { theme, setTheme } = useThemeStore();
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    HapticService.triggerSelection();
  };

  const handleToggleNotifications = async () => {
    toggleNotifications();
    HapticService.triggerSelection();
    if (!notificationsEnabled) { // Turning ON (state hasn't updated yet in this render tick)
      const success = await NotificationService.schedulePracticeReminder((t as any)('notification.practice.title'), (t as any)('notification.practice.body'));
      if (!success) {
        toggleNotifications(); // Revert
        useToastStore.getState().showToast((t as any)('settings.notification.denied'), 'error');
      }
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto pb-24 p-4">
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-text-primary">{(t as any)('settings.title')}</h1>
        <p className="text-text-secondary">{(t as any)('settings.subtitle')}</p>
      </div>

      <Card>
        <CardHeader title={(t as any)('settings.appearance')} />
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-accent-primary" />
            <h2 className="text-sm font-semibold text-text-primary">{(t as any)('settings.language')}</h2>
          </div>
          <div className="flex bg-bg-surface border border-border-strong rounded-lg p-1">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`flex-1 py-2 rounded-md font-medium transition-colors text-sm ${
                locale === 'en' 
                  ? 'bg-accent-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {(t as any)('settings.language.en')}
            </button>
            <button
              onClick={() => handleLanguageChange('bn')}
              className={`flex-1 py-2 rounded-md font-medium transition-colors text-sm ${
                locale === 'bn' 
                  ? 'bg-accent-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {(t as any)('settings.language.bn')}
            </button>
          </div>
          <div className="h-px w-full bg-border-subtle my-2" />
          <div className="flex items-center gap-2 mb-2">
            <Monitor className="w-5 h-5 text-accent-primary" />
            <h2 className="text-sm font-semibold text-text-primary">{(t as any)('settings.theme')}</h2>
          </div>
          <div className="flex bg-bg-surface border border-border-strong rounded-lg p-1">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
                theme === 'light' 
                  ? 'bg-accent-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Sun className="w-4 h-4" />
              {(t as any)('settings.theme.light')}
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
                theme === 'dark' 
                  ? 'bg-accent-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Moon className="w-4 h-4" />
              {(t as any)('settings.theme.dark')}
            </button>
            <button
              onClick={() => handleThemeChange('system')}
              className={`flex-1 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm ${
                theme === 'system' 
                  ? 'bg-accent-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Monitor className="w-4 h-4" />
              {(t as any)('settings.theme.system')}
            </button>
          </div>
        </div>
      </Card>

      {/* ControlLab Pro Entitlement Card */}
      <div className={`p-6 rounded-2xl border ${isPro ? 'bg-bg-surface-elevated border-status-success/30' : 'bg-gradient-to-br from-bg-surface-elevated to-bg-surface border-accent-primary'} shadow-sm relative overflow-hidden`}>
        {isPro && <div className="absolute top-0 right-0 w-32 h-32 bg-status-success/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />}
        {!isPro && <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />}
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary mb-1">
              ControlLab Pro {isPro && <CheckCircle2 className="w-5 h-5 text-status-success" />}
            </h2>
            <p className="text-text-secondary text-sm">
              {isPro ? 'Your premium license is active.' : 'Elevate your control systems engineering.'}
            </p>
          </div>
          {!isPro && <Sparkles className="w-6 h-6 text-accent-primary" />}
        </div>

        <ul className="flex flex-col gap-3 mb-6 text-sm text-text-primary relative z-10">
          <li className="flex items-center gap-3">
            <span className="text-accent-primary text-lg leading-none">✔</span> Ad-Free Experience
          </li>
          <li className="flex items-center gap-3">
            <span className="text-accent-primary text-lg leading-none">✔</span> Unlimited Saved Projects
          </li>
          <li className="flex items-center gap-3">
            <span className="text-accent-primary text-lg leading-none">✔</span> Advanced Future Labs
          </li>
        </ul>

        {!isPro ? (
          <button
            onClick={handleUpgrade}
            className="w-full py-3 bg-accent-primary text-white rounded-lg font-bold shadow-md hover:shadow-lg hover:opacity-95 transition-all active:scale-[0.98] relative z-10"
          >
            Unlock Pro
          </button>
        ) : (
          <div className="w-full py-3 bg-status-success/10 border border-status-success/20 text-status-success rounded-lg font-bold text-center relative z-10">
            Pro Active 🎉
          </div>
        )}
      </div>

      <Card>
        <CardHeader title={(t as any)('settings.notifications')} />
        <div className="p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-accent-primary" />
              <h2 className="text-sm font-semibold text-text-primary">{(t as any)('settings.practiceReminder')}</h2>
            </div>
            <button 
              onClick={handleToggleNotifications}
              className={`w-12 h-6 rounded-full transition-colors relative ${notificationsEnabled ? 'bg-accent-primary' : 'bg-bg-surface border border-border-strong'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 rounded-full transition-all ${notificationsEnabled ? 'bg-white right-0.5' : 'bg-text-muted left-0.5'}`} />
            </button>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title={(t as any)('settings.data')} />
        <div className="p-4 flex flex-col gap-6">
          <DataManagement />
        </div>
      </Card>
    </div>
  );
}
