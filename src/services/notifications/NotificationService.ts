import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { useSettingsStore } from '@/store/useSettingsStore';

export class NotificationService {
  static async schedulePracticeReminder(title: string, body: string): Promise<boolean> {
    const { notificationsEnabled } = useSettingsStore.getState();
    if (!notificationsEnabled) return false;

    if (Capacitor.isNativePlatform()) {
      try {
        const permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display !== 'granted') {
          const requested = await LocalNotifications.requestPermissions();
          if (requested.display !== 'granted') return false;
        }

        // Cancel previous practice reminders to prevent spam
        await LocalNotifications.cancel({ notifications: [{ id: 1 }] });

        // Schedule for 24 hours from now
        await LocalNotifications.schedule({
          notifications: [
            {
              title,
              body,
              id: 1,
              schedule: { at: new Date(Date.now() + 1000 * 60 * 60 * 24) },
              sound: undefined,
            }
          ]
        });
        return true;
      } catch (e) {
        console.error('Notification failed:', e);
        return false;
      }
    } else {
      console.log(`[Web Mock] Notification Scheduled: ${title} - ${body}`);
      return true;
    }
  }
}
