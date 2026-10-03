import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { useSettingsStore } from '@/store/useSettingsStore';

export class NotificationService {
  static async schedulePracticeReminder(title: string, body: string) {
    const { notificationsEnabled } = useSettingsStore.getState();
    if (!notificationsEnabled) return;

    if (Capacitor.isNativePlatform()) {
      try {
        const permStatus = await LocalNotifications.checkPermissions();
        if (permStatus.display !== 'granted') {
          const requested = await LocalNotifications.requestPermissions();
          if (requested.display !== 'granted') return;
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
      } catch (e) {
        console.error('Notification failed:', e);
      }
    } else {
      console.log(`[Web Mock] Notification Scheduled: ${title} - ${body}`);
    }
  }
}
