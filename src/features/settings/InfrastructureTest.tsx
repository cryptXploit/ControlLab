import { useSettingsStore } from '@/store/useSettingsStore';
import { AdService } from '@/services/ads/AdService';
import { NotificationService } from '@/services/notifications/NotificationService';

export default function InfrastructureTest() {
  const { isPro, notificationsEnabled, togglePro, toggleNotifications } = useSettingsStore();

  const handleLabComplete = () => {
    AdService.showInterstitial('LAB_COMPLETE');
  };

  const handleSchedulePractice = () => {
    NotificationService.schedulePracticeReminder('Practice Time', 'Keep up the good work!');
  };

  return (
    <div className="bg-background-elevated border border-border-subtle p-8 rounded-xl shadow-lg max-w-2xl w-full text-center mt-8 mb-16">
      <h2 className="text-xl font-semibold mb-2">Infrastructure Test</h2>
      <p className="text-text-secondary mb-6">Phase P0.6: Native App Services (Ads & Notifications)</p>

      <div className="flex flex-col gap-6">
        <div className="flex justify-center gap-4">
          <button
            onClick={togglePro}
            className={`px-4 py-2 rounded-md border font-medium transition-colors ${
              isPro 
                ? 'bg-status-success text-white border-status-success' 
                : 'bg-background-surface text-text-primary border-border-strong hover:bg-background-base'
            }`}
          >
            {isPro ? 'Pro Active' : 'Enable Pro'}
          </button>

          <button
            onClick={toggleNotifications}
            className={`px-4 py-2 rounded-md border font-medium transition-colors ${
              notificationsEnabled 
                ? 'bg-accent-primary text-white border-accent-primary' 
                : 'bg-background-surface text-text-primary border-border-strong hover:bg-background-base'
            }`}
          >
            {notificationsEnabled ? 'Notifications ON' : 'Notifications OFF'}
          </button>
        </div>

        <div className="flex justify-center gap-4 border-t border-border-subtle pt-6 mt-2">
          <button
            onClick={handleLabComplete}
            className="px-6 py-2 bg-background-surface border border-border-strong text-text-primary rounded-md font-medium hover:bg-background-base transition-colors"
          >
            Complete Lab (Triggers Ad)
          </button>

          <button
            onClick={handleSchedulePractice}
            className="px-6 py-2 bg-background-surface border border-border-strong text-text-primary rounded-md font-medium hover:bg-background-base transition-colors"
          >
            Schedule Practice (60m)
          </button>
        </div>
      </div>
    </div>
  );
}
