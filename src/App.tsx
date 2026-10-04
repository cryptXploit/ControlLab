import { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { AdService } from '@/services/ads/AdService';
import { AdPolicy } from '@/services/ads/AdPolicy';
import { useBannerAd } from '@/hooks/useBannerAd';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useFirstOrderStore } from '@/store/useFirstOrderStore';
import { useSecondOrderStore } from '@/store/useSecondOrderStore';
import { usePidStore } from '@/store/usePidStore';
import { useDCMotorStore } from '@/store/useDCMotorStore';
import { useTranslation } from '@/store/useLocaleStore';
import { useProjectStore } from '@/store/useProjectStore';

import HomeScreen from '@/features/home/HomeScreen';
import { LabsExplorer } from '@/features/labs/LabsExplorer';
import { LabHost } from '@/features/labs/LabHost';
import ProjectsScreen from '@/features/projects/ProjectsScreen';
import SettingsScreen from '@/features/settings/SettingsScreen';
import PracticeScreen from '@/features/practice/PracticeScreen';
import { Home, FlaskConical, Target, Folder, Settings } from 'lucide-react';
import { ToastContainer } from '@/components/ui/ToastContainer';

import { useNyquistStore } from '@/store/useNyquistStore';
import { useMarginStore } from '@/store/useMarginStore';
import { useDisturbanceStore } from '@/store/useDisturbanceStore';
import { useRouthStore } from '@/store/useRouthStore';
import { useAntiWindupStore } from '@/store/useAntiWindupStore';
import { useTransferFunctionStore } from '@/store/useTransferFunctionStore';
import { useMassSpringStore } from '@/store/useMassSpringStore';
import { useSignalStore } from '@/store/useSignalStore';
import { useLeadLagStore } from '@/store/useLeadLagStore';
import { useZieglerNicholsStore } from '@/store/useZieglerNicholsStore';

export default function App() {
  useBannerAd();
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const checkDirtyAndNavigate = (path: string) => {
    const isDirty = useFirstOrderStore.getState().isDirty || 
                    useSecondOrderStore.getState().isDirty || 
                    usePidStore.getState().isDirty || 
                    useNyquistStore.getState().isDirty ||
                    useMarginStore.getState().isDirty ||
                    useDCMotorStore.getState().isDirty ||
                    useDisturbanceStore.getState().isDirty ||
                    useRouthStore.getState().isDirty ||
                    useAntiWindupStore.getState().isDirty ||
                    useTransferFunctionStore.getState().isDirty ||
                    useMassSpringStore.getState().isDirty ||
                    useSignalStore.getState().isDirty ||
                    useLeadLagStore.getState().isDirty ||
                    useZieglerNicholsStore.getState().isDirty;
    if (isDirty) {
      setPendingRoute(path);
      setIsWarningOpen(true);
    } else {
      AdPolicy.registerTransition();
      AdService.showInterstitial('navigation');
      setLocation(path);
    }
  };

  const handleConfirmLeave = () => {
    useFirstOrderStore.getState().markClean();
    useSecondOrderStore.getState().markClean();
    usePidStore.getState().markClean();
    useDCMotorStore.getState().markClean();
    useNyquistStore.getState().markClean();
    useMarginStore.getState().markClean();
    useDisturbanceStore.getState().markClean();
    useRouthStore.getState().markClean();
    useAntiWindupStore.getState().markClean();
    useTransferFunctionStore.getState().markClean();
    useMassSpringStore.getState().markClean();
    useSignalStore.getState().markClean();
    useLeadLagStore.getState().markClean();
    useZieglerNicholsStore.getState().markClean();
    setIsWarningOpen(false);
    
    AdPolicy.registerTransition();
    AdService.showInterstitial('navigation');
    
    if (pendingRoute) setLocation(pendingRoute);
  };

  useEffect(() => {
    import('@capacitor/splash-screen').then(m => m.SplashScreen.hide()).catch(() => {});
    useProjectStore.getState().loadProjects();
    
    // Push notifications back 24h to avoid spamming active users
    import('@/services/notifications/NotificationService').then(({ NotificationService }) => {
      import('@/store/useSettingsStore').then(({ useSettingsStore }) => {
        if (useSettingsStore.getState().notificationsEnabled) {
          NotificationService.schedulePracticeReminder(
            (t as any)('notification.practice.title'),
            (t as any)('notification.practice.body')
          );
        }
      });
    });
  }, []);

  const navItems = [
    { href: '/', icon: Home, label: (t as any)('nav.home') },
    { href: '/labs', icon: FlaskConical, label: (t as any)('nav.labs') },
    { href: '/practice', icon: Target, label: (t as any)('nav.practice') },
    { href: '/projects', icon: Folder, label: (t as any)('nav.projects') },
    { href: '/settings', icon: Settings, label: (t as any)('nav.settings') }
  ];

  return (
    <div className="h-[100dvh] bg-background-base text-text-primary font-sans flex flex-col relative w-full overflow-hidden">
      <ToastContainer />
      <ConfirmDialog 
        isOpen={isWarningOpen} 
        title={(t as any)('workspace.unsavedChanges')} 
        description={(t as any)('workspace.unsavedWarning')} 
        confirmText={(t as any)('common.leave')} 
        onConfirm={handleConfirmLeave} 
        onCancel={() => setIsWarningOpen(false)} 
        isDanger 
      />
      <main className="flex-1 flex flex-col w-full max-w-screen-xl mx-auto overflow-y-auto overflow-x-hidden min-h-0 relative z-0">
        <Switch>
          <Route component={HomeScreen} path="/" />
          <Route component={LabsExplorer} path="/labs" />
          <Route component={LabHost} path="/labs/:id" />
          <Route component={PracticeScreen} path="/practice" />
          <Route component={ProjectsScreen} path="/projects" />
          <Route component={SettingsScreen} path="/settings" />
          <Route>
            <div className="p-8 text-center">404 - Not Found</div>
          </Route>
        </Switch>
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 w-full bg-background-elevated/95 backdrop-blur-md z-[100] border-t border-border-subtle shadow-lg pb-[env(safe-area-inset-bottom)] pt-1 isolate">
        <div className="flex justify-around items-center h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            // Match exactly or if we are inside a sub-route (like /labs/pid)
            const isActive = item.href === '/' ? location === '/' : location.startsWith(item.href);
            return (
              <button 
                onClick={() => checkDirtyAndNavigate(item.href)}
                key={item.href} 
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'}`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
