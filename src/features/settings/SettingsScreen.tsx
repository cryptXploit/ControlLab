import DataManagement from '@/features/settings/DataManagement';
import InfrastructureTest from '@/features/settings/InfrastructureTest';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useTranslation, useLocaleStore } from '@/store/useLocaleStore';
import { HapticService } from '@/services/haptics/HapticService';
import { Sparkles, CheckCircle2, Globe } from 'lucide-react';
import { Card, CardHeader } from '@/components/ui/Card';

export default function SettingsScreen() {
  const { isPro, togglePro } = useSettingsStore();
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
        <CardHeader title={(t as any)('settings.data')} />
        <div className="p-4 flex flex-col gap-6">
          <DataManagement />
          <div className="border-t border-border-subtle pt-4">
            <InfrastructureTest />
          </div>
        </div>
      </Card>
    </div>
  );
}
