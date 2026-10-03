import { useEffect } from 'react';
import { Route, Switch, Link, useLocation } from 'wouter';
import { useTranslation } from '@/store/useLocaleStore';
import { useProjectStore } from '@/store/useProjectStore';
import { initializeThemeListener } from '@/store/useThemeStore';
import HomeScreen from '@/features/home/HomeScreen';
import { LabsExplorer } from '@/features/labs/LabsExplorer';
import { LabHost } from '@/features/labs/LabHost';
import ProjectsScreen from '@/features/projects/ProjectsScreen';
import SettingsScreen from '@/features/settings/SettingsScreen';
import { Home, FlaskConical, Folder, Settings } from 'lucide-react';
import { ToastContainer } from '@/components/ui/ToastContainer';

export default function App() {
  const { t } = useTranslation();
  const [location] = useLocation();

  useEffect(() => {
    const cleanupTheme = initializeThemeListener();
    useProjectStore.getState().loadProjects();
    return cleanupTheme;
  }, []);

  const navItems = [
    { href: '/', icon: Home, label: (t as any)('nav.home') },
    { href: '/labs', icon: FlaskConical, label: (t as any)('nav.labs') },
    { href: '/projects', icon: Folder, label: (t as any)('nav.projects') },
    { href: '/settings', icon: Settings, label: (t as any)('nav.settings') }
  ];

  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans flex flex-col relative w-full overflow-x-hidden">
      <ToastContainer />
      <main className="flex-1 flex flex-col w-full max-w-screen-xl mx-auto overflow-y-auto pb-24 overflow-x-hidden">
        <Switch>
          <Route component={HomeScreen} path="/" />
          <Route component={LabsExplorer} path="/labs" />
          <Route component={LabHost} path="/labs/:id" />
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
              <Link href={item.href} key={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${isActive ? 'text-accent-primary' : 'text-text-muted hover:text-text-primary'}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
