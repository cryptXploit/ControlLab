import { useEffect, useState } from 'react';
import { Route, Switch, useLocation } from 'wouter';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useFirstOrderStore } from '@/store/useFirstOrderStore';
import { useSecondOrderStore } from '@/store/useSecondOrderStore';
import { usePidStore } from '@/store/usePidStore';
import { useDCMotorStore } from '@/store/useDCMotorStore';
import { useTranslation } from '@/store/useLocaleStore';
import { useProjectStore } from '@/store/useProjectStore';
import { initializeThemeListener } from '@/store/useThemeStore';
import HomeScreen from '@/features/home/HomeScreen';
import { LabsExplorer } from '@/features/labs/LabsExplorer';
import { LabHost } from '@/features/labs/LabHost';
import ProjectsScreen from '@/features/projects/ProjectsScreen';
import SettingsScreen from '@/features/settings/SettingsScreen';
import PracticeScreen from '@/features/practice/PracticeScreen';
import { Home, FlaskConical, Target, Folder, Settings } from 'lucide-react';
import { ToastContainer } from '@/components/ui/ToastContainer';

export default function App() {
  const { t } = useTranslation();
  const [location, setLocation] = useLocation();
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const checkDirtyAndNavigate = (path: string) => {
    const isDirty = useFirstOrderStore.getState().isDirty || 
                    useSecondOrderStore.getState().isDirty || 
                    usePidStore.getState().isDirty || 
                    useDCMotorStore.getState().isDirty;
    if (isDirty) {
      setPendingRoute(path);
      setIsWarningOpen(true);
    } else {
      setLocation(path);
    }
  };

  const handleConfirmLeave = () => {
    useFirstOrderStore.getState().markClean();
    useSecondOrderStore.getState().markClean();
    usePidStore.getState().markClean();
    useDCMotorStore.getState().markClean();
    setIsWarningOpen(false);
    if (pendingRoute) setLocation(pendingRoute);
  };

  useEffect(() => {
    import('@capacitor/splash-screen').then(m => m.SplashScreen.hide()).catch(() => {});
    const cleanupTheme = initializeThemeListener();
    useProjectStore.getState().loadProjects();
    return cleanupTheme;
  }, []);

  const navItems = [
    { href: '/', icon: Home, label: (t as any)('nav.home') },
    { href: '/labs', icon: FlaskConical, label: (t as any)('nav.labs') },
    { href: '/practice', icon: Target, label: (t as any)('nav.practice') },
    { href: '/projects', icon: Folder, label: (t as any)('nav.projects') },
    { href: '/settings', icon: Settings, label: (t as any)('nav.settings') }
  ];

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans flex flex-col relative w-full overflow-x-hidden">
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
      <main className="flex-1 flex flex-col w-full max-w-screen-xl mx-auto overflow-y-auto pb-24 overflow-x-hidden">
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
      <nav className="fixed bottom-0 w-full bg-bg-surface-elevated z-[100] border-t border-border-subtle shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe pt-1">
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
