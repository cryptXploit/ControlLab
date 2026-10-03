import { useSettingsStore } from '@/store/useSettingsStore';

export const NotificationService = {
  async schedulePracticeReminder(timeOffsetMinutes: number): Promise<void> {
    const { notificationsEnabled } = useSettingsStore.getState();

    if (!notificationsEnabled) {
      console.log('[NotificationService] Notifications disabled by user.');
      return;
    }

    console.log(`[NotificationService] Scheduling local practice reminder for ${timeOffsetMinutes} minutes from now.`);
    
    // Web mock for testing
    if (typeof window !== 'undefined') {
      window.alert(`Mock Notification Scheduled (${timeOffsetMinutes}m)`);
    }
  }
};
